import { connectToDatabase } from "@/src/lib/mongodb";

export async function GET() {
  const { db } = await connectToDatabase();

  const clients = await db
    .collection("clients")
    .find(
      { is_enabled: true },
      {
        projection: {
          _id: 0,
          client_id: 1,
          name: 1,
          batch_no: 1,
        },
      }
    )
    .toArray();

  if (!clients) {
    return new Response(
      JSON.stringify({ message: "No clients found", data: null }),
      { status: 404 }
    );
  }

  return new Response(
    JSON.stringify({
      message: "Clients data retrieved successfully",
      data: clients,
    }),
    { status: 200 }
  );
}
