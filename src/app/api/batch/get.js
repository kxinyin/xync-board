import { API_PAGE_SIZE } from "@/src/lib/constants";
import { connectToDatabase } from "@/src/lib/mongodb";
import { aggregateClient, projectTableData } from "./_helpers";

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams;
  const PAGE_SIZE = API_PAGE_SIZE;

  let PAGE = parseInt(searchParams.get("page"), 10);

  if (isNaN(PAGE) || PAGE < 1) PAGE = 1;

  const { db } = await connectToDatabase();

  const batches = await db
    .collection("batches")
    .aggregate([
      { $skip: (PAGE - 1) * PAGE_SIZE },
      { $limit: PAGE_SIZE },
      ...aggregateClient,
      ...projectTableData,
    ])
    .toArray();

  if (!batches) {
    return new Response(
      JSON.stringify({ message: "No batches found", data: null }),
      { status: 404 }
    );
  }

  return new Response(
    JSON.stringify({
      message: `Successfully retrieved ${PAGE_SIZE} batches on page ${PAGE}`,
      data: batches,
    }),
    { status: 200 }
  );
}
