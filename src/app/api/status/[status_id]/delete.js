import { connectToDatabase } from "@/src/lib/mongodb";
import { createLog } from "../../_helpers/createLog";

export async function DELETE(request, { params }) {
  const { status_id } = await params;

  const { db } = await connectToDatabase();

  const COLLECTION = "statuses";
  const FILTER = { status_id };

  // Get existing data
  const existingData = await db.collection(COLLECTION).findOne(FILTER);

  // Delete status
  const result = await db.collection(COLLECTION).deleteOne(FILTER);

  if (result.deletedCount === 0) {
    return new Response(
      JSON.stringify({ message: "Status not found", data: null }),
      { status: 404 }
    );
  }

  const message = "Status deleted successfully";

  await createLog({
    db,
    event_type: "STATUS_DELETE",
    message,
    before: existingData,
  });

  return new Response(JSON.stringify({ message, data: null }), { status: 200 });
}
