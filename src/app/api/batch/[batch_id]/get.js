import { connectToDatabase } from "@/src/lib/mongodb";
import { aggregateClient, projectTableData } from "../_helpers";

export async function GET(request, { params }) {
  const { batch_id } = await params;

  const { db } = await connectToDatabase();

  const batch = await db
    .collection("batches")
    .aggregate([
      { $match: { batch_id } },
      ...aggregateClient,
      ...projectTableData,
    ])
    .next();

  if (!batch) {
    return new Response(
      JSON.stringify({ message: "Batch not found", data: null }),
      { status: 404 }
    );
  }

  return new Response(
    JSON.stringify({
      message: `Successfully retrieved batch: ${batch.client_name}-${batch.client_batch_no}`,
      data: batch,
    }),
    { status: 200 }
  );
}
