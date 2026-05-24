import { NextResponse } from "next/server";
import { validateProfileUpdatePayload } from "@/lib/auth/customerValidation";
import { getCustomerSessionFromRequest } from "@/lib/auth/customerSession";
import { toPublicCustomer, updateCustomerProfile } from "@/lib/data/users";

export async function PATCH(request) {
  try {
    const session = await getCustomerSessionFromRequest(request);
    if (!session?.customerId) {
      return NextResponse.json(
        { error: "Please login to update your profile." },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { errors, values } = validateProfileUpdatePayload(body);

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    const updatedCustomer = await updateCustomerProfile(
      session.customerId,
      values,
    );

    if (!updatedCustomer) {
      return NextResponse.json(
        { error: "Unable to update profile." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      user: toPublicCustomer(updatedCustomer),
    });
  } catch (error) {
    console.error("Customer profile update failed:", error);
    return NextResponse.json(
      { error: "Unable to update profile." },
      { status: 500 },
    );
  }
}
