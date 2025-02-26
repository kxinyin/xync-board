import { createLog } from "@/src/lib/createLog";
import { connectToDatabase } from "@/src/lib/mongodb";

export async function DELETE(request, { params }) {
  const { transaction_id } = await params;

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

  const COLLECTION = "transactions";
  const FILTER = { transaction_id };

  // Get existing data
  const existingData = await db.collection(COLLECTION).findOne(FILTER);

  // Check for version difference
  const isVersionMatch = existingData.version === incomingData.version;

  if (!isVersionMatch) {
    return new Response(
      JSON.stringify({
        message:
          "Transaction details have been updated elsewhere. Please refresh and try again",
        data: null,
      }),
      { status: 409 }
    );
  }

  // Delete transaction
  const result = await db.collection(COLLECTION).deleteOne(FILTER);

  if (result.deletedCount === 0) {
    return new Response(
      JSON.stringify({ message: "Transaction not found", data: null }),
      { status: 404 }
    );
  }

  const message = `Successfully deleted transaction: ${existingData.transaction_id}`;

  await createLog({
    db,
    event_type: "TRANSACTION_DELETE",
    message,
    before: existingData,
  });

  return new Response(JSON.stringify({ message, data: null }), { status: 200 });
}
