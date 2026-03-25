"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const DEFAULT_FORM = {
  name: "",
  description: "",
  price: "",
  categoryId: "",
  image: "",
  stock: "",
  featured: false,
};

const STOCK_FILTERS = [
  { value: "all", label: "All stock levels" },
  { value: "in-stock", label: "In stock only" },
  { value: "low-stock", label: "Low stock (< 10)" },
  { value: "out-of-stock", label: "Out of stock" },
];

function normalizeIdentifier(value) {
  if (value == null) return "";
  if (typeof value === "object" && value.$oid) {
    return String(value.$oid);
  }
  return String(value);
}

function normalizeProduct(product) {
  return {
    ...product,
    _id: normalizeIdentifier(product?._id),
    name: String(product?.name ?? ""),
    description: String(product?.description ?? ""),
    price: Number(product?.price) || 0,
    categoryId: String(product?.categoryId ?? ""),
    image: String(product?.image ?? ""),
    stock: Number.isInteger(Number(product?.stock))
      ? Number(product?.stock)
      : 0,
    featured: Boolean(product?.featured),
    createdAt: product?.createdAt ?? null,
    updatedAt: product?.updatedAt ?? null,
  };
}

function getProductRouteId(product) {
  return normalizeIdentifier(product?._id);
}

function toFormState(product) {
  return {
    name: product.name ?? "",
    description: product.description ?? "",
    price: String(product.price ?? ""),
    categoryId: product.categoryId ?? "",
    image: product.image ?? "",
    stock: String(product.stock ?? ""),
    featured: Boolean(product.featured),
  };
}

function formatDate(value) {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";
  return new Intl.DateTimeFormat("en-AU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default function AdminProductsPanel() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [stockFilter, setStockFilter] = useState("all");
  const [activeProductId, setActiveProductId] = useState("");
  const [formState, setFormState] = useState(DEFAULT_FORM);
  const [feedback, setFeedback] = useState(null);

  const activeProduct = useMemo(
    () =>
      products.find(
        (product) => getProductRouteId(product) === String(activeProductId),
      ) ?? null,
    [products, activeProductId],
  );

  const filteredProducts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return products
      .filter((product) => {
        const isMatch =
          !query ||
          product.name.toLowerCase().includes(query) ||
          product.categoryId.toLowerCase().includes(query);

        if (!isMatch) return false;

        if (stockFilter === "in-stock") return product.stock > 0;
        if (stockFilter === "low-stock")
          return product.stock > 0 && product.stock < 10;
        if (stockFilter === "out-of-stock") return product.stock === 0;
        return true;
      })
      .sort(
        (a, b) =>
          new Date(b.updatedAt || 0).getTime() -
          new Date(a.updatedAt || 0).getTime(),
      );
  }, [products, searchTerm, stockFilter]);

  const productStats = useMemo(() => {
    const lowStock = products.filter(
      (product) => product.stock > 0 && product.stock < 10,
    ).length;
    const outOfStock = products.filter((product) => product.stock <= 0).length;
    const featured = products.filter((product) => product.featured).length;
    return {
      total: products.length,
      lowStock,
      outOfStock,
      featured,
    };
  }, [products]);

  useEffect(() => {
    async function loadProducts() {
      setIsLoading(true);
      setFeedback(null);
      try {
        const response = await fetch("/api/products", { cache: "no-store" });
        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload?.error || "Failed to fetch products.");
        }
        setProducts(
          Array.isArray(payload) ? payload.map(normalizeProduct) : [],
        );
      } catch (error) {
        setFeedback({
          type: "error",
          message: error.message || "Failed to load products.",
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadProducts();
  }, []);

  function resetEditor() {
    setActiveProductId("");
    setFormState(DEFAULT_FORM);
  }

  function handleStartEdit(product) {
    setActiveProductId(getProductRouteId(product));
    setFormState(toFormState(product));
    setFeedback(null);
  }

  function handleFieldChange(event) {
    const { name, value, type, checked } = event.target;
    setFormState((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFeedback(null);

    const payload = {
      name: formState.name.trim(),
      description: formState.description.trim(),
      price: Number(formState.price),
      categoryId: formState.categoryId.trim(),
      image: formState.image.trim(),
      stock: Number(formState.stock),
      featured: Boolean(formState.featured),
    };

    if (!payload.name) {
      setFeedback({ type: "error", message: "Product name is required." });
      return;
    }

    if (Number.isNaN(payload.price) || payload.price < 0) {
      setFeedback({
        type: "error",
        message: "Price must be a valid non-negative number.",
      });
      return;
    }

    if (!Number.isInteger(payload.stock) || payload.stock < 0) {
      setFeedback({
        type: "error",
        message: "Stock must be a valid non-negative integer.",
      });
      return;
    }

    const isEditMode = Boolean(activeProductId);
    const endpoint = isEditMode
      ? `/api/products/${activeProductId}`
      : "/api/products";
    const method = isEditMode ? "PUT" : "POST";

    setIsSubmitting(true);
    try {
      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || "Failed to save product.");
      }

      const normalized = normalizeProduct(result);

      if (isEditMode) {
        setProducts((prev) =>
          prev.map((product) =>
            getProductRouteId(product) === activeProductId
              ? normalized
              : product,
          ),
        );
        setFeedback({
          type: "success",
          message: "Product updated successfully.",
        });
      } else {
        setProducts((prev) => [normalized, ...prev]);
        setFeedback({
          type: "success",
          message: "Product created successfully.",
        });
        resetEditor();
      }
    } catch (error) {
      setFeedback({
        type: "error",
        message: error.message || "Failed to save product.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(product) {
    const routeId = getProductRouteId(product);
    const confirmDelete = window.confirm(
      `Delete "${product.name}"? This action cannot be undone.`,
    );
    if (!confirmDelete) return;

    setFeedback(null);
    try {
      const response = await fetch(`/api/products/${routeId}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.error || "Failed to delete product.");
      }

      setProducts((prev) =>
        prev.filter((item) => getProductRouteId(item) !== routeId),
      );

      if (activeProductId === routeId) {
        resetEditor();
      }

      setFeedback({
        type: "success",
        message: "Product deleted successfully.",
      });
    } catch (error) {
      setFeedback({
        type: "error",
        message: error.message || "Failed to delete product.",
      });
    }
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Manage Products</h1>
          <p className="text-slate-600">
            Create, update, and remove products from your store catalog.
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
          <p className="text-sm text-slate-500">Total products</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {productStats.total}
          </p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 shadow-sm">
          <p className="text-sm text-amber-700">Low stock</p>
          <p className="mt-1 text-2xl font-bold text-amber-700">
            {productStats.lowStock}
          </p>
        </div>
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 shadow-sm">
          <p className="text-sm text-rose-700">Out of stock</p>
          <p className="mt-1 text-2xl font-bold text-rose-700">
            {productStats.outOfStock}
          </p>
        </div>
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 shadow-sm">
          <p className="text-sm text-blue-700">Featured products</p>
          <p className="mt-1 text-2xl font-bold text-blue-700">
            {productStats.featured}
          </p>
        </div>
      </div>

      {feedback ? (
        <div
          className={`mb-6 rounded-lg border px-4 py-3 text-sm ${
            feedback.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {feedback.message}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by name or category"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 sm:w-72"
            />
            <select
              value={stockFilter}
              onChange={(event) => setStockFilter(event.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              {STOCK_FILTERS.map((filter) => (
                <option key={filter.value} value={filter.value}>
                  {filter.label}
                </option>
              ))}
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm text-slate-700">
              <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold">Name</th>
                  <th className="px-3 py-2 text-left font-semibold">
                    Category
                  </th>
                  <th className="px-3 py-2 text-right font-semibold">Price</th>
                  <th className="px-3 py-2 text-right font-semibold">Stock</th>
                  <th className="px-3 py-2 text-center font-semibold">
                    Featured
                  </th>
                  <th className="px-3 py-2 text-left font-semibold">Updated</th>
                  <th className="px-3 py-2 text-right font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-3 py-8 text-center text-slate-500"
                    >
                      Loading products...
                    </td>
                  </tr>
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-3 py-8 text-center text-slate-500"
                    >
                      No products found.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => {
                    const routeId = getProductRouteId(product);
                    const isSelected = routeId === activeProductId;
                    return (
                      <tr
                        key={routeId}
                        className={isSelected ? "bg-blue-50/60" : "bg-white"}
                      >
                        <td className="px-3 py-3 font-medium text-slate-900">
                          {product.name}
                        </td>
                        <td className="px-3 py-3">
                          {product.categoryId || "N/A"}
                        </td>
                        <td className="px-3 py-3 text-right">
                          ${product.price.toFixed(2)}
                        </td>
                        <td
                          className={`px-3 py-3 text-right font-medium ${
                            product.stock === 0
                              ? "text-red-600"
                              : product.stock < 10
                                ? "text-amber-600"
                                : "text-slate-700"
                          }`}
                        >
                          {product.stock}
                        </td>
                        <td className="px-3 py-3 text-center">
                          {product.featured ? "Yes" : "No"}
                        </td>
                        <td className="px-3 py-3">
                          {formatDate(product.updatedAt)}
                        </td>
                        <td className="px-3 py-3 text-right">
                          <div className="inline-flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleStartEdit(product)}
                              className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(product)}
                              className="rounded-md border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-xl font-bold text-slate-900">
              {activeProduct ? "Edit Product" : "Create Product"}
            </h2>
            {activeProduct ? (
              <button
                type="button"
                onClick={resetEditor}
                className="text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                Create New
              </button>
            ) : null}
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">
                Name
              </span>
              <input
                required
                name="name"
                value={formState.name}
                onChange={handleFieldChange}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">
                Description
              </span>
              <textarea
                name="description"
                rows={3}
                value={formState.description}
                onChange={handleFieldChange}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">
                  Price
                </span>
                <input
                  required
                  min={0}
                  step="0.01"
                  name="price"
                  type="number"
                  value={formState.price}
                  onChange={handleFieldChange}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">
                  Stock
                </span>
                <input
                  required
                  min={0}
                  step="1"
                  name="stock"
                  type="number"
                  value={formState.stock}
                  onChange={handleFieldChange}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </label>
            </div>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">
                Category ID
              </span>
              <input
                name="categoryId"
                value={formState.categoryId}
                onChange={handleFieldChange}
                placeholder="e.g. cat-amplifiers"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">
                Image URL
              </span>
              <input
                name="image"
                value={formState.image}
                onChange={handleFieldChange}
                placeholder="https://example.com/image.jpg"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </label>

            <label className="inline-flex items-center gap-2 pt-1 text-sm text-slate-700">
              <input
                name="featured"
                type="checkbox"
                checked={formState.featured}
                onChange={handleFieldChange}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              Mark as featured
            </label>

            <button
              disabled={isSubmitting}
              type="submit"
              className="mt-2 inline-flex w-full justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting
                ? "Saving..."
                : activeProduct
                  ? "Update Product"
                  : "Create Product"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
