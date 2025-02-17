import { connectToDatabase } from "@/src/lib/mongodb";
import { createLog } from "../../../../lib/createLog";
import {
  handleOperations,
  lookupPermission,
  projectPermission,
} from "../_helpers";

export async function DELETE(request, { params }) {
  const { role_id } = await params;

  const { db } = await connectToDatabase();

  const COLLECTION = "roles";
  const FILTER = { role_id };

  // Get existing data
  const existingData = await db
    .collection(COLLECTION)
    .aggregate([
      { $match: FILTER },
      lookupPermission,
      {
        $project: {
          _id: 1,
          role_id: 1,
          name: 1,
          is_enabled: 1,
          created_at: 1,
          updated_at: 1,
          ...projectPermission,
        },
      },
    ])
    .next();

  // Delete role
  const result = await db.collection(COLLECTION).deleteOne(FILTER);

  if (result.deletedCount === 0) {
    return new Response(
      JSON.stringify({ message: "Role not found", data: null }),
      { status: 404 }
    );
  }

  // Update permissions
  const operations = handleOperations(role_id, []);
  await db.collection("permissions").bulkWrite(operations);

  const message = "Role deleted successfully";

  await createLog({
    db,
    event_type: "ROLE_DELETE",
    message,
    before: existingData,
  });

  return new Response(JSON.stringify({ message, data: null }), { status: 200 });
}
