import { connectToDatabase } from "@/src/lib/mongodb";
import { createLog } from "../../../../lib/createLog";
import { compare } from "bcrypt";

export async function POST(request) {
  const { username, password } = await request.json();

  const { db } = await connectToDatabase();

  const user = await db.collection("employees").findOne(
    { username: username },
    {
      projection: {
        _id: 0,
        name: 1,
        employee_id: 1,
        role_id: 1,
        password: 1,
      },
    }
  );

  if (!user) {
    return new Response(
      JSON.stringify({ message: "User not found", data: null }),
      { status: 404 }
    );
  }

  const isPasswordValid = await compare(password, user.password);

  if (!isPasswordValid) {
    return new Response(
      JSON.stringify({ message: "Invalid password", data: null }),
      { status: 401 }
    );
  }

  const message = "Login successful";

  await createLog({
    db,
    event_type: "USER_LOGIN",
    message,
    log_by: { employee_id: user.employee_id, name: user.name },
  });

  const { password: _, ...userInfo } = user;

  return new Response(JSON.stringify({ message, data: userInfo }), {
    status: 200,
  });
}
