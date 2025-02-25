import { createLog } from "@/src/lib/createLog";
import { connectToDatabase } from "@/src/lib/mongodb";
import { aggregateClient, projectFullData } from "../_helpers";

export async function DELETE(request, { params }) {
  const { batch_id } = await params;

  const { db } = await connectToDatabase();

  const COLLECTION = "batches";
  const FILTER = { batch_id };

  // Get existing data
  const existingData = await db
    .collection(COLLECTION)
    .aggregate([{ $match: FILTER }, ...aggregateClient, ...projectFullData])
    .next();

  // Delete batch
  const result = await db.collection(COLLECTION).deleteOne(FILTER);

  if (result.deletedCount === 0) {
    return new Response(
      JSON.stringify({ message: "Batch not found", data: null }),
      { status: 404 }
    );
  }

  const { client_name, ...logAfterData } = existingData;

  const message = `Successfully deleted batch: ${client_name}-${existingData.client_batch_no}`;

  await createLog({
    db,
    event_type: "BATCH_DELETE",
    message,
    before: logAfterData,
  });

  return new Response(JSON.stringify({ message, data: null }), { status: 200 });
}
