import AntdBatchTable from "./antdBatchTable";

export const metadata = {
  title: "Batch | Xync Board",
  description: "Manage batch in the Xync Board customer section.",
};

export default function CustomerBatch() {
  // get batches

  return (
    <section className="px-6">
      <AntdBatchTable />
    </section>
  );
}
