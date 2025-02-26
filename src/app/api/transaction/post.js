import { createLog } from "@/src/lib/createLog";
import { connectToDatabase } from "@/src/lib/mongodb";
import { currentTime } from "@/src/lib/utils/timeUtils";
import { v7 as uuidv7 } from "uuid";

export async function POST(request) {
  const searchParams = request.nextUrl.searchParams;
  const agreement_id = searchParams.get("agreement_id");
  const incomingData = await request.json();

  // Validate input
  if (!agreement_id) {
    return new Response(
      JSON.stringify({ message: "No agreement ID provided", data: null }),
      { status: 400 }
    );
  }

  if (!incomingData || Object.keys(incomingData).length === 0) {
    return new Response(
      JSON.stringify({ message: "No transaction data provided", data: null }),
      { status: 400 }
    );
  }

  const { db } = await connectToDatabase();

  const COLLECTION = "transactions";

  // Generate uuid
  const transaction_id = "TRX-" + uuidv7();

  // Add new transaction
  const result = await db.collection(COLLECTION).insertOne({
    transaction_id,
    agreement_id,
    ...incomingData,
    created_at: currentTime(),
    updated_at: "",
    version: 1,
  });

  // Get updated data
  const updatedData = await db
    .collection(COLLECTION)
    .findOne({ _id: result.insertedId });

  const message = `Successfully added new transaction for agreement: ${agreement_id}`;

  await createLog({
    db,
    event_type: "TRANSACTION_CREATE",
    message,
    after: updatedData,
  });

  const {
    _id: temp1,
    agreement_id: temp2,
    created_at: temp3,
    updated_at: temp4,
    ...returnData
  } = updatedData;

  return new Response(JSON.stringify({ message, data: returnData }), {
    status: 200,
  });
}
