import { createLog } from "@/src/lib/createLog";
import { connectToDatabase } from "@/src/lib/mongodb";

export async function DELETE(request, { params }) {
  const { agreement_id } = await params;

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

  const COLLECTION = "agreements";
  const FILTER = { agreement_id };

  // Get existing data
  const existingData = await db.collection(COLLECTION).findOne(FILTER);

  // Check for version difference
  const isVersionMatch = existingData.version === incomingData.version;

  if (!isVersionMatch) {
    return new Response(
      JSON.stringify({
        message:
          "Agreement details have been updated elsewhere. Please refresh and try again",
        data: null,
      }),
      { status: 409 }
    );
  }

  // Delete customer
  const result = await db.collection(COLLECTION).deleteOne(FILTER);

  if (result.deletedCount === 0) {
    return new Response(
      JSON.stringify({ message: "Agreement not found", data: null }),
      { status: 404 }
    );
  }

  const message = `Successfully deleted agreement: ${existingData.agreement_id}`;

  await createLog({
    db,
    event_type: "AGREEMENT_DELETE",
    message,
    before: existingData,
  });

  return new Response(JSON.stringify({ message, data: null }), { status: 200 });
}
