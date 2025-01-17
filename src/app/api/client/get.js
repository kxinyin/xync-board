import { connectToDatabase } from "@/src/lib/mongodb";

export async function GET() {
  const { db } = await connectToDatabase();

  const clients = await db
    .collection("clients")
    .find(
      {},
      {
        projection: {
          _id: 0,
          batch_updated_at: 0,
          created_at: 0,
          updated_at: 0,
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
