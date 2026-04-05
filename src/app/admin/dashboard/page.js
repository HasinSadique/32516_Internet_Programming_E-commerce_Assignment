import Link from "next/link";
import { getAllProducts } from "@/lib/data/products";
import { getAllOrders } from "@/lib/data/orders";
import AdminLogoutButton from "@/components/admin/AdminLogoutButton";

export const metadata = {
  title: "Admin Panel | Shop",
  description: "Admin panel for managing products and orders.",
};

function formatCurrency(value) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 2,
  }).format(Number(value) || 0);
}

export default async function AdminPage() {
  const [products, orders] = await Promise.all([
    getAllProducts(),
    getAllOrders(),
  ]);

  const lowStockProducts = products.filter(
    (product) => Number(product.stock) > 0 && Number(product.stock) < 10,
  ).length;
  const outOfStockProducts = products.filter(
    (product) => Number(product.stock) <= 0,
  ).length;
  const pendingOrders = orders.filter(
    (order) => order.status === "pending",
  ).length;
  const processingOrders = orders.filter(
    (order) => order.status === "processing",
  ).length;

  const recentOrders = [...orders]
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime(),
    )
    .slice(0, 5);

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Admin dashboard title and description */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="mt-1 text-slate-600">
            Manage products, monitor orders, and keep your store operations on
            track.
          </p>
        </div>
        <AdminLogoutButton />
      </div>

      {/* Product and order stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Total products</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {products.length}
          </p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 shadow-sm">
          <p className="text-sm text-amber-700">Low stock</p>
          <p className="mt-1 text-2xl font-bold text-amber-700">
            {lowStockProducts}
          </p>
        </div>
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 shadow-sm">
          <p className="text-sm text-rose-700">Out of stock</p>
          <p className="mt-1 text-2xl font-bold text-rose-700">
            {outOfStockProducts}
          </p>
        </div>
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 shadow-sm">
          <p className="text-sm text-blue-700">Pending + processing orders</p>
          <p className="mt-1 text-2xl font-bold text-blue-700">
            {pendingOrders + processingOrders}
          </p>
        </div>
      </div>
      {/* Manage products and orders links */}
      <div className="mb-6 grid gap-6 sm:grid-cols-2">
        <Link
          href="/admin/dashboard/products"
          className="block rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-300 hover:shadow-md"
        >
          <h2 className="text-lg font-semibold text-slate-900">
            Manage Products
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Add new products, update pricing and stock, and remove old catalog
            items.
          </p>
        </Link>
        <Link
          href="/admin/dashboard/orders"
          className="block rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-300 hover:shadow-md"
        >
          <h2 className="text-lg font-semibold text-slate-900">
            Manage Orders
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Review customer orders and update fulfillment status from one place.
          </p>
        </Link>
      </div>
      {/* Recent orders table */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Recent Orders</h2>
          <Link
            href="/admin/dashboard/orders"
            className="text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700"
          >
            View all orders
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm text-slate-700">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
              <tr>
                <th className="px-3 py-2 text-left font-semibold">Order ID</th>
                <th className="px-3 py-2 text-left font-semibold">Customer</th>
                <th className="px-3 py-2 text-right font-semibold">Total</th>
                <th className="px-3 py-2 text-left font-semibold">Status</th>
                <th className="px-3 py-2 text-left font-semibold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {recentOrders.map((order) => (
                <tr key={order.orderId}>
                  <td className="px-3 py-3 font-semibold text-slate-900">
                    {order.orderId}
                  </td>
                  <td className="px-3 py-3">
                    <p className="font-medium text-slate-900">
                      {order.customer.name}
                    </p>
                    {/* <p className="text-xs text-slate-500">
                      {order.customer.email}
                    </p>
                    <p className="text-xs text-slate-500">
                      {order.customer.phone}
                    </p> */}
                  </td>
                  <td className="px-3 py-3 text-right font-medium">
                    {formatCurrency(order.total)}
                  </td>
                  <td className="px-3 py-3">
                    <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold capitalize text-slate-700">
                      {order.status}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    {new Intl.DateTimeFormat("en-AU", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }).format(new Date(order.createdAt))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
