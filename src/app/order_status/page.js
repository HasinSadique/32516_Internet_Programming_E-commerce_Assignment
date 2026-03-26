"use client";
import { useState } from "react";
import {
  FaSearch,
  FaShippingFast,
  FaCheckCircle,
  FaTimesCircle,
  FaBoxOpen,
} from "react-icons/fa";

function statusIcon(status) {
  switch (status?.toLowerCase()) {
    case "shipped":
      return (
        <FaShippingFast className="inline mr-2 text-emerald-500" size={20} />
      );
    case "completed":
    case "delivered":
      return <FaCheckCircle className="inline mr-2 text-blue-500" size={20} />;
    case "cancelled":
      return <FaTimesCircle className="inline mr-2 text-red-400" size={20} />;
    default:
      return <FaBoxOpen className="inline mr-2 text-slate-400" size={20} />;
  }
}

export default function OrderStatusPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState(null);
  const [notFound, setNotFound] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setNotFound(false);
    setOrder(null);

    if (!orderNumber.trim()) {
      setError("Please enter your order number.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/orders/${orderNumber.trim()}`);
      if (response.status === 404) {
        setNotFound(true);
        setOrder(null);
      } else if (!response.ok) {
        throw new Error("Order not found");
      } else {
        const orderData = await response.json();
        setOrder(orderData);
        setNotFound(false);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch order.");
      setOrder(null);
      setNotFound(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-violet-100">
      <div className="container mx-auto px-4 py-12 flex flex-col items-center">
        <div className="w-full max-w-xl mb-12">
          <div className="bg-white/95 shadow-xl rounded-2xl px-8 py-10 flex flex-col items-center">
            <h1 className="mb-4 text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-500 to-emerald-500 text-center tracking-tight">
              Track Your Order
            </h1>
            <p className="mb-8 text-lg text-slate-700 text-center">
              Enter your order number below to see your latest status and
              details.
            </p>
            <form
              onSubmit={handleSubmit}
              className="flex w-full gap-3 items-center justify-center mb-2"
              autoComplete="off"
            >
              <div className="relative flex-1">
                <input
                  onChange={(e) => setOrderNumber(e.target.value)}
                  value={orderNumber}
                  type="text"
                  placeholder="e.g. ORD-82731"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 shadow-inner text-lg placeholder:text-slate-400 focus:border-violet-600 focus:ring-2 focus:ring-blue-100 transition"
                  disabled={loading}
                />
                <FaBoxOpen
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 text-slate-300"
                  size={20}
                />
              </div>
              <button
                type="submit"
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-700 px-6 py-3 text-white font-bold shadow-lg rounded-xl text-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={loading}
              >
                <FaSearch size={18} />
                {loading ? "Checking..." : "Check Status"}
              </button>
            </form>
            {error && (
              <div className="mt-3 w-full text-center text-base text-red-700 rounded-xl bg-red-50 px-4 py-2 border border-red-200 shadow">
                {error}
              </div>
            )}
          </div>
        </div>

        {loading && (
          <div className="w-full max-w-lg mx-auto flex flex-col items-center mt-10">
            <div className="animate-spin rounded-full border-4 border-blue-800/40 border-t-blue-600 h-16 w-16 mb-8" />
            <div className="text-xl font-medium text-blue-600 mb-2">
              Loading your order details...
            </div>
            <div className="text-slate-500">
              Hang tight! We&apos;re fetching your info.
            </div>
          </div>
        )}

        {order && !loading && (
          <div className="w-full max-w-3xl mx-auto bg-white/95 rounded-2xl shadow-xl border border-slate-200 mt-5 mb-16">
            <div className="p-8">
              {/* Modern top summary */}
              <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-stretch gap-6 p-6 rounded-xl">
                {/* Order Details - LEFT */}
                <div className="flex-1 flex flex-col gap-4">
                  <div>
                    <div className="uppercase tracking-wide text-xs text-slate-400 mb-0.5">
                      Order #
                    </div>
                    <div className="text-2xl font-bold text-blue-600 tracking-tight select-all">
                      {order.orderId || order._id}
                    </div>
                  </div>
                  <div>
                    <div className="uppercase tracking-wide text-xs text-slate-400 mb-0.5">
                      Status
                    </div>
                    <div className="flex items-center font-bold text-lg">
                      {statusIcon(order.status)}
                      <span
                        className={
                          order.status === "Shipped"
                            ? "text-emerald-600"
                            : order.status?.toLowerCase() === "completed" ||
                                order.status?.toLowerCase() === "delivered"
                              ? "text-blue-600"
                              : order.status?.toLowerCase() === "cancelled"
                                ? "text-red-500"
                                : "text-slate-700"
                        }
                      >
                        {order.status || "Processing"}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="uppercase tracking-wide text-xs text-slate-400 mb-0.5">
                      Payment
                    </div>
                    <div className="font-semibold text-base text-slate-800 rounded px-2 py-1 inline-block bg-slate-50 border border-slate-200">
                      {order.payment?.method === "cod"
                        ? "Cash on Delivery"
                        : order.payment?.method === "card"
                          ? "Card"
                          : "Paypal"}
                    </div>
                  </div>
                  <div>
                    <div className="uppercase tracking-wide text-xs text-slate-400 mb-0.5">
                      Placed
                    </div>
                    <div className="font-mono text-xs text-slate-600">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleString()
                        : order.timestamp
                          ? new Date(order.timestamp).toLocaleString()
                          : "—"}
                    </div>
                  </div>
                </div>
                {/* Customer Info */}
                <div className="flex-1">
                  <div className="grid grid-cols-1 gap-x-6 gap-y-2 w-fit min-w-max ml-auto">
                    <div className="flex flex-col w-fit min-w-max">
                      <span className="flex items-center gap-1 text-blue-700 text-lg font-semibold">
                        <span title="Name">
                          <svg
                            className="inline mr-1 text-slate-400"
                            width={18}
                            height={18}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                          >
                            <circle
                              cx="12"
                              cy="8"
                              r="4"
                              stroke="currentColor"
                            />
                            <path
                              stroke="currentColor"
                              d="M4 20c0-4 16-4 16 0"
                            />
                          </svg>
                        </span>
                        {order.customer?.name}
                      </span>
                    </div>
                    <div className="flex flex-col w-fit min-w-max">
                      <span className="flex items-center gap-1 font-semibold text-slate-800 break-all">
                        <span title="Email">
                          <svg
                            className="inline mr-1 text-slate-400"
                            width={18}
                            height={18}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                          >
                            <rect
                              x="3"
                              y="5"
                              width="18"
                              height="14"
                              rx="2"
                              stroke="currentColor"
                            />
                            <path stroke="currentColor" d="M3 6l9 7 9-7" />
                          </svg>
                        </span>
                        {order.customer?.email}
                      </span>
                    </div>
                    <div className="flex flex-col w-fit min-w-max">
                      <span className="flex items-center gap-1 text-base text-slate-700">
                        <span title="Phone">
                          <svg
                            className="inline mr-1 text-slate-400"
                            width={18}
                            height={18}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke="currentColor"
                              d="M22 16.92v2a2 2 0 0 1-2.18 2c-3.36-.36-6.5-1.82-8.96-4.28S2.37 9.54 2 6.18A2 2 0 0 1 4 4h2a2 2 0 0 1 2 1.72c.12.81.37 1.6.73 2.33a2 2 0 0 1-.45 2.33l-.27.27a14.46 14.46 0 0 0 5.07 5.07l.27-.27a2 2 0 0 1 2.33-.45c.73.36 1.52.61 2.33.73A2 2 0 0 1 20 18.92z"
                            />
                          </svg>
                        </span>
                        {order.customer?.phone}
                      </span>
                    </div>
                    <div className="flex flex-col w-fit min-w-max">
                      <span className="flex items-center gap-1 font-mono text-xs text-slate-700 break-all">
                        <span title="Address">
                          <svg
                            className="inline mr-1 text-slate-400"
                            width={18}
                            height={18}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke="currentColor"
                              d="M12 21s-6-5.686-6-10a6 6 0 0 1 12 0c0 4.314-6 10-6 10z"
                            />
                            <circle
                              cx="12"
                              cy="11"
                              r="2"
                              stroke="currentColor"
                            />
                          </svg>
                        </span>
                        {order.customer?.address}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Items section */}
              <h3 className="mb-3 mt-2 text-xl font-bold text-slate-900 tracking-tight">
                Ordered Items
              </h3>
              <div className="mb-2 overflow-x-auto">
                <table className="w-full min-w-[520px] text-sm rounded-lg overflow-hidden">
                  <thead className="border-b-2 border-blue-200 bg-gradient-to-r from-blue-50 to-violet-50 text-blue-900">
                    <tr>
                      <th className="px-3 py-2 text-left font-semibold">
                        Item
                      </th>
                      <th className="px-3 py-2 text-center font-semibold">
                        Qty
                      </th>
                      <th className="px-3 py-2 text-right font-semibold">
                        Unit Price
                      </th>
                      <th className="px-3 py-2 text-right font-semibold">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {order.items &&
                    Array.isArray(order.items) &&
                    order.items.length > 0 ? (
                      order.items.map((item, idx) => (
                        <tr
                          className={
                            idx % 2 === 0 ? "bg-white" : "bg-slate-50/70"
                          }
                          key={item._id || idx}
                        >
                          <td className="px-3 py-3 font-semibold">
                            {item.name || "Unknown item"}
                          </td>
                          <td className="px-3 py-3 text-center text-lg font-mono">
                            {item.quantity ?? 1}
                          </td>
                          <td className="px-3 py-3 text-right">
                            {item.unitPrice !== undefined ? (
                              <span className="inline-block px-2 py-1 bg-blue-50 text-blue-900 rounded">
                                ${item.unitPrice.toFixed(2)}
                              </span>
                            ) : (
                              "—"
                            )}
                          </td>
                          <td className="px-3 py-3 text-right">
                            {item.unitPrice !== undefined &&
                            item.quantity !== undefined ? (
                              <span className="inline-block px-2 py-1 bg-violet-50 text-violet-900 rounded">
                                ${(item.unitPrice * item.quantity).toFixed(2)}
                              </span>
                            ) : (
                              "—"
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          className="px-3 py-5 text-center text-slate-400 italic"
                          colSpan={4}
                        >
                          No items found in this order.
                        </td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot className="border-t border-blue-200 bg-gradient-to-r from-blue-50 to-violet-50 font-semibold">
                    <tr>
                      <td colSpan="3" className="px-3 py-2 text-right">
                        Subtotal
                      </td>
                      <td className="px-3 py-2 text-right">
                        {order.total !== undefined ? `$${order.total}` : "—"}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="3" className="px-3 py-2 text-right">
                        Delivery
                      </td>
                      <td className="px-3 py-2 text-right">
                        {order.deliveryCharge !== undefined ? (
                          `$${order.deliveryCharge?.toFixed(2)}`
                        ) : (
                          <span className="inline-block px-2 py-1 bg-emerald-50 text-emerald-700 rounded">
                            Free
                          </span>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td
                        colSpan="3"
                        className="px-3 py-2 text-right font-bold text-xl"
                      >
                        Total
                      </td>
                      <td className="px-3 py-2 text-right font-bold text-slate-900 text-xl">
                        {order.total !== undefined
                          ? `$${order.total?.toFixed(2)}`
                          : "—"}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        )}

        {notFound && !loading && (
          <div className="w-full max-w-xl mx-auto bg-yellow-50 border border-yellow-200 shadow rounded-2xl px-8 py-10 text-center mt-12">
            <FaTimesCircle size={38} className="mx-auto mb-3 text-yellow-400" />
            <h2 className="font-bold text-2xl mb-1 text-yellow-700">
              Order not found
            </h2>
            <p className="mb-4 text-yellow-800">
              Please double check your order number and try again.
            </p>
            <button
              className="mt-2 px-6 py-2 rounded-xl font-semibold bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white shadow"
              onClick={() => {
                setOrderNumber("");
                setNotFound(false);
                setError(null);
                setOrder(null);
              }}
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
