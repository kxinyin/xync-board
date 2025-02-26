import { connectToDatabase } from "@/src/lib/mongodb";

export async function GET(request, { params }) {
  const { role_id } = await params;

  const { db } = await connectToDatabase();

  const status = await db
    .collection("statuses")
    .find(
      {
        is_enabled: true,
        flag: { $in: [role_id.trim().toUpperCase()] },
      },
      { projection: { _id: 0, status_id: 1, code: 1, color: 1 } }
    )
    .toArray();

  if (status.length === 0) {
    return new Response(
      JSON.stringify({ message: "No status found", data: [] }),
      { status: 404 }
    );
  }

  return new Response(
    JSON.stringify({
      message: `Successfully retrieved all statuses for role: ${role_id}`,
      data: status,
    }),
    { status: 200 }
  );
}
