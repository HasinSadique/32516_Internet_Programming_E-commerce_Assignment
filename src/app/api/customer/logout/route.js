import { NextResponse } from "next/server";
import { clearCustomerAuthCookie } from "@/lib/auth/customerSession";

export async function POST() {
  const response = NextResponse.json({ success: true });
  return clearCustomerAuthCookie(response);
}
