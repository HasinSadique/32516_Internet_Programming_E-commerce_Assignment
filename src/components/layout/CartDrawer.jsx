"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import DrawerPanel from "./DrawerPanel";

const FALLBACK_IMAGE = "https://placehold.co/80x80?text=No+Image";

export default function CartDrawer({ open, onClose }) {
  const { items, totalPrice, totalItems, updateQuantity, removeFromCart } =
    useCart();

  return (
    <DrawerPanel
      open={open}
      onClose={onClose}
      side="right"
      title="Your Cart"
      ariaLabel="Shopping cart"
    >
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
          <p className="text-base font-medium text-slate-700">
            No items added to cart
          </p>
          <Link
            href="/products"
            onClick={onClose}
            className="mt-6 inline-flex rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="flex h-full flex-col">
          <ul className="flex-1 divide-y divide-slate-100 px-4 py-2">
            {items.map((item) => (
              <li key={item._id} className="flex gap-3 py-4">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                  <img
                    src={item.image || FALLBACK_IMAGE}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-slate-900">
                    {item.name}
                  </p>
                  <p className="text-sm text-slate-600">
                    ${(item.price ?? 0).toFixed(2)} each
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <label className="sr-only" htmlFor={`qty-${item._id}`}>
                      Quantity for {item.name}
                    </label>
                    <input
                      id={`qty-${item._id}`}
                      type="number"
                      min={1}
                      value={item.quantity ?? 1}
                      onChange={(event) =>
                        updateQuantity(
                          item._id,
                          Number(event.target.value) || 1,
                        )
                      }
                      className="w-16 rounded-md border border-slate-300 bg-white px-2 py-1 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeFromCart(item._id)}
                      className="text-sm font-medium text-red-600 transition-colors hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    $
                    {((item.price ?? 0) * (item.quantity ?? 1)).toFixed(2)}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <div className="border-t border-slate-200 bg-slate-50 px-4 py-4">
            <p className="flex justify-between text-sm text-slate-600">
              <span>
                {totalItems} item{totalItems === 1 ? "" : "s"}
              </span>
              <span className="font-bold text-slate-900">
                ${totalPrice.toFixed(2)}
              </span>
            </p>
            <Link
              href="/cart"
              onClick={onClose}
              className="mt-3 inline-flex w-full justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100"
            >
              View full cart
            </Link>
            <Link
              href="/cart/checkout"
              onClick={onClose}
              className="mt-2 inline-flex w-full justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              Checkout
            </Link>
          </div>
        </div>
      )}
    </DrawerPanel>
  );
}
