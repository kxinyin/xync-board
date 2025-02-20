import { connectToDatabase } from "@/src/lib/mongodb";
import { createLog } from "@/src/lib/createLog";

export async function DELETE(request, { params }) {
  const { customer_id } = await params;

  // Validate input
  if (!customer_id) {
    return new Response(
      JSON.stringify({ message: "No customer ID provided", data: null }),
      { status: 400 }
    );
  }

  const { db } = await connectToDatabase();

  const COLLECTION = "customers";
  const FILTER = { customer_id };

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

  const message = `Successfully deleted customer: ${existingData.username}`;

  await createLog({
    db,
    event_type: "CUSTOMER_DELETE",
    message,
    before: existingData,
  });

  return new Response(JSON.stringify({ message, data: null }), { status: 200 });
}
