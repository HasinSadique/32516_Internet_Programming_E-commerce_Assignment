import { NextResponse } from "next/server";
import { verifyPassword } from "@/lib/auth/password";
import { validateLoginPayload } from "@/lib/auth/customerValidation";
import { attachCustomerAuthCookie } from "@/lib/auth/customerSession";
import { findCustomerByEmail, toPublicCustomer } from "@/lib/data/users";

export async function POST(request) {
  try {
    const body = await request.json();
    const { errors, values } = validateLoginPayload(body);

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    const customer = await findCustomerByEmail(values.email);
    if (!customer) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 },
      );
    }

    const passwordMatches = await verifyPassword(
      values.password,
      customer.passwordHash,
    );

    if (!passwordMatches) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 },
      );
    }

    const response = NextResponse.json({
      success: true,
      user: toPublicCustomer(customer),
    });

    return attachCustomerAuthCookie(response, customer);
  } catch (error) {
    console.error("Customer login failed:", error);
    return NextResponse.json(
      { error: "Unable to complete login." },
      { status: 500 },
    );
  }
}
