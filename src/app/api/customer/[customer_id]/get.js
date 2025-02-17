import { connectToDatabase } from "@/src/lib/mongodb";
import { getSingleData } from "../_helpers";

export async function GET(request, { params }) {
  const { customer_id } = await params;

  const { db } = await connectToDatabase();

  const customer = await db
    .collection("customers")
    .aggregate(getSingleData(customer_id))
    .next();

  if (!customer) {
    return new Response(
      JSON.stringify({ message: "Customer not found", data: null }),
      { status: 404 }
    );
  }

  return new Response(
    JSON.stringify({
      message: "Customer details retrieved successfully",
      data: customer,
    }),
    { status: 200 }
  );
}
