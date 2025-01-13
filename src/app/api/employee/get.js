import { connectToDatabase } from "@/src/lib/mongodb";

export async function GET() {
  const { db } = await connectToDatabase();

  const employees = await db
    .collection("employees")
    .aggregate([
      {
        $lookup: {
          from: "roles",
          localField: "role_id",
          foreignField: "role_id",
          as: "role_details",
        },
      },
      { $unwind: "$role_details" },
      {
        $addFields: {
          role_name: "$role_details.name",
        },
      },
      {
        $project: {
          _id: 0,
          password: 0,
          created_at: 0,
          updated_at: 0,
          role_details: 0,
        },
      },
    ])
    .toArray();

  if (!employees) {
    return new Response(
      JSON.stringify({ message: "No employees found", data: null }),
      { status: 404 }
    );
  }

  return new Response(
    JSON.stringify({
      message: "Employees data retrieved successfully",
      data: employees,
    }),
    { status: 200 }
  );
}
