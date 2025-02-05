import { connectToDatabase } from "@/src/lib/mongodb";
import { createLog } from "../../_helpers/createLog";

export async function DELETE(request, { params }) {
  const { load_profile_id } = await params;

  const { db } = await connectToDatabase();

  const COLLECTION = "load-profiles";
  const FILTER = { load_profile_id };

  // Prevent deletion if load _profile_id === 1
  if (load_profile_id === "1") {
    return new Response(
      JSON.stringify({
        message: "Default load profile cannot be deleted",
        data: null,
      }),
      { status: 400 }
    );
  }

  // Get existing data
  const existingData = await db.collection(COLLECTION).findOne(FILTER);

  // Delete load profile
  const result = await db.collection(COLLECTION).deleteOne(FILTER);

  if (result.deletedCount === 0) {
    return new Response(
      JSON.stringify({ message: "Load profile not found", data: null }),
      { status: 404 }
    );
  }

  const message = "Load profile deleted successfully";

  await createLog({
    db,
    event_type: "LOAD_PROFILE_DELETE",
    message,
    before: existingData,
  });

  return new Response(JSON.stringify({ message, data: null }), { status: 200 });
}
