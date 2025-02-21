import { createLog } from "@/src/lib/createLog";
import { connectToDatabase } from "@/src/lib/mongodb";
import { currentTime } from "@/src/lib/utils/timeUtils";

export async function PUT(request) {
  const { customer_id: customer_ids, employee_id } = await request.json();

  // Validate input
  if (
    !customer_ids ||
    !Array.isArray(customer_ids) ||
    customer_ids.length === 0
  ) {
    return new Response(
      JSON.stringify({ message: "No customer IDs provided", data: null }),
      { status: 400 }
    );
  }

  if (!employee_id) {
    return new Response(
      JSON.stringify({ message: "No employee ID provided", data: null }),
      { status: 400 }
    );
  }

  const { db } = await connectToDatabase();

  const COLLECTION = "customers";
  const FILTER = { customer_id: { $in: customer_ids.map((id) => id) } };

  // Check if employee ID exists
  const employee = await db.collection("employees").findOne({ employee_id });

  if (!employee) {
    return new Response(
      JSON.stringify({ message: "Employee ID not found", data: null }),
      { status: 400 }
    );
  }

  // Get existing data
  const existingData = await db.collection(COLLECTION).find(FILTER).toArray();

  // Bulk update customers
  const result = await db.collection(COLLECTION).updateMany(FILTER, [
    {
      $set: {
        employee_id,
        assigned_at: {
          $cond: {
            if: { $ne: ["$employee_id", employee_id] },
            then: currentTime(),
            else: "$assigned_at",
          },
        },
        version: {
          $cond: {
            if: { $ne: ["$employee_id", employee_id] },
            then: { $add: ["$version", 1] },
            else: "$version",
          },
        },
      },
    },
  ]);

  if (result.matchedCount === 0) {
    return new Response(
      JSON.stringify({ message: "Customers not found", data: null }),
      { status: 404 }
    );
  }

  if (result.modifiedCount === 0) {
    return new Response(
      JSON.stringify({
        message: `All customers are already assigned to employee: ${employee.username}`,
        data: null,
      }),
      { status: 404 }
    );
  }

  // Get updated data
  const updatedData = await db.collection(COLLECTION).find(FILTER).toArray();

  const total = customer_ids.length;
  const total_updated = result.modifiedCount;
  const total_failed = total - total_updated;

  const message =
    total_failed > 0
      ? `Successfully assigned ${total_updated} out of ${total} customers to employee: ${employee.username}`
      : `Successfully assigned ${total_updated} customers to employee: ${employee.username}`;

  await createLog({
    db,
    event_type: "CUSTOMER_BULK_ASSIGN_COLLECTOR",
    message,
    before: existingData,
    after: updatedData,
  });

  return new Response(JSON.stringify({ message, data: null }), { status: 200 });
}
