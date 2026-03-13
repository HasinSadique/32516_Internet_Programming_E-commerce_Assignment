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
      <button className="btn btn-disabled" disabled>
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
        className="input input-bordered w-24"
      />
      <button
        onClick={handleAdd}
        className={`btn btn-primary ${added ? "btn-success" : ""}`}
      >
        {added ? "Added to cart!" : "Add to cart"}
      </button>
    </div>
  );
}
