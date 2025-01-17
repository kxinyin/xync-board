import { connectToDatabase } from "@/src/lib/mongodb";

export async function GET() {
  const { db } = await connectToDatabase();

  const roles = await db
    .collection("roles")
    .find(
      { is_enabled: true },
      { projection: { _id: 0, is_enabled: 0, created_at: 0, updated_at: 0 } }
    )
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
