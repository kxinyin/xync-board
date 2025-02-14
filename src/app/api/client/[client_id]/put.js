import { connectToDatabase } from "@/src/lib/mongodb";
import { currentTime } from "@/src/lib/utils/timeUtils";
import { isEqual } from "lodash";
import { createLog } from "../../_helpers/createLog";

export async function PUT(request, { params }) {
  const { client_id } = await params;

  const incomingData = await request.json();

  const { db } = await connectToDatabase();

  const COLLECTION = "clients";
  const FILTER = { client_id };

  // Get existing data
  const logBeforeData = await db.collection(COLLECTION).findOne(FILTER);

  // Check for data differences
  const {
    _id: temp1,
    client_id: temp2,
    batch_next_no: temp3,
    batch_updated_at: temp4,
    created_at: temp5,
    updated_at: temp6,
    ...existingData
  } = logBeforeData;

  const isClientEqual = isEqual(existingData, incomingData);

  if (isClientEqual) {
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
  const updatedData = await db.collection(COLLECTION).findOne(FILTER);

  const message = "Client details updated successfully";

  await createLog({
    db,
    event_type: "CLIENT_UPDATE",
    message,
    before: logBeforeData,
    after: updatedData,
  });

  const { _id, batch_updated_at, created_at, updated_at, ...returnData } =
    updatedData;

  return new Response(JSON.stringify({ message, data: returnData }), {
    status: 200,
  });
}
