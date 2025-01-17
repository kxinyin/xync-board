import { getRoles } from "@/src/services/api/role";
import { getSystemModuleOptions } from "@/src/services/api/parameter";
import AntdRoleTable from "./antdRoleTable";

export const metadata = {
  title: "Role | Xync Board",
  description: "Manage role in the Xync Board admin section.",
};

export default async function AdminRole() {
  const roles = await getRoles();
  const modules = await getSystemModuleOptions();

  // TODO: Form validation

  return (
    <AntdRoleTable
      rolesData={roles.success ? roles.data : null}
      modulesData={modules.success ? modules.data : null}
    />
  );
}
