import { connectToDatabase } from "@/src/lib/mongodb";
import { currentTime } from "@/src/lib/utils/timeUtils";
import { isEqual } from "lodash";
import { createLog } from "@/src/lib/createLog";

export async function PUT(request, { params }) {
  const { customer_id } = await params;

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
      JSON.stringify({ message: "No customer data provided", data: null }),
      { status: 400 }
    );
  }

  if (
    !("version" in incomingData) ||
    typeof incomingData.version !== "number"
  ) {
    return new Response(
      JSON.stringify({
        message: "Version is required and must be a number",
        data: null,
      }),
      { status: 400 }
    );
  }

  const { db } = await connectToDatabase();

  const COLLECTION = "customers";
  const FILTER = { customer_id };

  // Get exiting data
  const logBeforeData = await db.collection(COLLECTION).findOne(FILTER);

  // Check for version difference
  const { version: incomingVersion, ...filteredData } = incomingData;

  const isVersionMatch = logBeforeData.version === incomingVersion;

  if (!isVersionMatch) {
    return new Response(
      JSON.stringify({
        message:
          "Customer data has been updated elsewhere. Please refresh and try again.",
        data: null,
      }),
      { status: 409 }
    );
  }

  // Check for data differences
  const {
    _id: temp1,
    customer_id: temp2,
    assigned_at: temp3,
    created_at: temp4,
    updated_at: temp5,
    version: temp6,
    ...existingData
  } = logBeforeData;

  const hasSameCustomer = isEqual(existingData, filteredData);

  if (hasSameCustomer) {
    return new Response(
      JSON.stringify({
        message: "Customer details are already up-to-date",
        data: incomingData,
      }),
      { status: 200 }
    );
  }

  // Check for employee id difference
  const isEmployeeMatch = existingData.employee_id === incomingData.employee_id;

  // Update customer
  const result = await db.collection(COLLECTION).updateOne(FILTER, {
    $set: {
      ...filteredData,
      assigned_at: isEmployeeMatch ? logBeforeData.assigned_at : currentTime(),
      updated_at: currentTime(),
    },
    $inc: { version: 1 },
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
