function aggregateBatch() {
  return [
    {
      $lookup: {
        from: "batches",
        localField: "batch_id",
        foreignField: "batch_id",
        as: "batch_info",
      },
    },
    {
      $unwind: {
        path: "$batch_info",
        preserveNullAndEmptyArrays: true,
      },
    },
  ];
}

function aggregateClient() {
  return [
    {
      $lookup: {
        from: "clients",
        localField: "client_id",
        foreignField: "client_id",
        as: "client_info",
        pipeline: [{ $match: { is_enabled: true } }],
      },
    },
    {
      $unwind: {
        path: "$client_info",
        preserveNullAndEmptyArrays: true,
      },
    },
  ];
}

function aggregateEmployee() {
  return [
    {
      $lookup: {
        from: "employees",
        localField: "employee_id",
        foreignField: "employee_id",
        as: "employee_info",
        pipeline: [{ $match: { is_enabled: true } }],
      },
    },
    {
      $unwind: {
        path: "$employee_info",
        preserveNullAndEmptyArrays: true,
      },
    },
  ];
}

export function getTableData() {
  return [
    ...aggregateBatch(),
    ...aggregateClient(),
    ...aggregateEmployee(),
    {
      $lookup: {
        from: "agreements",
        localField: "customer_id",
        foreignField: "customer_id",
        as: "agreement_info",
      },
    },
    {
      $unwind: {
        path: "$agreement_info",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "statuses",
        localField: "agreement_info.status",
        foreignField: "status_id",
        as: "status_info",
        pipeline: [{ $match: { is_enabled: true } }],
      },
    },
    {
      $unwind: {
        path: "$status_info",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "transactions",
        localField: "agreement_info.agreement_id",
        foreignField: "agreement_id",
        as: "transaction_info",
      },
    },
    {
      $addFields: {
        sorted_transactions: {
          $sortArray: {
            input: "$transaction_info",
            sortBy: {
              paid_date: -1,
            },
          },
        },
      },
    },
    {
      $addFields: {
        last_paid_date: {
          $ifNull: [
            {
              $arrayElemAt: ["$sorted_transactions.paid_at", 0],
            },
            "",
          ],
        },
      },
    },
    {
      $project: {
        _id: 0,
        customer_id: 1,
        batch_no: {
          $ifNull: [
            {
              $concat: [
                "$client_info.name",
                "-",
                { $toString: "$batch_info.client_batch_no" },
              ],
            },
            "$client_info.name",
          ],
        },
        name: 1,
        new_ic_no: 1,
        old_ic_no: 1,
        age: 1,
        no_plate: {
          $ifNull: ["$load_profile_data.no_plate", null],
        },
        model: {
          $ifNull: ["$load_profile_data.model", null],
        },
        employee_username: "$employee_info.username",
        agreement_no: "$agreement_info.agreement_no",
        agreement_date: "$agreement_info.agreement_date",
        amount: "$agreement_info.amount",
        next_call_at: "$agreement_info.next_call_at",
        status: "$status_info.code",
        status_color: "$status_info.color",
        total_paid: {
          $sum: "$transaction_info.amount",
        },
        last_paid_date: 1,
      },
    },
  ];
}

export function getSingleData(customer_id) {
  return [
    { $match: { customer_id, is_enabled: true } },
    ...aggregateBatch(),
    ...aggregateClient(),
    ...aggregateEmployee(),
    {
      $project: {
        _id: 0,
        customer_id: 1,
        name: 1,
        new_ic_no: 1,
        old_ic_no: 1,
        age: 1,
        gender: 1,
        contact_no: 1,
        address: 1,
        occupation: 1,
        guarantor: 1,
        referrer: 1,
        load_profile_id: 1, // ? mandatory?
        load_profile_data: 1,
        client_id: "$client_info.client_id",
        client_name: "$client_info.name",
        client_contact_person: "$client_info.contact_person",
        client_contact_no: "$client_info.contact_no_1",
        client_type: "$client_info.client_type",
        client_commission_rate: "$client_info.commission_rate",
        batch_id: "$batch_info.batch_id",
        batch_no: "$batch_info.client_batch_no",
        batch_received_at: "$batch_info.received_at",
        batch_created_at: "$batch_info.created_at",
        employee_id: "$employee_info.employee_id",
        employee_username: "$employee_info.username",
        is_enabled: 1,
        version: 1,
      },
    },
  ];
}
