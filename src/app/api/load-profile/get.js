import { connectToDatabase } from "@/src/lib/mongodb";

export async function GET() {
  const { db } = await connectToDatabase();

  const load_profiles = await db
    .collection("load-profiles")
    .find({}, { projection: { _id: 0, created_at: 0, updated_at: 0 } })
    .toArray();

  if (!load_profiles) {
    return new Response(
      JSON.stringify({ message: "No load profile found", data: null }),
      { status: 404 }
    );
  }

  return new Response(
    JSON.stringify({
      message: "Load profiles data retrieved successfully",
      data: load_profiles,
    }),
    { status: 200 }
  );
}
