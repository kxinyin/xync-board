import { getClients } from "@/src/services/api/client";
import { getClientTypeOptions } from "@/src/services/api/parameter";
import AntdClientTable from "./antdClientTable";

export const metadata = {
  title: "Client | Xync Board",
  description: "Welcome to the client dashboard of Xync Board.",
};

export default async function ClientPage() {
  const clients = await getClients();
  const clientTypes = await getClientTypeOptions();

  return (
    <section className="px-6">
      <AntdClientTable
        clientsData={clients.success ? clients.data : null}
        typesData={clientTypes.success ? clientTypes.data : null}
      />
    </section>
  );
}
