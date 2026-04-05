import { getCollection } from "@/lib/mongodb";

export async function getAllOrders() {
    try {
        const ordersCollection = await getCollection("orders");
        const orders = await ordersCollection.find({}).toArray();
        return Array.isArray(orders) ? orders : [];
    } catch (error) {
        console.error("Failed to fetch all orders:", error);
        return [];
    }
}