import AdminOrdersPanel from "@/components/admin/AdminOrdersPanel";
import { GET } from "@/app/api/orders/route";

export const metadata = {
  title: "Manage Orders | Admin",
  description: "Track and update customer orders from the admin panel.",
};

export default async function AdminOrdersPage() {
  const response = await GET();
  const orders = await response.json();
  if (!response.ok) {
    console.error("Failed to fetch all orders:", payload?.error || payload);
    return [];
  }

  // const orders = getAllOrders();
  return <AdminOrdersPanel initialOrders={orders} />;
}
