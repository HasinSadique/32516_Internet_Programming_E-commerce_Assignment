import AdminOrdersPanel from "@/components/admin/AdminOrdersPanel";
import { getAllOrders } from "@/lib/data/orders";

export const metadata = {
  title: "Manage Orders | Admin",
  description: "Track and update customer orders from the admin panel.",
};

export default function AdminOrdersPage() {
  const orders = getAllOrders();
  return <AdminOrdersPanel initialOrders={orders} />;
}
