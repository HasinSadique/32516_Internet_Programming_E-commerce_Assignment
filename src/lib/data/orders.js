import { GET } from "@/app/api/orders/route";

/**
 * Fetches all orders from the API.
 * Returns an array of order objects, or [] on error.
 */
export async function getAllOrders() {
  const response = await GET();
  const payload = await response.json();
  if (!response.ok) {
    console.error("Failed to fetch all orders:", payload?.error || payload);
    return [];
  }
  return Array.isArray(payload) ? payload : [];
}
