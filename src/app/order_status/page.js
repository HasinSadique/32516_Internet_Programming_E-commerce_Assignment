"use client";
import { useState } from "react";

// export const metadata = {
//   title: "Order Status | Shop",
//   description: "Check your order status.",
// };

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
    <div>
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold text-slate-900">Order Status</h1>
        <p className="mb-6 text-slate-700">
          Enter your order number to check the status of your order.
        </p>
        <form onSubmit={handleSubmit} className="flex items-start gap-4">
          <input
            onChange={(e) => setOrderNumber(e.target.value)}
            value={orderNumber}
            type="text"
            placeholder="Order Number"
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            disabled={loading}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            disabled={loading}
          >
            {loading ? "Checking..." : "Check Status"}
          </button>
        </form>
        {error && (
          <div className="mt-4 text-red-700 rounded bg-red-50 px-4 py-2 border border-red-200">
            {error}
          </div>
        )}
      </div>
      {loading && (
        <div className="container mx-auto px-4">
          <div className="py-8 text-center text-lg text-slate-600">
            Loading...
          </div>
        </div>
      )}
      {order && !loading && (
        <div className="container mx-auto px-4">
          <div className="rounded-xl border border-slate-200 bg-white shadow-lg">
            <div className="p-6">
              {/* Top 4 columns: Order #, Status, Delivery Date, Tracking # */}
              <div className="mb-6 grid grid-cols-2 gap-4 rounded-lg border border-slate-200 p-4 md:grid-cols-4 ">
                <div>
                  <div className="mb-1 text-xs uppercase text-slate-500">
                    Order #
                  </div>
                  <div className="text-lg font-bold text-blue-600">
                    {order.orderId || order._id}
                  </div>
                </div>
                <div>
                  <div className="mb-1 text-xs uppercase text-slate-500">
                    Status
                  </div>
                  <div
                    className={`font-bold ${order.status === "Shipped" ? "text-emerald-600" : "text-slate-700"}`}
                  >
                    {order.status || "Processing"}
                  </div>
                </div>
                <div>
                  <div className="mb-1 text-xs uppercase text-slate-500">
                    payment Method
                  </div>
                  <div className="font-semibold text-slate-800">
                    {order.payment.method === "cod"
                      ? "Cash on Delivery"
                      : order.payment.method === "card"
                        ? "Card"
                        : "Paypal"}
                  </div>
                </div>
                <div>
                  <div className="mb-1 text-xs uppercase text-slate-500">
                    Created At
                  </div>
                  <div className="break-all font-mono text-xs text-slate-700">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleString()
                      : order.timestamp
                        ? new Date(order.timestamp).toLocaleString()
                        : "—"}
                  </div>
                </div>
              </div>
              <div className="mb-6 grid grid-cols-2 gap-4 rounded-lg border border-slate-200 p-4 md:grid-cols-4 ">
                <div>
                  <div className="mb-1 text-xs uppercase text-slate-500">
                    Customer Name
                  </div>
                  <div className="text-lg font-bold text-blue-600">
                    {order.customer.name}
                  </div>
                </div>
                <div>
                  <div className="mb-1 text-xs uppercase text-slate-500">
                    Email
                  </div>
                  <div className={`font-bold ${order.customer.email}`}>
                    {order.customer.email || "Processing"}
                  </div>
                </div>
                <div>
                  <div className="mb-1 text-xs uppercase text-slate-500">
                    Phone Number
                  </div>
                  <div className="font-semibold text-slate-800">
                    {order.customer.phone}
                  </div>
                </div>
                <div>
                  <div className="mb-1 text-xs uppercase text-slate-500">
                    Address
                  </div>
                  <div className="break-all font-mono text-xs text-slate-700">
                    {order.customer.address}
                  </div>
                </div>
              </div>
              {/* Ordered items table */}
              <h3 className="mb-3 mt-2 text-lg font-bold text-slate-900">
                Ordered Items
              </h3>
              <div className="mb-4 overflow-x-auto">
                <table className="w-full min-w-[520px] text-sm text-slate-700">
                  <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
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
                      order.items.map(
                        (item, idx) => (
                          console.log("item", item),
                          (
                            <tr
                              className={
                                idx % 2 === 0 ? "bg-white" : "bg-slate-50/60"
                              }
                              key={item._id || idx}
                            >
                              <td className="px-3 py-2">
                                {item.name || "Unknown item"}
                              </td>
                              <td className="px-3 py-2 text-center">
                                {item.quantity ?? 1}
                              </td>
                              <td className="px-3 py-2 text-right">
                                {item.unitPrice !== undefined
                                  ? `$${item.unitPrice.toFixed(2)}`
                                  : "—"}
                              </td>
                              <td className="px-3 py-2 text-right">
                                {item.unitPrice !== undefined &&
                                item.quantity !== undefined
                                  ? `$${(item.unitPrice * item.quantity).toFixed(2)}`
                                  : "—"}
                              </td>
                            </tr>
                          )
                        ),
                      )
                    ) : (
                      <tr>
                        <td className="px-3 py-2 text-center" colSpan={4}>
                          No items found in this order.
                        </td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot className="border-t border-slate-200 bg-slate-50">
                    <tr>
                      <td
                        colSpan="3"
                        className="px-3 py-2 text-right font-semibold"
                      >
                        Subtotal
                      </td>
                      <td className="px-3 py-2 text-right">
                        {order.total !== undefined ? `$${order.total}` : "—"}
                      </td>
                    </tr>
                    <tr>
                      <td
                        colSpan="3"
                        className="px-3 py-2 text-right font-semibold"
                      >
                        Delivery Charge
                      </td>
                      <td className="px-3 py-2 text-right">
                        {order.deliveryCharge !== undefined
                          ? `$${order.deliveryCharge.toFixed(2)}`
                          : "Free"}
                      </td>
                    </tr>
                    <tr>
                      <td
                        colSpan="3"
                        className="px-3 py-2 text-right font-bold"
                      >
                        Total
                      </td>
                      <td className="px-3 py-2 text-right font-bold text-slate-900">
                        {order.total !== undefined
                          ? `$${order.total.toFixed(2)}`
                          : "—"}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
      {notFound && !loading && (
        <div className="container mx-auto px-4 py-8">
          <div className="rounded-lg bg-yellow-100 p-4 text-center text-yellow-900 border border-yellow-200">
            <h2 className="font-bold text-lg mb-1">Order not found</h2>
            <p>Please enter a valid order number.</p>
          </div>
        </div>
      )}
    </div>
  );
}
