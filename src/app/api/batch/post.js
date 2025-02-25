import { createLog } from "@/src/lib/createLog";
import { generateId } from "@/src/lib/generateId";
import { connectToDatabase } from "@/src/lib/mongodb";
import { currentTime } from "@/src/lib/utils/timeUtils";
import { aggregateClient, projectFullData } from "./_helpers";

export async function POST(request) {
  const incomingData = await request.json();

  // Incoming data sample
  // {
  //   "client_id": "",
  //   "received_at": "",
  // }

  // Validate input
  if (!incomingData || Object.keys(incomingData).length === 0) {
    return new Response(
      JSON.stringify({ message: "No batch data provided", data: null }),
      { status: 400 }
    );
  }

  const { db } = await connectToDatabase();

  const COLLECTION = "batches";

  // Get and update batch no
  const client_batch = await db.collection("parameters").findOneAndUpdate(
    {
      parameter_id: "client_batch_no",
      "data.client_id": incomingData.client_id,
    },
    { $set: { "data.$.updated_at": currentTime() } },
    { $inc: { "data.$.next_no": 1 } },
    { projection: { _id: 0, "data.$": 1 }, returnDocument: "before" }
  );

  // Get and update batch id
  const batch_id = await generateId(db, "batch_id");

  // Add new batch
  const result = await db.collection(COLLECTION).insertOne({
    batch_id,
    client_batch_no: client_batch.data[0].next_no,
    ...incomingData,
    created_at: currentTime(),
    updated_at: "",
  });

  // Get updated data
  const updatedData = await db
    .collection(COLLECTION)
    .aggregate([
      { $match: { _id: result.insertedId } },
      ...aggregateClient,
      ...projectFullData,
    ])
    .next();

  const { client_name, ...logAfterData } = updatedData;

  const message = `Successfully added new batch: ${client_name}-${updatedData.client_batch_no}`;

  await createLog({
    db,
    event_type: "BATCH_CREATE",
    message,
    after: logAfterData,
  });

  const { _id, client_id, updated_at, ...returnData } = updatedData;

  return new Response(JSON.stringify({ message, data: returnData }), {
    status: 200,
  });
}
