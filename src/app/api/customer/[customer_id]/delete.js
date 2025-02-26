import { connectToDatabase } from "@/src/lib/mongodb";
import { createLog } from "@/src/lib/createLog";

export async function DELETE(request, { params }) {
  const { customer_id } = await params;

  const incomingData = await request.json();

  // Validate input
  if (
    !("version" in incomingData) ||
    typeof incomingData.version !== "number" ||
    !Number.isInteger(incomingData.version)
  ) {
    return new Response(
      JSON.stringify({
        message: "Version is required and must be a integer",
        data: null,
      }),
      { status: 400 }
    );
  }

  const { db } = await connectToDatabase();

  const COLLECTION = "customers";
  const FILTER = { customer_id };

  // Get existing data
  const existingData = await db.collection(COLLECTION).findOne(FILTER);

  // Check for version difference
  const isVersionMatch = existingData.version === incomingData.version;

  if (!isVersionMatch) {
    return new Response(
      JSON.stringify({
        message:
          "Customer details have been updated elsewhere. Please refresh and try again",
        data: null,
      }),
      { status: 409 }
    );
  }

  // Delete customer
  const result = await db.collection(COLLECTION).deleteOne(FILTER);

  if (result.deletedCount === 0) {
    return new Response(
      JSON.stringify({ message: "Customer not found", data: null }),
      { status: 404 }
    );
  }

  const message = `Successfully deleted customer: ${existingData.name}`;

  await createLog({
    db,
    event_type: "CUSTOMER_DELETE",
    message,
    before: existingData,
  });

  return new Response(JSON.stringify({ message, data: null }), { status: 200 });
}
