"use client";

import { useMemo, useState } from "react";
import ProductGrid from "./ProductGrid";

function filterProducts(products, rawQuery) {
  const searchedItem = rawQuery.trim().toLowerCase();
  if (!searchedItem) return products;
  return products.filter((p) => {
    const name = (p.name || "").toLowerCase();
    // const description = (p.description || "").toLowerCase();
    return name.includes(searchedItem); // || description.includes(q);
  });
}

export default function ProductsListWithSearch({ products = [] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () => filterProducts(products, query),
    [products, query],
  );

  const hasQuery = query.trim().length > 0;

  return (
    <div>
      <div className="mb-6">
        <label htmlFor="product-search" className="sr-only">
          Search products
        </label>
        <input
          id="product-search"
          type="search"
          autoComplete="off"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products by name…"
          className="w-full max-w-xl rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        />
      </div>
      <ProductGrid
        products={filtered}
        emptyMessage={
          hasQuery ? "No products match your search." : "No products found."
        }
      />
    </div>
  );
}
