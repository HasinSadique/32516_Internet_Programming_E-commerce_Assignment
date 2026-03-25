import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";

// Generate a unique order ID
function generateOrderId() {
    // Generates an order ID in the format ORD-xxxxx (where x = numbers, 5 digits)
    const randomNum = Math.floor(10000 + Math.random() * 90000); // ensures 5 digits

    return `ORD-${randomNum}`;
}

function sanitizeOrderPayload(payload) {
    if (!payload || typeof payload !== "object") {
        return { error: "Invalid request body." };
    }
    const next = {};
    next.customer = payload.customer;
    next.payment = payload.payment;
    next.items = payload.items;
    next.total = payload.total;
    next.timestamp = payload.timestamp;
    next.orderId = generateOrderId();
    next.status = "pending";
    next.createdAt = new Date().toISOString();
    next.updatedAt = new Date().toISOString();

    return { data: next };
}

export async function POST(request) {
    try {
        const payload = await request.json();
        console.log("Got order payload ===> ", payload);
        const { data, error } = sanitizeOrderPayload(payload);
        console.log("Got order data ===> ", data);
        if (error) {
            return NextResponse.json({ error }, { status: 400 });
        }

        const ordersCollection = await getCollection("orders");
        const result = await ordersCollection.insertOne(data);
        if (!result.insertedId) {
            return NextResponse.json({ error: "Failed to create order" }, { status: 500 }, );
        }
        return NextResponse.json({ _id: result.insertedId, ...data }, { status: 201 }, );
    } catch (error) {
        console.error("Error creating order:", error);
        return NextResponse.json({ error: "Failed to create order" }, { status: 500 }, );
    }
}

export async function GET(request) {
    try {
        const ordersCollection = await getCollection("orders");
        const orders = await ordersCollection.find({}).toArray();
        return NextResponse.json(orders, { status: 200 });
    } catch (error) {
        console.error("Error fetching orders:", error);
        return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 }, );
    }
}