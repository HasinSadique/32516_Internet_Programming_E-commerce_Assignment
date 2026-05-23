import { NextResponse } from "next/server";
import { getCustomerSessionFromRequest } from "@/lib/auth/customerSession";

export async function GET(request) {
  const session = await getCustomerSessionFromRequest(request);

  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user: session.customer,
  });
}
