import { connectToDatabase } from "@/src/lib/mongodb";
import { createLog } from "../../_helpers/createLog";

export async function DELETE(request, { params }) {
  const { client_id } = await params;

  const { db } = await connectToDatabase();

  const COLLECTION = "clients";
  const FILTER = { client_id };

  // Get existing data
  const existingData = await db.collection(COLLECTION).findOne(FILTER);

  // Delete client
  const result = await db.collection(COLLECTION).deleteOne(FILTER);

  if (result.deletedCount === 0) {
    return new Response(
      JSON.stringify({ message: "Client not found", data: null }),
      { status: 404 }
    );
  }

  const message = "Client deleted successfully";

  await createLog({
    db,
    event_type: "CLIENT_DELETE",
    message,
    before: existingData,
  });

  return new Response(JSON.stringify({ message, data: null }), { status: 200 });
}
