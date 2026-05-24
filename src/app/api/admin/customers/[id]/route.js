import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getAdminSessionFromRequest } from "@/lib/auth/adminSession";
import { deleteCustomerAndRelatedData } from "@/lib/data/users";

function requireAdminApiSession(request) {
  const session = getAdminSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }
  return null;
}

async function getRouteId(params) {
  const resolvedParams = await params;
  return resolvedParams?.id;
}

export async function DELETE(request, { params }) {
  try {
    const unauthorizedResponse = requireAdminApiSession(request);
    if (unauthorizedResponse) {
      return unauthorizedResponse;
    }

    const id = await getRouteId(params);
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid customer id." }, { status: 400 });
    }

    const result = await deleteCustomerAndRelatedData(id);

    if (result.reason === "invalid_id") {
      return NextResponse.json({ error: "Invalid customer id." }, { status: 400 });
    }

    if (result.reason === "not_found") {
      return NextResponse.json({ error: "Customer not found." }, { status: 404 });
    }

    return NextResponse.json({
      message: "Customer account and related data deleted successfully.",
      ordersDeleted: result.ordersDeleted,
    });
  } catch (error) {
    console.error("Failed to delete customer:", error);
    return NextResponse.json(
      { error: "Failed to delete customer." },
      { status: 500 },
    );
  }
}
