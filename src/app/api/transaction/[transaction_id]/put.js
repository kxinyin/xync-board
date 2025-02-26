import { createLog } from "@/src/lib/createLog";
import { connectToDatabase } from "@/src/lib/mongodb";
import { currentTime } from "@/src/lib/utils/timeUtils";
import { isEqual } from "lodash";

export async function PUT(request, { params }) {
  const { transaction_id } = await params;

  const incomingData = await request.json();

  // Validate input
  if (!incomingData || Object.keys(incomingData).length === 0) {
    return new Response(
      JSON.stringify({ message: "No transaction data provided", data: null }),
      { status: 400 }
    );
  }

  if (
    !("version" in incomingData) ||
    typeof incomingData.version !== "number" ||
    !Number.isInteger(incomingData.version)
  ) {
    return new Response(
      JSON.stringify({
        message: "Version is required and must be a integer",
        data: null,
      }),
      { status: 400 }
    );
  }

  const { db } = await connectToDatabase();

  const COLLECTION = "transactions";
  const FILTER = { transaction_id };

  // Get existing data
  const logBeforeData = await db.collection(COLLECTION).findOne(FILTER);

  // Check for version difference
  const { version: incomingVersion, ...filteredData } = incomingData;

  const isVersionMatch = logBeforeData.version === incomingVersion;

  if (!isVersionMatch) {
    return new Response(
      JSON.stringify({
        message:
          "Transaction details have been updated elsewhere. Please refresh and try again",
        data: null,
      }),
      { status: 409 }
    );
  }

  // Check for data differences
  const {
    _id: temp1,
    transaction_id: temp2,
    agreement_id: temp3,
    created_at: temp4,
    updated_at: temp5,
    version: temp6,
    ...existingData
  } = logBeforeData;

  const hasSameTransaction = isEqual(existingData, filteredData);

  if (hasSameTransaction) {
    return new Response(
      JSON.stringify({
        message: "Transaction details are already up-to-date",
        data: incomingData,
      }),
      { status: 200 }
    );
  }

  // Update transaction
  const result = await db.collection(COLLECTION).updateOne(FILTER, {
    $set: { ...filteredData, updated_at: currentTime() },
    $inc: { version: 1 },
  });

  if (result.matchedCount === 0) {
    return new Response(
      JSON.stringify({ message: "Transaction not found", data: null }),
      { status: 404 }
    );
  }

  // Get updated data
  const updatedData = await db.collection(COLLECTION).findOne(FILTER);

  const message = `Successfully updated transaction: ${updatedData.transaction_id}`;

  await createLog({
    db,
    event_type: "TRANSACTION_UPDATE",
    message,
    before: logBeforeData,
    after: updatedData,
  });

  const {
    _id: temp7,
    agreement_id: temp8,
    created_at: temp9,
    updated_at: temp10,
    ...returnData
  } = updatedData;

  return new Response(JSON.stringify({ message, data: returnData }), {
    status: 200,
  });
}
