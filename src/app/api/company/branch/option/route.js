import { connectToDatabase } from "@/src/lib/mongodb";

export async function GET() {
  const { db } = await connectToDatabase();

  const branches = await db
    .collection("parameters")
    .aggregate([
      { $match: { parameter_id: "company_info" } },
      { $unwind: "$branch" },
      { $project: { _id: 0, branch_id: "$branch.name", name: "$branch.name" } },
    ])
    .toArray();

  if (!branches) {
    return new Response(
      JSON.stringify({ message: "No company branches found", data: null }),
      { status: 404 }
    );
  }

  return new Response(
    JSON.stringify({
      message: "Company branches data retrieved successfully",
      data: branches,
    }),
    { status: 200 }
  );
}
