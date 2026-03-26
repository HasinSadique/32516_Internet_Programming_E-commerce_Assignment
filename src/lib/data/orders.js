import { getCollection } from "@/lib/mongodb";

/**
 * Fetches all orders from MongoDB.
 * Returns an array of order objects, or [] on error.
 */
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
