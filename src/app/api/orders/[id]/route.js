import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";

async function getRouteId(params) {
  if (!params) return null;
  if (typeof params.then === "function") {
    const resolvedParams = await params;
    return resolvedParams?.id;
  }
  return params?.id;
}

export async function GET(request, { params }) {
  try {
    const id = await getRouteId(params);
    if (!id) {
      return NextResponse.json({ error: "Invalid order id." }, { status: 400 });
    }
    const ordersCollection = await getCollection("orders");
    const order = await ordersCollection.findOne({ orderId: String(id) });
    if (!order) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }
    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 },
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    const id = await getRouteId(params);

    if (!id) {
      return NextResponse.json({ error: "Invalid order id." }, { status: 400 });
    }

    const { status } = await request.json();

    if (typeof status !== "string" || !status) {
      return NextResponse.json(
        { error: "Status is required." },
        { status: 400 },
      );
    }

    const ordersCollection = await getCollection("orders");
    const result = await ordersCollection.updateOne(
      { orderId: String(id) },
      { $set: { status } },
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    // Return the updated order document
    const updatedOrder = await ordersCollection.findOne({
      orderId: String(id),
    });

    return NextResponse.json(updatedOrder, { status: 200 });
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 },
    );
  }
}
