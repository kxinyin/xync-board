import { getCustomer } from "@/src/services/api/customer";
import AntdSingleCustomerSummaryHeader from "./antdSummaryHeader";
import AntdSingleCustomerContent from "./antdContent";

export async function generateMetadata({ params }) {
  const customer_id = (await params).customer_id;

  const customer = await getCustomer(customer_id);

  const name = customer.success
    ? `${customer.data.name}`
    : `Customer: ${customer_id}`;

  return {
    title: `${name} | Xync Board`,
    description: `Details and information about ${name}. This page includes comprehensive customer details, agreement specifics, transaction history, employee notes, internal remarks, and follow-up details to ensure a holistic view of customer interactions and services.`,
  };
}

export default async function CustomerPage({ params }) {
  const customer_id = (await params).customer_id;

  const { success, data: customer } = await getCustomer(customer_id);
  // get agreement
  // get transaction
  // get follow up
  // get internal remark
  // get employee note

  // *Customer Form
  const customerData = {
    customer_id: "CUS-0000000001",
    name: "Lee Ah Hock",
    new_ic_no: "123456-12-1234",
    old_ic_no: "",
    age: 30,
    gender: "male",
    contact_no: ["60123456789", "60123456789"],
    address: [
      "8, Lrg 8, Taman JK 08000 Sungai Petani, Kedah",
      "8, Lrg 8, Taman JK 08000 Sungai Petani, Kedah",
    ],
    occupation: "accountant",
    guarantor: [
      {
        name: "Lee Ah Chai",
        ic_no: "123456-12-1234",
        contact_no: "60123456789",
        address: "8, Lrg 8, Taman JK 08000 Sungai Petani, Kedah",
        relationship: "Abang",
      },
    ],
    referrer: [
      {
        name: "Lee Ah Kaw",
        ic_no: "123456-12-1234",
        contact_no: "60123456789",
        address: "8, Lrg 8, Taman JK 08000 Sungai Petani, Kedah",
        relationship: "Kawan",
      },
    ],
    load_profile_id: "LP-2",
    load_profile_data: {
      no_plate: "ABC1234",
      model: "Suzuki",
      colour: "Grey",
    },
    batch_id: "BATCH-0000000001",
    client_id: "CLI-000001",
    employee_id: "EMP-00001",
    version: 1,
  };

  const clientsData = [
    {
      client_id: "CLI-000001",
      name: "Boon Hai Motor",
      contact_person: "Ms Mok",
    },
    {
      client_id: "CLI-000002",
      name: "Boon Hai Motor1",
      contact_person: "Ms Mok",
    },
  ];

  // TODO: Fetch batch when onChange client
  const batchesData = [
    { batch_id: "BATCH-0000000001", client_batch_no: 1 },
    { batch_id: "BATCH-0000000007", client_batch_no: 3 },
    { batch_id: "BATCH-0000000008", client_batch_no: 4 },
  ];

  const employeesData = [{ employee_id: "EMP-00001", name: "Xinyin" }];

  const loadProfilesData = [
    {
      load_profile_id: "LP-2",
      name: "MOTOR",
      columns: [
        {
          name: "No. Plate",
          excel_name: "NO PLATE",
          multiple: false,
        },
        {
          excel_name: "MODEL",
          name: "Model",
          multiple: false,
        },
        {
          name: "Colour",
          excel_name: "MODEL COLOUR",
          multiple: false,
        },
      ],
    },
  ];

  // *Agreement Form
  const agreementData = [
    {
      agreement_id: "AGR-1f8b6b12-3c0d-4f9e-8e2d-7a4f1b7e5c6a",
      agreement_no: "AGG12345678",
      agreement_date: "2025-01-01",
      agreement_expiry_date: "2025-06-01",
      amount: 2000,
      commission_amount: 400,
      total_amount: 2400,
      next_call_at: "2025-02-14T15:34:27+08:00",
      status_id: "STAT-001",
      version: 1,
    },
  ];

  const statusesData = [
    { status_id: "STAT-001", code: "ABORT", color: "#ac7171" },
  ];

  // *Transaction Form
  const transactionData = [
    {
      transaction_id: "TRX-9d2a0f78-64e1-4b9b-9f0c-b8d5b14a2f3e",
      amount: 250,
      paid_at: "2025-02-02",
      version: 1,
    },
    {
      transaction_id: "TRX-9d2a0f78-64e1-4b9b-9f0c-b8d5b14a2f3e",
      amount: 250,
      paid_at: "2025-02-02",
      version: 1,
    },
  ];

  return (
    <section className="px-6">
      <AntdSingleCustomerSummaryHeader />
      <AntdSingleCustomerContent
        clientsData={clientsData}
        batchesData={batchesData}
        employeesData={employeesData}
        loadProfilesData={loadProfilesData}
        statusesData={statusesData}
      />
    </section>
  );
}
