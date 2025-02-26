import { API_PAGE_SIZE } from "@/src/lib/constants";
import { connectToDatabase } from "@/src/lib/mongodb";
import { getTableData } from "./_helpers";

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams;
  const PAGE_SIZE = API_PAGE_SIZE;

  let PAGE = parseInt(searchParams.get("page"), 10);

  if (isNaN(PAGE) || PAGE < 1) PAGE = 1;

  const { db } = await connectToDatabase();

  const customers = await db
    .collection("customers")
    .aggregate([
      { $skip: (PAGE - 1) * PAGE_SIZE },
      { $limit: PAGE_SIZE },
      ...getTableData(),
    ])
    .toArray();

  if (!customers) {
    return new Response(
      JSON.stringify({ message: "No customers found", data: null }),
      { status: 404 }
    );
  }

  return new Response(
    JSON.stringify({
      message: `Successfully retrieved ${customers.length} customers on page ${PAGE}`,
      data: customers,
    }),
    { status: 200 }
  );
}
