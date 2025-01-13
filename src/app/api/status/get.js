import { connectToDatabase } from "@/src/lib/mongodb";

export async function GET() {
  const { db } = await connectToDatabase();

  const status = await db
    .collection("statuses")
    .aggregate([
      {
        $lookup: {
          from: "roles",
          let: {
            flag_array: "$flag",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ["$role_id", "$$flag_array"],
                },
                is_enabled: true,
              },
            },
            {
              $project: {
                role_id: 1,
                name: 1,
              },
            },
          ],
          as: "flag_name",
        },
      },
      {
        $project: {
          _id: 0,
          status_id: 1,
          code: 1,
          description: 1,
          color: 1,
          flag: 1,
          is_enabled: 1,
          flag_name: {
            $map: {
              input: "$flag_name",
              as: "flag_name",
              in: "$$flag_name.name",
            },
          },
        },
      },
    ])
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
