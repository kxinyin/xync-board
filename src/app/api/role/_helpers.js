import { currentTime } from "@/src/services/timeUtils";

export const lookupEmployee = {
  $lookup: {
    from: "employees",
    localField: "role_id",
    foreignField: "role_id",
    as: "employees",
  },
};

export const lookupPermission = {
  $lookup: {
    from: "permissions",
    localField: "role_id",
    foreignField: "role_id",
    as: "permission",
  },
};

export const projectEmployee = { employee_count: { $size: "$employees" } };

export const projectPermission = {
  permission: {
    $map: {
      input: {
        $filter: {
          input: "$permission",
          as: "permission",
          cond: { $eq: ["$$permission.is_enabled", true] },
        },
      },
      as: "permission",
      in: "$$permission.module_id",
    },
  },
};

export const handleOperations = (role_id, permission) => {
  let operations = [
    // update all true to false
    {
      updateMany: {
        filter: { role_id, is_enabled: true },
        update: { $set: { is_enabled: false, updated_at: currentTime() } },
      },
    },
  ];

  permission.forEach((module_id) =>
    // update to true
    operations.push({
      updateOne: {
        filter: { role_id, module_id },
        update: {
          $set: { is_enabled: true, updated_at: currentTime() },
          $setOnInsert: { role_id, module_id, created_at: currentTime() },
        },
        upsert: true,
      },
    })
  );

  return operations;
};
