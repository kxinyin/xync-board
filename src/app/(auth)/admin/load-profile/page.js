import { getLoadProfiles } from "@/src/services/api/load-profile";
import AntdProfileTable from "./antdProfileTable";

export const metadata = {
  title: "Client Load Profile | Xync Board",
  description: "Manage client load profile in the Xync Board admin section.",
};

export default async function AdminClientLoadProfile() {
  const loadProfiles = await getLoadProfiles();

  return (
    <AntdProfileTable
      loadProfilesData={loadProfiles.success ? loadProfiles.data : null}
    />
  );
}
