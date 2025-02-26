import { connectToDatabase } from "@/src/lib/mongodb";

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams;
  const agreement_id = searchParams.get("agreement_id");

  if (!agreement_id) {
    return new Response(
      JSON.stringify({ message: "No agreement ID provided", data: null }),
      { status: 400 }
    );
  }

  const { db } = await connectToDatabase();

  const transactions = await db
    .collection("transactions")
    .find(
      { agreement_id },
      {
        projection: {
          _id: 0,
          transaction_id: 1,
          amount: 1,
          paid_at: 1,
          receipt_no: 1,
          collected_by: 1,
          created_by: 1,
          version: 1,
        },
      }
    )
    .toArray();

  if (!transactions) {
    return new Response(
      JSON.stringify({ message: "No transactions found", data: null }),
      { status: 404 }
    );
  }

  return new Response(
    JSON.stringify({
      message: `Successfully retrieved all transactions for agreement: ${agreement_id}`,
      data: transactions,
    }),
    { status: 200 }
  );
}
