import { connectToDatabase } from "@/lib/mongodb";
import { compare } from "bcrypt";

export async function POST(request) {
  const { username, password } = await request.json();

  const { db } = await connectToDatabase();

  const user = await db.collection("employees").findOne(
    { employee_id: username },
    {
      projection: {
        _id: 0,
        display_name: 1,
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

  const { password: _, ...userInfo } = user;

  return new Response(
    JSON.stringify({ message: "Login successful", data: userInfo }),
    { status: 200 }
  );
}
