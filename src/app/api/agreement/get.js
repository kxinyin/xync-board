import { connectToDatabase } from "@/src/lib/mongodb";

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams;
  const customer_id = searchParams.get("customer_id");

  if (!customer_id) {
    return new Response(
      JSON.stringify({ message: "No customer ID provided", data: null }),
      { status: 400 }
    );
  }

  const { db } = await connectToDatabase();

  const agreements = await db
    .collection("agreements")
    .aggregate([
      { $match: { customer_id } },
      {
        $lookup: {
          from: "statuses",
          localField: "status_id",
          foreignField: "status_id",
          as: "status_info",
          pipeline: [{ $match: { is_enabled: true } }],
        },
      },
      {
        $unwind: { path: "$status_info", preserveNullAndEmptyArrays: true },
      },
      {
        $project: {
          _id: 0,
          agreement_id: 1,
          agreement_no: 1,
          agreement_date: 1,
          agreement_expiry_date: 1,
          amount: 1,
          commission_amount: 1,
          total_amount: 1,
          next_call_at: 1,
          version: 1,
          status_id: 1,
          status_code: "$status_info.code",
          status_color: "$status_info.color",
        },
      },
    ])
    .next();

  if (!agreements) {
    return new Response(
      JSON.stringify({ message: "No agreements found", data: null }),
      { status: 404 }
    );
  }

  return new Response(
    JSON.stringify({
      message: `Successfully retrieved agreement for customer: ${customer_id}`,
      data: agreements,
    }),
    { status: 200 }
  );
}
