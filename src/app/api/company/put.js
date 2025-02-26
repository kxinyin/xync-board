import { connectToDatabase } from "@/src/lib/mongodb";
import { createLog } from "@/src/lib/createLog";
import { currentTime } from "@/src/lib/utils/timeUtils";
import { isEqual } from "lodash";

export async function PUT(request) {
  const incomingData = await request.json();

  const { db } = await connectToDatabase();

  const COLLECTION = "parameters";
  const FILTER = { parameter_id: "company_info" };

  // Get existing data
  const logBeforeData = await db.collection(COLLECTION).findOne(FILTER);

  // Check for data differences
  const {
    _id: temp1,
    parameter_id: temp2,
    updated_at: temp3,
    ...existingData
  } = logBeforeData;

  const isCompanyEqual = isEqual(existingData, incomingData);

  if (isCompanyEqual) {
    return new Response(
      JSON.stringify({
        message: "Company information is already up-to-date",
        data: incomingData,
      }),
      { status: 200 }
    );
  }

  // Update company
  const result = await db.collection(COLLECTION).updateOne(FILTER, {
    $set: { ...incomingData, updated_at: currentTime() },
  });

  if (result.matchedCount === 0) {
    return new Response(
      JSON.stringify({ message: "Company information not found", data: null }),
      { status: 404 }
    );
  }

  // Get updated data
  const updatedData = await db.collection(COLLECTION).findOne(FILTER);

  const message = "Company information updated successfully";

  await createLog({
    db,
    event_type: "COMPANY_INFO_UPDATE",
    message,
    before: logBeforeData,
    after: updatedData,
  });

  const { _id, parameter_id, updated_at, ...returnData } = updatedData;

  return new Response(JSON.stringify({ message, data: returnData }), {
    status: 200,
  });
}
