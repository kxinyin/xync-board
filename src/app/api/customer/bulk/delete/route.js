import { createLog } from "@/src/lib/createLog";
import { connectToDatabase } from "@/src/lib/mongodb";

export async function DELETE(request) {
  const { customer_id: customer_ids } = await request.json();

  // Validate input
  if (
    !customer_ids ||
    !Array.isArray(customer_ids) ||
    customer_ids.length === 0
  ) {
    return new Response(
      JSON.stringify({ message: "No customer IDs provided", data: null }),
      { status: 400 }
    );
  }

  const { db } = await connectToDatabase();

  const COLLECTION = "customers";
  const FILTER = { customer_id: { $in: customer_ids.map((id) => id) } };

  // Get existing data
  const existingData = await db.collection(COLLECTION).find(FILTER).toArray();

  // Bulk delete customers
  const result = await db.collection(COLLECTION).deleteMany(FILTER);

  if (result.deletedCount === 0) {
    return new Response(
      JSON.stringify({ message: "Customers not found", data: null }),
      { status: 404 }
    );
  }

  const total = customer_ids.length;
  const total_deleted = result.deletedCount;
  const total_failed = total - total_deleted;

  const message =
    total_failed > 0
      ? `${total_deleted} out of ${total} customers deleted successfully, ${total_failed} customers were not found`
      : `${total_deleted} customers deleted successfully`;

  await createLog({
    db,
    event_type: "CUSTOMER_BULK_DELETE",
    message,
    before: existingData,
  });

  return new Response(JSON.stringify({ message, data: null }), { status: 200 });
}
