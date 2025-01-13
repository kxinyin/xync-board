import { getRoles } from "@/src/services/api/role";
import { getModuleOptions } from "@/src/services/api/parameter";
import AntdRoleTable from "./antdRoleTable";

export default async function AdminRole() {
  const roles = await getRoles();
  const modules = await getModuleOptions();

  // TODO: Form validation

  return (
    <AntdRoleTable
      rolesData={roles.success ? roles.data : null}
      modulesData={modules.success ? modules.data : null}
    />
  );
}
