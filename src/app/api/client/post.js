import { connectToDatabase } from "@/src/lib/mongodb";
import { currentTime } from "@/src/lib/utils/timeUtils";
import { createLog } from "../../../lib/createLog";
import { generateId } from "@/src/lib/generateId";
import { aggregateTotalBatch } from "./_helpers";

export async function POST(request) {
  const incomingData = await request.json();

  // Validate input
  if (!incomingData || Object.keys(incomingData).length === 0) {
    return new Response(
      JSON.stringify({ message: "No client data provided", data: null }),
      { status: 400 }
    );
  }

  const { db } = await connectToDatabase();

  const COLLECTION = "clients";

  // Get and update client id
  const client_id = await generateId(db, "client_id");

  // Add new clients
  const result = await db.collection(COLLECTION).insertOne({
    client_id,
    ...incomingData,
    created_at: currentTime(),
    updated_at: "",
  });

  // Add new client batch no
  await db.collection("parameters").updateOne(
    {
      parameter_id: "client_batch_no",
      "data.client_id": { $ne: client_id },
    },
    { $push: { data: { client_id, next_no: 1, updated_at: "" } } }
  );

  // Get updated data
  const updatedData = await db
    .collection(COLLECTION)
    .aggregate([{ $match: { _id: result.insertedId } }, ...aggregateTotalBatch])
    .next();

  const { total_batch, ...logAfterData } = updatedData;

  const message = `Successfully added new client: ${updatedData.name}`;

  await createLog({
    db,
    event_type: "CLIENT_CREATE",
    message,
    after: logAfterData,
  });

  const { _id, created_at, updated_at, ...returnData } = updatedData;

  return new Response(JSON.stringify({ message, data: returnData }), {
    status: 200,
  });
}
