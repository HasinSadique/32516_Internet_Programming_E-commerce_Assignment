import { Decimal128, Long, ObjectId } from "mongodb";
import { getCollection } from "@/lib/mongodb";

function toClientValue(value) {
    if (value == null) return value;
    if (typeof value !== "object") return value;
    if (value instanceof ObjectId) return value.toHexString();
    if (value instanceof Date) return value.toISOString();
    if (value instanceof Decimal128) {
        const n = Number(value.toString());
        return Number.isFinite(n) ? n : value.toString();
    }
    if (value instanceof Long) return value.toString();
    if (Array.isArray(value)) return value.map(toClientValue);
    const proto = Object.getPrototypeOf(value);
    if (proto === Object.prototype || proto === null) {
        const out = {};
        for (const k of Object.keys(value)) {
            out[k] = toClientValue(value[k]);
        }
        return out;
    }
    if (typeof value.toHexString === "function") return value.toHexString();
    if (typeof value.toString === "function") return value.toString();
    return null;
}

export async function getAllOrders() {
    try {
        const ordersCollection = await getCollection("orders");
        const orders = await ordersCollection.find({}).toArray();
        if (!Array.isArray(orders)) return [];
        return orders.map((doc) => toClientValue(doc));
    } catch (error) {
        console.error("Failed to fetch all orders:", error);
        return [];
    }
}