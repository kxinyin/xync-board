import { connectToDatabase } from "@/src/lib/mongodb";

export async function GET() {
  const { db } = await connectToDatabase();

  const types = await db
    .collection("parameters")
    .findOne(
      { parameter_id: "client_types" },
      { projection: { _id: 0, type: 1 } }
    );

  if (!types) {
    return new Response(
      JSON.stringify({ message: "No client types found", data: null }),
      { status: 404 }
    );
  }

  return new Response(
    JSON.stringify({
      message: "Client types data retrieved successfully",
      data: types.type,
    }),
    { status: 200 }
  );
}
