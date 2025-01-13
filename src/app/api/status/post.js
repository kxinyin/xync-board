import { connectToDatabase } from "@/src/lib/mongodb";
import { currentTime } from "@/src/services/moment";
import { createLog } from "../_helpers/createLog";

export async function POST(request) {
  const incomingData = await request.json();

  const { db } = await connectToDatabase();

  const COLLECTION = "statuses";

  // Get and update status id
  const parameter = await db
    .collection("parameters")
    .findOneAndUpdate(
      { parameter_id: "status_id" },
      { $inc: { next_no: 1 }, $set: { updated_at: currentTime() } }
    );

  const status_id = `${String(parameter.next_no).padStart(
    parameter.length,
    "0"
  )}`;

  // Add new status
  const result = await db.collection(COLLECTION).insertOne({
    status_id,
    ...incomingData,
    created_at: currentTime(),
    updated_at: "",
  });

  // Get updated data
  const updatedData = await db
    .collection(COLLECTION)
    .findOne({ _id: result.insertedId });

  const message = `New status added with code: ${updatedData.code}`;

  await createLog({
    db,
    event_type: "STATUS_CREATE",
    message,
    after: updatedData,
  });

  const { _id, ...returnData } = updatedData;

  return new Response(JSON.stringify({ message, data: returnData }), {
    status: 200,
  });
}
