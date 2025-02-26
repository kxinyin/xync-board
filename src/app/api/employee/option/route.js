import { connectToDatabase } from "@/src/lib/mongodb";

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams;
  const role_id = searchParams.get("role_id")?.trim().toUpperCase();

  // Validate input
  if (role_id === "") {
    return new Response(
      JSON.stringify({ message: "No role ID provided", data: null }),
      { status: 400 }
    );
  }

  const { db } = await connectToDatabase();

  const FILTER = { is_enabled: true, ...(role_id && { role_id }) };

  const employees = await db
    .collection("employees")
    .find(FILTER, { projection: { _id: 0, employee_id: 1, username: 1 } })
    .toArray();

  if (employees.length === 0) {
    return new Response(
      JSON.stringify({ message: "No employees found", data: [] }),
      { status: 404 }
    );
  }

  const message = role_id
    ? `Successfully retrieved all employees with role: ${role_id}`
    : "Successfully retrieved all employees";

  return new Response(JSON.stringify({ message, data: employees }), {
    status: 200,
  });
}
