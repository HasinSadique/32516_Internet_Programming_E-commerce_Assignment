"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProductForm({ product = null, categories = [] }) {
  const isEdit = !!product;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: product?.name ?? "",
    description: product?.description ?? "",
    price: product?.price ?? "",
    categoryId: product?.categoryId ?? (categories[0]?.id ?? ""),
    image: product?.image ?? "",
    stock: product?.stock ?? 0,
    featured: product?.featured ?? false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const body = {
        name: form.name,
        description: form.description,
        price: Number(form.price) || 0,
        categoryId: form.categoryId || "",
        image: form.image || "",
        stock: Number(form.stock) || 0,
        featured: form.featured,
      };
      if (isEdit) {
        const res = await fetch(`/api/products/${product.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error("Update failed");
        router.push("/admin/products");
        router.refresh();
      } else {
        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error("Create failed");
        router.push("/admin/products");
        router.refresh();
      }
    } catch (err) {
      alert(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="form-control">
        <label className="label" htmlFor="name">
          <span className="label-text">Product name</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          value={form.name}
          onChange={handleChange}
          className="input input-bordered"
        />
      </div>

      <div className="form-control">
        <label className="label" htmlFor="description">
          <span className="label-text">Description</span>
        </label>
        <textarea
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
          className="textarea textarea-bordered"
          rows={4}
        />
      </div>

      <div className="form-control">
        <label className="label" htmlFor="price">
          <span className="label-text">Price ($)</span>
        </label>
        <input
          id="price"
          name="price"
          type="number"
          step="0.01"
          min="0"
          required
          value={form.price}
          onChange={handleChange}
          className="input input-bordered"
        />
      </div>

      <div className="form-control">
        <label className="label" htmlFor="categoryId">
          <span className="label-text">Category</span>
        </label>
        <select
          id="categoryId"
          name="categoryId"
          value={form.categoryId}
          onChange={handleChange}
          className="select select-bordered"
        >
          <option value="">— Select —</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-control">
        <label className="label" htmlFor="image">
          <span className="label-text">Image URL</span>
        </label>
        <input
          id="image"
          name="image"
          type="url"
          value={form.image}
          onChange={handleChange}
          className="input input-bordered"
          placeholder="https://..."
        />
      </div>

      <div className="form-control">
        <label className="label" htmlFor="stock">
          <span className="label-text">Stock</span>
        </label>
        <input
          id="stock"
          name="stock"
          type="number"
          min="0"
          value={form.stock}
          onChange={handleChange}
          className="input input-bordered w-32"
        />
      </div>

      <div className="form-control">
        <label className="label cursor-pointer justify-start gap-2">
          <input
            type="checkbox"
            name="featured"
            checked={form.featured}
            onChange={handleChange}
            className="checkbox checkbox-primary"
          />
          <span className="label-text">Featured product</span>
        </label>
      </div>

      <div className="flex gap-3">
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Saving…" : isEdit ? "Update product" : "Create product"}
        </button>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => router.back()}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
