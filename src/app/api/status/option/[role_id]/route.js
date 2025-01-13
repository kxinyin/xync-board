import { connectToDatabase } from "@/src/lib/mongodb";

export async function GET(request, { params }) {
  const { role_id } = await params;

  const { db } = await connectToDatabase();

  const status = await db
    .collection("statuses")
    .find(
      { is_enabled: true, flag: { $in: [String(role_id)] } },
      { projection: { _id: 0, status_id: 1, code: 1, color: 1 } }
    )
    .toArray();

  if (!status) {
    return new Response(
      JSON.stringify({ message: "No status found", data: null }),
      { status: 404 }
    );
  }

  return new Response(
    JSON.stringify({
      message: "Status data retrieved successfully",
      data: status,
    }),
    { status: 200 }
  );
}
