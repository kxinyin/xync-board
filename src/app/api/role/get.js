import { connectToDatabase } from "@/src/lib/mongodb";
import {
  lookupEmployee,
  lookupPermission,
  projectEmployee,
  projectPermission,
} from "./_helpers";

export async function GET() {
  const { db } = await connectToDatabase();

  const roles = await db
    .collection("roles")
    .aggregate([
      lookupEmployee,
      lookupPermission,
      {
        $project: {
          _id: 0,
          role_id: 1,
          name: 1,
          is_enabled: 1,
          ...projectEmployee,
          ...projectPermission,
        },
      },
    ])
    .toArray();

  if (!roles) {
    return new Response(
      JSON.stringify({ message: "No roles found", data: null }),
      { status: 404 }
    );
  }

  return new Response(
    JSON.stringify({
      message: "Roles data retrieved successfully",
      data: roles,
    }),
    { status: 200 }
  );
}
