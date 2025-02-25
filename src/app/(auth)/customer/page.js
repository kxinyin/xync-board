import AntdCustomersTable from "./antdCustomersTable";

export const metadata = {
  title: "Customer | Xync Board",
  description: "Welcome to the customer dashboard of Xync Board.",
};

export default async function CustomerPage() {
  // // CUSTOMER
  // const defaultGuarantorReference = {
  //   name: "",
  //   ic_no: "",
  //   contact_no: "",
  //   address: "",
  //   relationship: "",
  // };

  // const defaultCustomer = {
  //   name: "",
  //   new_ic_no: "",
  //   old_ic_no: "",
  //   age: 0,
  //   gender: "",
  //   contact_no: [""],
  //   address: [""],
  //   occupation: "",
  //   guarantor: [],
  //   referrer: [],
  //   load_profile_id: "",
  //   load_profile_data: {},
  //   client_id: "",
  //   batch_id: "",
  //   employee_id: "",
  // };

  // // AGREEMENT
  // const defaultAgreement = {
  //   agreement_no: "",
  //   agreement_date: "",
  //   agreement_expiry_date: "",
  //   amount: "",
  //   commission_amount: "",
  //   total_amount: "",
  //   status: "",
  //   next_call_at: "",
  // };

  // // TRANSACTION
  // const defaultTransaction = {
  //   amount: "",
  //   paid_at: "",
  // };

  return (
    <section className="px-6">
      <AntdCustomersTable />
    </section>
  );
}
