import { API_PAGE_SIZE } from "@/src/lib/constants";
import { connectToDatabase } from "@/src/lib/mongodb";
import { getTableData } from "./_helpers";

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams;
  const page = searchParams.get("page") || 1;

  const PAGE = parseInt(page);
  const PAGE_SIZE = API_PAGE_SIZE;

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
      message: "Customers data retrieved successfully",
      data: customers,
    }),
    { status: 200 }
  );
}
