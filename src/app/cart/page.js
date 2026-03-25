"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

const FALLBACK_IMAGE = "https://placehold.co/100x100?text=No+Image";

export default function CartPage() {
  const { items, totalPrice, updateQuantity, removeFromCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="mb-4 text-3xl font-bold text-slate-900">Your cart is empty</h1>
        <p className="mb-6 text-slate-600">Add some products to get started.</p>
        <Link
          href="/products"
          className="inline-flex rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-blue-700"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-slate-900">Shopping Cart</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full min-w-[700px] text-sm text-slate-700">
              <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold">Product</th>
                  <th className="px-3 py-2 text-left font-semibold">Price</th>
                  <th className="px-3 py-2 text-left font-semibold">Quantity</th>
                  <th className="px-3 py-2 text-left font-semibold">Subtotal</th>
                  <th className="px-3 py-2 text-left font-semibold" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-4">
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                          <img
                            src={item.image || FALLBACK_IMAGE}
                            alt={item.name}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <span className="font-medium text-slate-900">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3">${(item.price ?? 0).toFixed(2)}</td>
                    <td className="px-3 py-3">
                      <input
                        type="number"
                        min={1}
                        value={item.quantity ?? 1}
                        onChange={(e) =>
                          updateQuantity(item.id, Number(e.target.value) || 1)
                        }
                        className="w-20 rounded-md border border-slate-300 bg-white px-2 py-1.5 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      />
                    </td>
                    <td className="px-3 py-3 font-medium text-slate-900">
                      ${((item.price ?? 0) * (item.quantity ?? 1)).toFixed(2)}
                    </td>
                    <td className="px-3 py-3">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="rounded-md px-2 py-1 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-slate-900">Order summary</h2>
            <p className="flex justify-between text-slate-700">
              <span>Subtotal</span>
              <span className="font-bold text-slate-900">${totalPrice.toFixed(2)}</span>
            </p>
            <p className="mt-2 text-sm text-slate-500">Shipping calculated at checkout.</p>
            <Link
              href="/cart"
              className="mt-4 inline-flex w-full justify-center rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white transition-colors hover:bg-blue-700"
            >
              Proceed to checkout
            </Link>
            <Link
              href="/products"
              className="mt-3 inline-flex w-full justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 font-semibold text-slate-700 transition-colors hover:bg-slate-100"
            >
              Continue shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
