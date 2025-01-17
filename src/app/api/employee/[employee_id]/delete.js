import { connectToDatabase } from "@/src/lib/mongodb";
import { createLog } from "@/src/app/api/_helpers/createLog";

export async function DELETE(request, { params }) {
  const { employee_id } = await params;

  const { db } = await connectToDatabase();

  const COLLECTION = "employees";
  const FILTER = { employee_id };

  // Get existing data
  const existingData = await db.collection(COLLECTION).findOne(FILTER);

  // Delete employee
  const result = await db.collection(COLLECTION).deleteOne(FILTER);

  if (result.deletedCount === 0) {
    return new Response(
      JSON.stringify({ message: "Employee not found", data: null }),
      { status: 404 }
    );
  }

  const message = "Employee deleted successfully";

  await createLog({
    db,
    event_type: "EMPLOYEE_DELETE",
    message,
    before: existingData,
  });

  return new Response(JSON.stringify({ message, data: null }), { status: 200 });
}
