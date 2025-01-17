import { getCompanyInfo } from "@/src/services/api/company";
import AntdCompanyForm from "./antdCompanyForm";

export const metadata = {
  title: "Company | Xync Board",
  description: "Manage company details in the Xync Board admin section.",
};

export default async function AdminCompany() {
  const companyInfo = await getCompanyInfo();

  // TODO: Form validation

  return (
    <AntdCompanyForm data={companyInfo.success ? companyInfo.data : null} />
  );
}
