import { getCompanyInfo } from "@/src/services/api/company";
import AntdCompanyForm from "./antdCompanyForm";

export default async function AdminCompany() {
  const companyInfo = await getCompanyInfo();

  // TODO: Form validation

  return (
    <AntdCompanyForm data={companyInfo.success ? companyInfo.data : null} />
  );
}
