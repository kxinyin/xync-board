import { connectToDatabase } from "@/src/lib/mongodb";

export async function GET() {
  const { db } = await connectToDatabase();

  const defaultLoadProfileId = "LP-1";

  const loadProfiles = await db
    .collection("load-profiles")
    .find(
      { load_profile_id: { $ne: defaultLoadProfileId }, is_enabled: true },
      {
        projection: {
          _id: 0,
          is_enabled: 0,
          created_at: 0,
          updated_at: 0,
        },
      }
    )
    .toArray();

  if (loadProfiles.length === 0) {
    return new Response(
      JSON.stringify({ message: "No load profiles found", data: [] }),
      { status: 404 }
    );
  }

  return new Response(
    JSON.stringify({
      message: "Successfully retrieved load profiles for selection",
      data: loadProfiles,
    }),
    { status: 200 }
  );
}
