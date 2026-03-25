"use client";

import { useCart } from "@/context/CartContext";
import { useState } from "react";

export default function AddToCartButton({ product }) {
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (product.stock < 1) {
    return (
      <button
        className="cursor-not-allowed rounded-lg bg-slate-300 px-4 py-2 font-medium text-slate-600"
        disabled
      >
        Out of stock
      </button>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <input
        type="number"
        min={1}
        max={product.stock}
        value={qty}
        onChange={(e) => setQty(Number(e.target.value) || 1)}
        className="w-24 rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
      />
      <button
        onClick={handleAdd}
        className={`rounded-lg px-4 py-2 font-medium text-white transition-colors ${
          added ? "bg-emerald-600 hover:bg-emerald-700" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {added ? "Added to cart!" : "Add to cart"}
      </button>
    </div>
  );
}
