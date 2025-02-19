import { generateId } from "@/src/lib/generateId";
import { connectToDatabase } from "@/src/lib/mongodb";
import { createLog } from "@/src/lib/createLog";
import { currentTime } from "@/src/lib/utils/timeUtils";

export async function POST(request) {
  const incomingData = await request.json();

  const { db } = await connectToDatabase();

  const COLLECTION = "customers";

  // Get and update ids
  const customer_id = generateId(db, "customer_id");

  // Add new customer
  const result = await db.collection(COLLECTION).insertOne({
    customer_id,
    ...incomingData,
    assigned_at: incomingData.employee_id ? currentTime() : "",
    created_at: currentTime(),
    updated_at: "",
    version: 1,
  });

  // Get updated data
  const updatedData = await db
    .collection(COLLECTION)
    .findOne({ _id: result.insertedId });

  const message = `New customer added with name: ${updatedData.name}`;

  await createLog({
    db,
    event_type: "CUSTOMER_CREATE",
    message,
    after: updatedData,
  });

  const returnData = { customer_id: updatedData.customer_id };

  return new Response(JSON.stringify({ message, data: returnData }), {
    status: 200,
  });
}
