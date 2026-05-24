import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";
import { getCustomerSessionFromRequest } from "@/lib/auth/customerSession";

function normalizeOrder(order) {
  return {
    ...order,
    _id: order?._id?.toString?.() || order?._id,
  };
}

export async function GET(request) {
  try {
    const session = await getCustomerSessionFromRequest(request);
    if (!session?.customerId) {
      return NextResponse.json(
        { error: "Unauthorized access." },
        { status: 401 },
      );
    }

    const ordersCollection = await getCollection("orders");
    const customerOrders = await ordersCollection
      .find({ customerId: String(session.customerId) })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(customerOrders.map(normalizeOrder), { status: 200 });
  } catch (error) {
    console.error("Failed to fetch customer orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch order history." },
      { status: 500 },
    );
  }
}
