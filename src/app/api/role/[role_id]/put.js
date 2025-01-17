import { connectToDatabase } from "@/src/lib/mongodb";
import { currentTime } from "@/src/services/timeUtils";
import { createLog } from "../../_helpers/createLog";
import {
  handleOperations,
  lookupEmployee,
  lookupPermission,
  projectEmployee,
  projectPermission,
} from "../_helpers";
import { isEqual } from "lodash";

export async function PUT(request, { params }) {
  const { role_id } = await params;

  const incomingData = await request.json();

  const { db } = await connectToDatabase();

  const COLLECTION = "roles";
  const FILTER = { role_id };

  // Get existing data
  const logBeforeData = await db
    .collection(COLLECTION)
    .aggregate([
      { $match: FILTER },
      lookupPermission,
      {
        $project: {
          _id: 1,
          role_id: 1,
          name: 1,
          is_enabled: 1,
          created_at: 1,
          updated_at: 1,
          ...projectPermission,
        },
      },
    ])
    .next();

  // Check for data differences
  const {
    _id: temp1,
    role_id: temp2,
    created_at: temp3,
    updated_at: temp4,
    ...existingData
  } = logBeforeData;

  const isRoleEqual = isEqual(existingData, incomingData);

  if (isRoleEqual) {
    return new Response(
      JSON.stringify({
        message: "Role details are already up-to-date",
        data: incomingData,
      }),
      { status: 200 }
    );
  }

  // Update role
  const { permission, ...roleData } = incomingData;

  const result = await db.collection(COLLECTION).updateOne(FILTER, {
    $set: { ...roleData, updated_at: currentTime() },
  });

  if (result.matchedCount === 0) {
    return new Response(
      JSON.stringify({ message: "Role not found", data: null }),
      { status: 404 }
    );
  }

  // Update permissions
  const operations = handleOperations(role_id, permission);
  await db.collection("permissions").bulkWrite(operations);

  // Get updated data
  const updatedData = await db
    .collection(COLLECTION)
    .aggregate([
      { $match: FILTER },
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

  const message = "Role details updated successfully";

  const { employee_count, ...logData } = updatedData;

  await createLog({
    db,
    event_type: "ROLE_UPDATE",
    message,
    before: logBeforeData,
    after: logData,
  });

  const { _id, created_at, updated_at, ...returnData } = updatedData;

  return new Response(JSON.stringify({ message, data: returnData }), {
    status: 200,
  });
}
