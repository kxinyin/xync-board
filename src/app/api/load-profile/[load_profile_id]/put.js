import { connectToDatabase } from "@/src/lib/mongodb";
import { currentTime } from "@/src/lib/utils/timeUtils";
import { isEqual } from "lodash";
import { createLog } from "../../../../lib/createLog";

export async function PUT(request, { params }) {
  const { load_profile_id } = await params;

  const incomingData = await request.json();

  const { db } = await connectToDatabase();

  const COLLECTION = "load-profiles";
  const FILTER = { load_profile_id };

  // Prevent disabing if load_profile_id === 1
  if (load_profile_id === "1") incomingData.is_enabled = true;

  // Get existing data
  const logBeforeData = await db.collection(COLLECTION).findOne(FILTER);

  // Check for data differences
  const {
    _id: temp1,
    load_profile_id: temp2,
    created_at: temp3,
    updated_at: temp4,
    ...existingData
  } = logBeforeData;

  const isLoadProfileEqual = isEqual(existingData, incomingData);

  if (isLoadProfileEqual) {
    return new Response(
      JSON.stringify(
        {
          message: "Load profile details are already up-to-date",
          data: incomingData,
        },
        { status: 200 }
      )
    );
  }

  // Update load profile
  const result = await db.collection(COLLECTION).updateOne(FILTER, {
    $set: { ...incomingData, updated_at: currentTime() },
  });

  if (result.matchedCount === 0) {
    return new Response(
      JSON.stringify({ message: "Load profile not found", data: null }),
      { status: 404 }
    );
  }

  // Get updated data
  const updatedData = await db.collection(COLLECTION).findOne(FILTER);

  const message = "Load profile details updated successfully";

  await createLog({
    db,
    event_type: "LOAD_PROFILE_UPDATE",
    message,
    before: logBeforeData,
    after: updatedData,
  });

  const { _id, created_at, updated_at, ...returnData } = updatedData;

  return new Response(JSON.stringify({ message, data: returnData }), {
    status: 200,
  });
}
