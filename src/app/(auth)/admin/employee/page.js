import { getEmployees } from "@/src/services/api/employee";
import { getRoleOptions } from "@/src/services/api/role";
import { getBranchOptions } from "@/src/services/api/company";
import AntdEmployeeTable from "./antdEmployeeTable";

export const metadata = {
  title: "Employee | Xync Board",
  description: "Manage employee in the Xync Board admin section.",
};

export default async function AdminEmployee() {
  const employees = await getEmployees();
  const roles = await getRoleOptions();
  const branches = await getBranchOptions();

  // TODO: Form validation

  return (
    <AntdEmployeeTable
      employeesData={employees.success ? employees.data : null}
      rolesData={roles.success ? roles.data : null}
      branchesData={branches.success ? branches.data : null}
    />
  );
}
