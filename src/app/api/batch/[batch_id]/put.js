import { createLog } from "@/src/lib/createLog";
import { connectToDatabase } from "@/src/lib/mongodb";
import { currentTime } from "@/src/lib/utils/timeUtils";
import { isEqual } from "lodash";
import { aggregateClient, projectFullData } from "../_helpers";

export async function PUT(request, { params }) {
  const { batch_id } = await params;

  const incomingData = await request.json();

  // Incoming data sample
  // {
  //   "received_at": "2025-02-01",
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
  const FILTER = { batch_id };

  // Get existing data
  const logBeforeData = await db.collection(COLLECTION).findOne(FILTER);

  // Check for data differences
  const existingData = { received_at: logBeforeData.received_at };

  const hasSameBatch = isEqual(existingData, incomingData);

  if (hasSameBatch) {
    return new Response(
      JSON.stringify({
        message: "Batch details are already up-to-date",
        data: incomingData,
      }),
      { status: 200 }
    );
  }

  // Update batch
  const result = await db.collection(COLLECTION).updateOne(FILTER, {
    $set: { ...incomingData, updated_at: currentTime() },
  });

  if (result.matchedCount === 0) {
    return new Response(
      JSON.stringify({ message: "Batch not found", data: null }),
      { status: 404 }
    );
  }

  // Get updated data
  const updatedData = await db
    .collection(COLLECTION)
    .aggregate([{ $match: FILTER }, ...aggregateClient, ...projectFullData])
    .next();

  const { client_name, ...logAfterData } = updatedData;

  const message = `Successfully updated batch: ${client_name}-${updatedData.client_batch_no}`;

  await createLog({
    db,
    event_type: "BATCH_UPDATE",
    message,
    before: logBeforeData,
    after: logAfterData,
  });

  const { _id, client_id, updated_at, ...returnData } = updatedData;

  return new Response(JSON.stringify({ message, data: returnData }), {
    status: 200,
  });
}
