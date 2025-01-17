import { connectToDatabase } from "@/src/lib/mongodb";

export async function GET() {
  const { db } = await connectToDatabase();

  const modules = await db
    .collection("parameters")
    .aggregate([
      { $match: { parameter_id: "system_modules" } },
      { $unwind: "$module" },
      { $project: { _id: 0, id: "$module.id", name: "$module.name" } },
    ])
    .toArray();

  if (!modules) {
    return new Response(
      JSON.stringify({ message: "No system modules found", data: null }),
      { status: 404 }
    );
  }

  return new Response(
    JSON.stringify({
      message: "System modules data retrieved successfully",
      data: modules,
    }),
    { status: 200 }
  );
}
