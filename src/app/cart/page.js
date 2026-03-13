"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

const FALLBACK_IMAGE = "https://placehold.co/100x100?text=No+Image";

export default function CartPage() {
  const { items, totalPrice, updateQuantity, removeFromCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
        <p className="opacity-80 mb-6">Add some products to get started.</p>
        <Link href="/products" className="btn btn-primary">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Subtotal</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="flex items-center gap-4">
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-base-200 shrink-0">
                          <img
                            src={item.image || FALLBACK_IMAGE}
                            alt={item.name}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <span className="font-medium">{item.name}</span>
                      </div>
                    </td>
                    <td>${(item.price ?? 0).toFixed(2)}</td>
                    <td>
                      <input
                        type="number"
                        min={1}
                        value={item.quantity ?? 1}
                        onChange={(e) =>
                          updateQuantity(item.id, Number(e.target.value) || 1)
                        }
                        className="input input-bordered input-sm w-20"
                      />
                    </td>
                    <td>
                      ${((item.price ?? 0) * (item.quantity ?? 1)).toFixed(2)}
                    </td>
                    <td>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="btn btn-ghost btn-sm text-error"
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
          <div className="card bg-base-200 shadow">
            <div className="card-body">
              <h2 className="card-title">Order summary</h2>
              <p className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold">${totalPrice.toFixed(2)}</span>
              </p>
              <p className="text-sm opacity-80">
                Shipping calculated at checkout.
              </p>
              <Link href="/cart" className="btn btn-primary mt-4">
                Proceed to checkout
              </Link>
              <Link href="/products" className="btn btn-ghost">
                Continue shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
