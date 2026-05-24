import { NextResponse } from "next/server";
import { getAdminSessionFromRequest } from "@/lib/auth/adminSession";
import { getAllCustomers } from "@/lib/data/users";

function requireAdminApiSession(request) {
  const session = getAdminSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }
  return null;
}

export async function GET(request) {
  try {
    const unauthorizedResponse = requireAdminApiSession(request);
    if (unauthorizedResponse) {
      return unauthorizedResponse;
    }

    const customers = await getAllCustomers();
    return NextResponse.json(customers, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch customers:", error);
    return NextResponse.json(
      { error: "Failed to fetch customers." },
      { status: 500 },
    );
  }
}
