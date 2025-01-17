import { connectToDatabase } from "@/src/lib/mongodb";

export async function GET() {
  const { db } = await connectToDatabase();

  const companyInfo = await db
    .collection("parameters")
    .findOne(
      { parameter_id: "company_info" },
      { projection: { _id: 0, parameter_id: 0, updated_at: 0 } }
    );

  if (!companyInfo) {
    return new Response(
      JSON.stringify({ message: "Company information not found", data: null }),
      { status: 404 }
    );
  }

  return new Response(
    JSON.stringify({
      message: "Company information retrieved successfully",
      data: companyInfo,
    }),
    { status: 200 }
  );
}
