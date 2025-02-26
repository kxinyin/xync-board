const lookupParameter = [
  {
    $lookup: {
      from: "parameters",
      let: { client_id: "$client_id" },
      pipeline: [
        { $match: { parameter_id: "client_batch_no" } },
        { $unwind: "$data" },
        { $match: { $expr: { $eq: ["$data.client_id", "$$client_id"] } } },
        { $project: { _id: 0, next_no: "$data.next_no" } },
      ],
      as: "client_batch_info",
    },
  },
];

export const aggregateTotalBatch = [
  ...lookupParameter,
  {
    $addFields: {
      total_batch: {
        $subtract: [
          { $ifNull: [{ $arrayElemAt: ["$client_batch_info.next_no", 0] }, 1] },
          1,
        ],
      },
    },
  },
  {
    $project: { client_batch_info: 0 },
  },
];

// option: return next no
export const aggregateNextNo = [
  ...lookupParameter,
  {
    $addFields: {
      next_no: {
        $ifNull: [{ $arrayElemAt: ["$client_batch_info.next_no", 0] }, 1],
      },
    },
  },
  {
    $project: { client_batch_info: 0 },
  },
];

// option: return batches
export const lookupBatchList = [
  {
    $lookup: {
      from: "batches",
      localField: "client_id",
      foreignField: "client_id",
      as: "batch",
    },
  },
];

export const projectBatchList = {
  batch: {
    $map: {
      input: "$batch",
      as: "b",
      in: {
        batch_id: "$$b.batch_id",
        name: {
          $concat: [
            "$name",
            "-",
            {
              $toString: "$$b.client_batch_no",
            },
          ],
        },
      },
    },
  },
};
