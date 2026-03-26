import AdminOrdersPanel from "@/components/admin/AdminOrdersPanel";
import { getAllOrders } from "@/lib/data/orders";

export const metadata = {
  title: "Manage Orders | Admin",
  description: "Track and update customer orders from the admin panel.",
};

export default async function AdminOrdersPage() {
  const orders = await getAllOrders();
  return <AdminOrdersPanel initialOrders={orders} />;
}
