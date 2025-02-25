export const aggregateClient = [
  {
    $lookup: {
      from: "clients",
      localField: "client_id",
      foreignField: "client_id",
      as: "client_info",
    },
  },
  {
    $unwind: { path: "$client_info", preserveNullAndEmptyArrays: true },
  },
];

export const projectFullData = [
  {
    $project: {
      _id: 1,
      batch_id: 1,
      client_batch_no: 1,
      client_id: 1,
      received_at: 1,
      created_at: 1,
      updated_at: 1,
      client_name: "$client_info.name",
    },
  },
];

export const projectTableData = [
  {
    $project: {
      _id: 0,
      batch_id: 1,
      client_batch_no: 1,
      received_at: 1,
      created_at: 1,
      client_name: "$client_info.name",
    },
  },
];
