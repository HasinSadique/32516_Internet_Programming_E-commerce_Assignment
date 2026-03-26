"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const STATUS_OPTIONS = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 2,
  }).format(Number(amount) || 0);
}

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";
  return new Intl.DateTimeFormat("en-AU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getStatusClasses(status) {
  if (status === "delivered")
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (status === "shipped") return "border-blue-200 bg-blue-50 text-blue-700";
  if (status === "processing")
    return "border-amber-200 bg-amber-50 text-amber-700";
  if (status === "cancelled") return "border-red-200 bg-red-50 text-red-700";
  return "border-slate-200 bg-slate-50 text-slate-700";
}

function getPaymentClasses(status) {
  if (status === "card")
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (status === "refunded")
    return "border-slate-300 bg-slate-100 text-slate-700";
  return "border-amber-200 bg-amber-50 text-amber-700";
}

export default function AdminOrdersPanel({ initialOrders }) {
  const [orders, setOrders] = useState(() =>
    Array.isArray(initialOrders) ? initialOrders : [],
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const stats = useMemo(() => {
    const openOrders = orders.filter(
      (order) => order.status !== "delivered" && order.status !== "cancelled",
    ).length;
    return {
      total: orders.length,
      openOrders,
      shipped: orders.filter((order) => order.status === "shipped").length,
      delivered: orders.filter((order) => order.status === "delivered").length,
    };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return orders.filter((order) => {
      const queryMatch =
        !query ||
        order.orderId.toLowerCase().includes(query) ||
        order.customerName.toLowerCase().includes(query) ||
        order.customerEmail.toLowerCase().includes(query);

      if (!queryMatch) return false;
      if (statusFilter === "all") return true;
      return order.status === statusFilter;
    });
  }, [orders, searchTerm, statusFilter]);

  async function handleStatusChange(orderId, nextStatus) {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        body: JSON.stringify({ status: nextStatus }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const updatedOrder = await response.json();
        setOrders((prev) =>
          prev.map((order) =>
            order.orderId === orderId
              ? { ...order, status: updatedOrder.status }
              : order,
          ),
        );
      }
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Manage Orders</h1>
          <p className="text-slate-600">
            Track incoming orders and update fulfillment status.
          </p>
        </div>
        <Link
          href="/admin"
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100"
        >
          Back to Dashboard
        </Link>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Total orders</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {stats.total}
          </p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 shadow-sm">
          <p className="text-sm text-amber-700">Open orders</p>
          <p className="mt-1 text-2xl font-bold text-amber-700">
            {stats.openOrders}
          </p>
        </div>
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 shadow-sm">
          <p className="text-sm text-blue-700">Shipped</p>
          <p className="mt-1 text-2xl font-bold text-blue-700">
            {stats.shipped}
          </p>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
          <p className="text-sm text-emerald-700">Delivered</p>
          <p className="mt-1 text-2xl font-bold text-emerald-700">
            {stats.delivered}
          </p>
        </div>
      </div>
      {/* Orders table */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by order ID, name, or email"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 sm:w-80"
          />
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            <option value="all">All statuses</option>
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status[0].toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>
        {/* Orders table */}
        <div className="overflow-x-auto relative">
          <table className="w-full min-w-[980px] text-sm text-slate-700">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
              <tr>
                <th className="px-3 py-2 text-left font-semibold">Order ID</th>
                <th className="px-3 py-2 text-left font-semibold">Customer</th>
                <th className="px-3 py-2 text-right font-semibold">Items</th>
                <th className="px-3 py-2 text-right font-semibold">Total</th>
                <th className="px-3 py-2 text-left font-semibold">
                  Payment Method
                </th>
                <th className="px-3 py-2 text-left font-semibold">Status</th>
                <th className="px-3 py-2 text-left font-semibold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-3 py-8 text-center text-slate-500"
                  >
                    No orders match your filters.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  if (!order) return null;
                  if (!order.items || !order.customer) return null;
                  const totalItems = order?.items?.reduce(
                    (sum, item) => sum + (Number(item.quantity) || 0),
                    0,
                  );
                  return (
                    <tr key={order.orderId} className="bg-white">
                      <td className="px-3 py-3 font-semibold text-slate-900">
                        {order.orderId}
                      </td>
                      <td className="px-3 py-3">
                        <p className="font-medium text-slate-900">
                          {order.customer.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {order.customer.email}
                        </p>
                        <p className="text-xs text-slate-500">
                          {order.customer.phone}
                        </p>
                      </td>
                      {/* Items ordered */}
                      <td className="px-3 py-3 text-right group relative ">
                        <span>{totalItems}</span>
                        <div className="fixed left-1/2 top-1/2 z-40 mx-auto hidden min-w-[240px] max-w-xs -translate-x-1/2 -translate-y-1/2 whitespace-normal rounded-lg border border-slate-300 bg-white px-4 py-3 text-left text-xs shadow-2xl group-hover:block group-focus-within:block">
                          <div className="font-semibold mb-2 text-slate-900">
                            Items Ordered:
                          </div>
                          <ul className="space-y-1">
                            {order.items.map((item, idx) => (
                              <li key={item.productId || idx} className="">
                                <span className="mr-2 text-slate-700">
                                  {idx + 1}.
                                </span>
                                <span className="font-medium text-slate-800">
                                  {item.name}
                                </span>
                                {item.quantity && (
                                  <span className="ml-2 text-slate-600">
                                    &times; {item.quantity}
                                  </span>
                                )}
                                {item.price && (
                                  <span className="ml-2 text-slate-500">
                                    ({formatCurrency(item.price)})
                                  </span>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-right font-medium text-slate-900">
                        {formatCurrency(order.total)}
                      </td>
                      <td className="px-3 py-3">
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${getPaymentClasses(order.paymentStatus)}`}
                        >
                          {order.payment.method === "cod"
                            ? "Cash on Delivery"
                            : "Card"}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${getStatusClasses(order.status)}`}
                          >
                            {order.status}
                          </span>
                          <select
                            value={order.status}
                            onChange={(event) =>
                              handleStatusChange(
                                order.orderId,
                                event.target.value,
                              )
                            }
                            className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                          >
                            {STATUS_OPTIONS.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        {formatDate(order.createdAt)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
