import { connectToDatabase } from "@/src/lib/mongodb";
import { currentTime } from "@/src/services/timeUtils";
import { createLog } from "../_helpers/createLog";

export async function POST(request) {
  const incomingData = await request.json();

  const { db } = await connectToDatabase();

  const COLLECTION = "load-profiles";

  // Get and update load profile id
  const parameter = await db
    .collection("parameters")
    .findOneAndUpdate(
      { parameter_id: "load_profile_id" },
      { $inc: { next_no: 1 }, $set: { updated_at: currentTime() } }
    );

  const load_profile_id = `${String(parameter.next_no).padStart(
    parameter.length,
    "0"
  )}`;

  // Add new load profile
  const result = await db.collection(COLLECTION).insertOne({
    load_profile_id,
    ...incomingData,
    created_at: currentTime(),
    updated_at: "",
  });

  // Get updated data
  const updatedData = await db
    .collection(COLLECTION)
    .findOne({ _id: result.insertedId });

  const message = `New load profile added with name: ${updatedData.name}`;

  await createLog({
    db,
    event_type: "LOAD_PROFILE_CREATE",
    message,
    after: updatedData,
  });

  const { _id, created_at, updated_at, ...returnData } = updatedData;

  return new Response(JSON.stringify({ message, data: returnData }), {
    status: 200,
  });
}
