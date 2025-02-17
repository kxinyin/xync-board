import { connectToDatabase } from "@/src/lib/mongodb";
import { createLog } from "../../_helpers/createLog";

export async function DELETE(request, { params }) {
  const { customer_id } = await params;

  const { db } = await connectToDatabase();

  const COLLECTION = "customers";
  const FILTER = { customer_id, is_enabled: true };

  // Get existing data
  const existingData = await db.collection(COLLECTION).findOne(FILTER);

  // Delete customer
  const result = await db.collection(COLLECTION).deleteOne(FILTER);

  if (result.deletedCount === 0) {
    return new Response(
      JSON.stringify({ message: "Customer not found", data: null }),
      { status: 404 }
    );
  }

  const message = "Customer deleted successfully";

  await createLog({
    db,
    event_type: "CUSTOMER_DELETE",
    message,
    before: existingData,
  });

  return new Response(JSON.stringify({ message, data: null }), { status: 200 });
}
