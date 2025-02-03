import { connectToDatabase } from "@/src/lib/mongodb";

export async function GET() {
  const { db } = await connectToDatabase();

  const loadProfiles = await db
    .collection("load-profiles")
    .find(
      { load_profile_id: { $ne: "1" }, is_enabled: true },
      {
        projection: {
          _id: 0,
          columns: 0,
          is_enabled: 0,
          created_at: 0,
          updated_at: 0,
        },
      }
    )
    .toArray();

  if (!loadProfiles) {
    return new Response(
      JSON.stringify({ message: "No load profiles found", data: null }),
      { status: 404 }
    );
  }

  return new Response(
    JSON.stringify({
      message: "Load profiles data retrieved successfully",
      data: loadProfiles,
    }),
    { status: 200 }
  );
}
