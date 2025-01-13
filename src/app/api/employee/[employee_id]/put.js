import { connectToDatabase } from "@/src/lib/mongodb";
import { createLog } from "@/src/app/api/_helpers/createLog";
import { currentTime } from "@/src/services/moment";
import { isEqual } from "lodash";

export async function PUT(request, { params }) {
  const { employee_id } = await params;

  const incomingData = await request.json();

  const { db } = await connectToDatabase();

  const COLLECTION = "employees";
  const FILTER = { employee_id };

  // Get existing data
  const logBeforeData = await db.collection(COLLECTION).findOne(FILTER);

  // Check for data differences
  const {
    _id: temp1,
    password: temp2,
    created_at: temp3,
    updated_at: temp4,
    ...existingData
  } = logBeforeData;

  const isEmployeeEqual = isEqual(existingData, incomingData);

  if (isEmployeeEqual) {
    return new Response(
      JSON.stringify({
        message: "Employee details are already up-to-date",
        data: incomingData,
      }),
      { status: 200 }
    );
  }

  // Update employee
  const result = await db.collection(COLLECTION).updateOne(FILTER, {
    $set: { ...incomingData, updated_at: currentTime() },
  });

  if (result.matchedCount === 0) {
    return new Response(
      JSON.stringify({ message: "Employee not found", data: null }),
      { status: 404 }
    );
  }

  // Get updated data
  const updatedData = await db.collection(COLLECTION).findOne(FILTER);

  const message = "Employee details updated successfully";

  await createLog({
    db,
    event_type: "EMPLOYEE_UPDATE",
    message,
    before: logBeforeData,
    after: updatedData,
  });

  const { _id, password, created_at, updated_at, ...returnData } = updatedData;

  return new Response(JSON.stringify({ message, data: returnData }), {
    status: 200,
  });
}
