import { API_PAGE_SIZE } from "@/src/lib/constants";
import { connectToDatabase } from "@/src/lib/mongodb";
import { aggregateTotalBatch } from "./_helpers";

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams;
  const PAGE_SIZE = API_PAGE_SIZE;

  let PAGE = parseInt(searchParams.get("page")?.trim(), 10);

  if (isNaN(PAGE) || PAGE < 1) PAGE = 1;

  const { db } = await connectToDatabase();

  const clients = await db
    .collection("clients")
    .aggregate([
      { $skip: (PAGE - 1) * PAGE_SIZE },
      { $limit: PAGE_SIZE },
      ...aggregateTotalBatch,
      { $project: { _id: 0, created_at: 0, updated_at: 0 } },
    ])
    .toArray();

  if (clients.length === 0) {
    return new Response(
      JSON.stringify({ message: "No clients found", data: [] }),
      { status: 404 }
    );
  }

  return new Response(
    JSON.stringify({
      message: `Successfully retrieved ${clients.length} clients on page ${PAGE}`,
      data: clients,
    }),
    { status: 200 }
  );
}
