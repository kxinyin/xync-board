import { currentTime } from "./utils/timeUtils";

export async function generateId(db, parameter_id) {
  const parameter = await db
    .collection("parameters")
    .findOneAndUpdate(
      { parameter_id },
      { $inc: { next_no: 1 }, $set: { updated_at: currentTime() } }
    );

  const prefix = parameter.prefix || "";

  return `${prefix}${prefix ? "-" : ""}${String(parameter.next_no).padStart(
    parameter.length,
    "0"
  )}`;
}
