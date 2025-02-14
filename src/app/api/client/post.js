import { connectToDatabase } from "@/src/lib/mongodb";
import { currentTime } from "@/src/lib/utils/timeUtils";
import { createLog } from "../_helpers/createLog";

export async function POST(request) {
  const incomingData = await request.json();

  const { db } = await connectToDatabase();

  const COLLECTION = "clients";

  // Get and update client id
  const parameter = await db
    .collection("parameters")
    .findOneAndUpdate(
      { parameter_id: "client_id" },
      { $inc: { next_no: 1 }, $set: { updated_at: currentTime() } }
    );

  const client_id = `${String(parameter.next_no).padStart(
    parameter.length,
    "0"
  )}`;

  // Add new clients
  const result = await db.collection(COLLECTION).insertOne({
    client_id,
    ...incomingData,
    batch_next_no: 1,
    batch_updated_at: "",
    created_at: currentTime(),
    updated_at: "",
  });

  // Get updated data
  const updatedData = await db
    .collection(COLLECTION)
    .findOne({ _id: result.insertedId });

  const message = `New client added with name: ${updatedData.name}`;

  await createLog({
    db,
    event_type: "CLIENT_CREATE",
    message,
    after: updatedData,
  });

  const {
    _id: temp1,
    batch_updated_at: temp2,
    created_at: temp3,
    updated_at: temp4,
    ...returnData
  } = updatedData;

  return new Response(JSON.stringify({ message, data: returnData }), {
    status: 200,
  });
}
