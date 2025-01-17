import { auth } from "@/src/auth";
import { currentTime } from "@/src/services/timeUtils";

export async function createLog({
  db,
  event_type,
  message,
  before = {},
  after = {},
  log_by,
}) {
  const log = {
    event_type,
    message,
    before,
    after,
    log_by,
    log_at: currentTime(),
  };

  if (!log_by) {
    const session = await auth();

    log.log_by = {
      employee_id: session?.user?.employee_id || "",
      name: session?.user?.name || "",
    };
  }

  db.collection("logs").insertOne(log);
}
