import { connectToDatabase } from "@/src/lib/mongodb";
import {
  aggregateNextNo,
  lookupBatchList,
  projectBatchList,
} from "../_helpers";

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams;

  const validateParam = (param) => {
    const value = searchParams.get(param)?.trim();
    if (value == "1") return 1;
    if (value == "0" || !value) return 0;

    return new Response(
      JSON.stringify({
        message: `Invalid value for '${param}'. Must be '1' or '0'`,
        data: null,
      }),
      { status: 400 }
    );
  };

  // Validate input
  const hasBatchList = validateParam("batchList");
  const hasNextNo = validateParam("nextNo");

  if (hasBatchList instanceof Response) return hasBatchList;
  if (hasNextNo instanceof Response) return hasNextNo;

  const { db } = await connectToDatabase();

  const clients = await db
    .collection("clients")
    .aggregate([
      { $match: { is_enabled: true } },
      ...(hasBatchList ? lookupBatchList : []),
      ...(hasNextNo ? aggregateNextNo : []),
      {
        $project: {
          _id: 0,
          client_id: 1,
          name: 1,
          ...(hasBatchList ? projectBatchList : {}),
          ...(hasNextNo ? { next_no: 1 } : {}),
        },
      },
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
      message: "Successfully retrieved clients for selection",
      data: clients,
    }),
    { status: 200 }
  );
}
