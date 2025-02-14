import { connectToDatabase } from "@/src/lib/mongodb";
import { currentTime } from "@/src/lib/utils/timeUtils";
import { isEqual } from "lodash";
import { createLog } from "../../_helpers/createLog";

export async function PUT(request, { params }) {
  const { status_id } = await params;

  const incomingData = await request.json();

  const { db } = await connectToDatabase();

  const COLLECTION = "statuses";
  const FILTER = { status_id };

  // Get existing data
  const logBeforeData = await db.collection(COLLECTION).findOne(FILTER);

  // Check for data differences
  const {
    _id: temp1,
    status_id: temp2,
    created_at: temp3,
    updated_at: temp4,
    ...existingData
  } = logBeforeData;

  const isStatusEqual = isEqual(existingData, incomingData);

  if (isStatusEqual) {
    return new Response(
      JSON.stringify({
        message: "Status details are already up-to-date",
        data: incomingData,
      }),
      { status: 200 }
    );
  }

  // Update status
  const result = await db.collection(COLLECTION).updateOne(FILTER, {
    $set: { ...incomingData, updated_at: currentTime() },
  });

  if (result.matchedCount === 0) {
    return new Response(
      JSON.stringify({ message: "Status not found", data: null }),
      { status: 404 }
    );
  }

  // Get updated data
  const updatedData = await db.collection(COLLECTION).findOne(FILTER);

  const message = "Status details updated successfully";

  await createLog({
    db,
    event_type: "STATUS_UPDATE",
    message,
    before: logBeforeData,
    after: updatedData,
  });

  const { _id, ...returnData } = updatedData;

  return new Response(JSON.stringify({ message, data: returnData }), {
    status: 200,
  });
}
