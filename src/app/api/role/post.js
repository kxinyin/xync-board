import { connectToDatabase } from "@/src/lib/mongodb";
import { currentTime } from "@/src/services/moment";
import { createLog } from "../_helpers/createLog";
import {
  handleOperations,
  lookupEmployee,
  lookupPermission,
  projectEmployee,
  projectPermission,
} from "./_helpers";

export async function POST(request) {
  const incomingData = await request.json();

  const { db } = await connectToDatabase();

  const COLLECTION = "roles";

  // Get and update role id
  const parameter = await db
    .collection("parameters")
    .findOneAndUpdate(
      { parameter_id: "role_id" },
      { $inc: { next_no: 1 }, $set: { updated_at: currentTime() } }
    );

  const role_id = `${String(parameter.next_no).padStart(
    parameter.length,
    "0"
  )}`;

  // Add new role
  const { permission, ...roleData } = incomingData;

  const result = await db.collection(COLLECTION).insertOne({
    role_id,
    ...roleData,
    created_at: currentTime(),
    updated_at: "",
  });

  // Update permission
  const operations = handleOperations(role_id, permission);
  await db.collection("permissions").bulkWrite(operations);

  // Get updated data
  const updatedData = await db
    .collection(COLLECTION)
    .aggregate([
      { $match: { _id: result.insertedId } },
      lookupEmployee,
      lookupPermission,
      {
        $project: {
          _id: 1,
          role_id: 1,
          name: 1,
          is_enabled: 1,
          created_at: 1,
          updated_at: 1,
          ...projectEmployee,
          ...projectPermission,
        },
      },
    ])
    .next();

  const message = `New role added with name: ${updatedData.name}`;

  const { employee_count, ...logData } = updatedData;

  await createLog({
    db,
    event_type: "ROLE_CREATE",
    message,
    after: logData,
  });

  const { _id, created_at, updated_at, ...returnData } = updatedData;

  return new Response(JSON.stringify({ message, data: returnData }), {
    status: 200,
  });
}
