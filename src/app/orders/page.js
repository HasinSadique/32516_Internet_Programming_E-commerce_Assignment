"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCustomerSession } from "@/hooks/useCustomerSession";

function formatCurrency(value) {
  const amount = Number(value || 0);
  return `$${amount.toFixed(2)}`;
}

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString();
}

function statusStyles(status = "") {
  const normalized = status.toLowerCase();
  if (normalized === "completed" || normalized === "delivered") {
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  }
  if (normalized === "shipped") {
    return "bg-blue-50 text-blue-700 border-blue-200";
  }
  if (normalized === "cancelled") {
    return "bg-red-50 text-red-700 border-red-200";
  }
  return "bg-slate-100 text-slate-700 border-slate-200";
}

export default function OrdersPage() {
  const router = useRouter();
  const { user, loading } = useCustomerSession();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login?redirect=/orders");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) {
      setLoadingOrders(false);
      return;
    }

    let isActive = true;

    async function loadOrders() {
      try {
        setLoadingOrders(true);
        setError("");
        const response = await fetch("/api/customer/orders", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to load orders.");
        }

        const payload = await response.json();
        if (isActive) {
          setOrders(Array.isArray(payload) ? payload : []);
        }
      } catch (loadError) {
        if (isActive) {
          setError("We could not load your order history right now.");
          setOrders([]);
        }
      } finally {
        if (isActive) {
          setLoadingOrders(false);
        }
      }
    }

    loadOrders();

    return () => {
      isActive = false;
    };
  }, [user]);

  const sortedOrders = useMemo(
    () =>
      [...orders].sort(
        (a, b) =>
          new Date(b.createdAt || b.timestamp || 0).getTime() -
          new Date(a.createdAt || a.timestamp || 0).getTime(),
      ),
    [orders],
  );

  if (loading) {
    return (
      <div className="container mx-auto flex min-h-[50vh] items-center justify-center px-4 py-16">
        <p className="font-medium text-slate-600">Loading your account...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8 flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-slate-900">Order History</h1>
        <p className="text-slate-600">All your orders are shown here.</p>
      </div>

      {loadingOrders ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="font-medium text-slate-600">Loading your orders...</p>
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
          {error}
        </div>
      ) : sortedOrders.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-slate-700">You have not placed any orders yet.</p>
          <Link
            href="/products"
            className="mt-4 inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          {sortedOrders.map((order) => (
            <article
              key={order._id || order.orderId}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Order ID</p>
                  <p className="text-xl font-bold text-blue-700">
                    {order.orderId || order._id}
                  </p>
                </div>
                <div className="flex flex-col items-start gap-2 sm:items-end">
                  <span
                    className={`inline-flex rounded-full border px-3 py-1 text-sm font-semibold ${statusStyles(order.status)}`}
                  >
                    {order.status || "pending"}
                  </span>
                  <p className="text-xs text-slate-500">
                    Placed: {formatDate(order.createdAt || order.timestamp)}
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[540px] text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-600">
                      <th className="px-2 py-2 text-left">Item</th>
                      <th className="px-2 py-2 text-center">Qty</th>
                      <th className="px-2 py-2 text-right">Unit Price</th>
                      <th className="px-2 py-2 text-right">Line Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(order.items || []).map((item, index) => {
                      const quantity = Number(item.quantity || 0);
                      const unitPrice = Number(item.unitPrice || 0);
                      return (
                        <tr key={item._id || `${order._id}-${index}`}>
                          <td className="border-b border-slate-100 px-2 py-3 font-medium text-slate-800">
                            {item.name || "Unnamed item"}
                          </td>
                          <td className="border-b border-slate-100 px-2 py-3 text-center">
                            {quantity}
                          </td>
                          <td className="border-b border-slate-100 px-2 py-3 text-right">
                            {formatCurrency(unitPrice)}
                          </td>
                          <td className="border-b border-slate-100 px-2 py-3 text-right font-semibold">
                            {formatCurrency(quantity * unitPrice)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td
                        colSpan={3}
                        className="px-2 py-3 text-right text-sm font-semibold text-slate-700"
                      >
                        Order Total
                      </td>
                      <td className="px-2 py-3 text-right text-lg font-bold text-slate-900">
                        {formatCurrency(order.total)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
