import { NextResponse } from "next/server";
import { hashPassword } from "@/lib/auth/password";
import { validateRegistrationPayload } from "@/lib/auth/customerValidation";
import { attachCustomerAuthCookie } from "@/lib/auth/customerSession";
import {
  createCustomer,
  findCustomerByEmail,
  toPublicCustomer,
} from "@/lib/data/users";

export async function POST(request) {
  try {
    const body = await request.json();
    const { errors, values } = validateRegistrationPayload(body);

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    const existingCustomer = await findCustomerByEmail(values.email);
    if (existingCustomer) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 },
      );
    }

    const passwordHash = await hashPassword(values.password);
    const customer = await createCustomer({
      fullName: values.fullName,
      dateOfBirth: values.dateOfBirth,
      address: values.address,
      postalCode: values.postalCode,
      email: values.email.toLowerCase(),
      phone: values.phone,
      passwordHash,
    });

    const response = NextResponse.json({
      success: true,
      user: toPublicCustomer(customer),
    });

    return attachCustomerAuthCookie(response, customer);
  } catch (error) {
    console.error("Customer registration failed:", error);
    return NextResponse.json(
      { error: "Unable to complete registration." },
      { status: 500 },
    );
  }
}
