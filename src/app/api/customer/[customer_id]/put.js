import { connectToDatabase } from "@/src/lib/mongodb";
import { currentTime } from "@/src/lib/utils/timeUtils";
import { isEqual } from "lodash";
import { createLog } from "../../_helpers/createLog";

export async function PUT(request, { params }) {
  const { customer_id } = await params;

  const incomingData = await request.json();

  const { db } = await connectToDatabase();

  const COLLECTION = "customers";
  const FILTER = { customer_id, is_enabled: true };

  // Get exiting data
  const logBeforeData = await db.collection(COLLECTION).findOne(FILTER);

  // Check for data differences *check version*
  const {
    _id: temp1,
    customer_id: temp2,
    assigned_at: temp3,
    created_at: temp4,
    updated_at: temp5,
    ...existingData
  } = logBeforeData;

  const isCustomerEqual = isEqual(existingData, incomingData);

  if (isCustomerEqual) {
    return new Response(
      JSON.stringify({
        message: "Customer details are already up-to-date",
        data: incomingData,
      }),
      { status: 200 }
    );
  }

  // Check for employee id differences
  const isEmployeeEqual = isEqual(
    existingData.employee_id,
    incomingData.employee_id
  );

  // Update customer
  const result = await db.collection(COLLECTION).updateOne(FILTER, {
    $set: {
      ...incomingData,
      assigned_at: isEmployeeEqual ? existingData.assigned_at : currentTime(),
      updated_at: currentTime(),
    },
  });

  if (result.matchedCount === 0) {
    return new Response(
      JSON.stringify({ message: "Customer not found", data: null }),
      { status: 404 }
    );
  }

  // Get updated data
  const updatedData = await db.collection(COLLECTION).findOne(FILTER);

  const message = "Customer details updated successfully";

  await createLog({
    db,
    event_type: "CUSTOMER_UPDATE",
    message,
    before: logBeforeData,
    after: updatedData,
  });

  const returnData = { customer_id: updatedData.customer_id };

  return new Response(JSON.stringify({ message, data: returnData }), {
    status: 200,
  });
}
