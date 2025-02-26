import { createLog } from "@/src/lib/createLog";
import { connectToDatabase } from "@/src/lib/mongodb";
import { currentTime } from "@/src/lib/utils/timeUtils";
import { v7 as uuidv7 } from "uuid";

export async function POST(request) {
  const searchParams = request.nextUrl.searchParams;
  const customer_id = searchParams.get("customer_id");
  const incomingData = await request.json();

  // Validate input
  if (!customer_id) {
    return new Response(
      JSON.stringify({ message: "No customer ID provided", data: null }),
      { status: 400 }
    );
  }

  if (!incomingData || Object.keys(incomingData).length === 0) {
    return new Response(
      JSON.stringify({ message: "No agreement data provided", data: null }),
      { status: 400 }
    );
  }

  const { db } = await connectToDatabase();

  const COLLECTION = "agreements";

  // Generate uuid
  const agreement_id = "AGR-" + uuidv7();

  // Add new agreement
  const result = await db.collection(COLLECTION).insertOne({
    agreement_id,
    customer_id,
    ...incomingData,
    created_at: currentTime(),
    updated_at: "",
    version: 1,
  });

  // Get updated data
  const updatedData = await db
    .collection(COLLECTION)
    .findOne({ _id: result.insertedId });

  const message = `Successfully added new agreement for customer: ${customer_id}`;

  await createLog({
    db,
    event_type: "AGREEMENT_CREATE",
    message,
    after: updatedData,
  });

  const {
    _id: temp1,
    customer_id: temp2,
    created_at: temp3,
    updated_at: temp4,
    ...returnData
  } = updatedData;

  return new Response(JSON.stringify({ message, data: returnData }), {
    status: 200,
  });
}
