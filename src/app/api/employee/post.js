import { connectToDatabase } from "@/src/lib/mongodb";
import { createLog } from "@/src/app/api/_helpers/createLog";
import { currentTime } from "@/src/services/timeUtils";
import { hash } from "bcrypt";
import { BCRYPT_SALT_ROUNDS } from "@/src/lib/constants";

export async function POST(request) {
  const incomingData = await request.json();

  const { db } = await connectToDatabase();

  const COLLECTION = "employees";

  // Check username existence
  const existingData = await db
    .collection(COLLECTION)
    .findOne({ username: incomingData.username });

  if (existingData) {
    return new Response(
      JSON.stringify({ message: "Username is already taken", data: null }),
      { status: 409 }
    );
  }

  // Get and update employee id
  const parameter = await db
    .collection("parameters")
    .findOneAndUpdate(
      { parameter_id: "employee_id" },
      { $inc: { next_no: 1 }, $set: { updated_at: currentTime() } }
    );

  const employee_id = `${String(parameter.next_no).padStart(
    parameter.length,
    "0"
  )}`;

  // Hash password
  const hashedPassword = await hash(incomingData.password, BCRYPT_SALT_ROUNDS);
  incomingData.password = hashedPassword;

  // Add new employee
  const result = await db.collection(COLLECTION).insertOne({
    employee_id,
    ...incomingData,
    created_at: currentTime(),
    updated_at: "",
  });

  // Get updated data
  const updatedData = await db
    .collection(COLLECTION)
    .findOne({ _id: result.insertedId });

  const message = `New employee added with username: ${updatedData.username}`;

  await createLog({
    db,
    event_type: "EMPLOYEE_CREATE",
    message,
    after: updatedData,
  });

  const {
    _id: temp1,
    password: temp2,
    created_at: temp3,
    updated_at: temp4,
    ...returnData
  } = updatedData;

  return new Response(JSON.stringify({ message, data: returnData }), {
    status: 200,
  });
}
