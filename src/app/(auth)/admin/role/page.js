import { getRoles } from "@/src/services/api/role";
import { getModuleOptions } from "@/src/services/api/parameter";
import AntdRoleTable from "./antdRoleTable";

export const metadata = {
  title: "Role | Xync Board",
  description: "Manage role in the Xync Board admin section.",
};

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
