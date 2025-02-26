import { connectToDatabase } from "@/src/lib/mongodb";
import { currentTime } from "@/src/lib/utils/timeUtils";
import { isEqual } from "lodash";
import { createLog } from "../../../../lib/createLog";
import { aggregateTotalBatch } from "../_helpers";

export async function PUT(request, { params }) {
  const newParams = await params;
  const client_id = newParams.client_id.trim().toUpperCase();

  const incomingData = await request.json();

  // Validate input
  if (!incomingData || Object.keys(incomingData).length === 0) {
    return new Response(
      JSON.stringify({ message: "No client data provided", data: null }),
      { status: 400 }
    );
  }

  const { db } = await connectToDatabase();

  const COLLECTION = "clients";
  const FILTER = { client_id };

  // Get existing data
  const logBeforeData = await db.collection(COLLECTION).findOne(FILTER);

  if (!logBeforeData) {
    return new Response(
      JSON.stringify({ message: "Client not found", data: null }),
      { status: 404 }
    );
  }

  // Check for data differences
  const {
    _id: temp1,
    client_id: temp2,
    created_at: temp3,
    updated_at: temp4,
    ...existingData
  } = logBeforeData;

  const hasSameClient = isEqual(existingData, incomingData);

  if (hasSameClient) {
    return new Response(
      JSON.stringify({
        message: "Client details are already up-to-date",
        data: incomingData,
      }),
      { status: 200 }
    );
  }

  // Update client
  const result = await db.collection(COLLECTION).updateOne(FILTER, {
    $set: { ...incomingData, updated_at: currentTime() },
  });

  if (result.matchedCount === 0) {
    return new Response(
      JSON.stringify({ message: "Client not found", data: null }),
      { status: 404 }
    );
  }

  // Get updated data
  const updatedData = await db
    .collection(COLLECTION)
    .aggregate([{ $match: FILTER }, ...aggregateTotalBatch])
    .next();

  const { total_batch, ...logAfterData } = updatedData;

  const message = `Successfully updated client: ${updatedData.name}`;

  await createLog({
    db,
    event_type: "CLIENT_UPDATE",
    message,
    before: logBeforeData,
    after: logAfterData,
  });

  const { _id, created_at, updated_at, ...returnData } = updatedData;

  return new Response(JSON.stringify({ message, data: returnData }), {
    status: 200,
  });
}
