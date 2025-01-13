import { getRoleOptions } from "@/src/services/api/role";
import { getStatus } from "@/src/services/api/status";
import AntdStatusTable from "./antdStatusTable";

export default async function AdminStatusControl() {
  const status = await getStatus();
  const roles = await getRoleOptions();

  // TODO: test case - flag filter when role is disabled
  // TODO: Form validation
  // TODO: Color picker - preset color?

  return (
    <AntdStatusTable
      statusData={status.success ? status.data : null}
      rolesData={roles.success ? roles.data : null}
    />
  );
}
