import { connectToDatabase } from "@/src/lib/mongodb";
import { createLog } from "../../../../lib/createLog";

export async function DELETE(request, { params }) {
  const newParams = await params;
  const client_id = newParams.client_id.trim().toUpperCase();

  const { db } = await connectToDatabase();

  const COLLECTION = "clients";
  const FILTER = { client_id };

  // Get existing data
  const existingData = await db.collection(COLLECTION).findOne(FILTER);

  if (!existingData) {
    return new Response(
      JSON.stringify({ message: "Client not found", data: null }),
      { status: 404 }
    );
  }

  // Delete client
  const result = await db.collection(COLLECTION).deleteOne(FILTER);

  if (result.deletedCount === 0) {
    return new Response(
      JSON.stringify({ message: "Client not found", data: null }),
      { status: 404 }
    );
  }

  // Delete client batch no
  await db
    .collection("parameters")
    .updateOne(
      { parameter_id: "client_batch_no" },
      { $pull: { data: { client_id } } }
    );

  const message = `Successfully deleted client: ${existingData.name}`;

  await createLog({
    db,
    event_type: "CLIENT_DELETE",
    message,
    before: existingData,
  });

  return new Response(JSON.stringify({ message, data: null }), { status: 200 });
}
