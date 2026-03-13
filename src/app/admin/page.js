import Link from "next/link";
import { getAllProducts } from "@/lib/data/products";

export default function AdminDashboardPage() {
  const products = getAllProducts();
  const totalProducts = products.length;
  const lowStock = products.filter((p) => p.stock > 0 && p.stock < 10).length;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <div className="grid sm:grid-cols-2 gap-6 mb-8">
        <div className="stat bg-base-200 rounded-lg shadow">
          <div className="stat-title">Total Products</div>
          <div className="stat-value text-primary">{totalProducts}</div>
          <Link href="/admin/products" className="stat-desc link link-primary">
            View all
          </Link>
        </div>
        <div className="stat bg-base-200 rounded-lg shadow">
          <div className="stat-title">Low Stock (under 10)</div>
          <div className="stat-value text-warning">{lowStock}</div>
          <Link href="/admin/products" className="stat-desc link link-primary">
            Manage
          </Link>
        </div>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/products/new" className="btn btn-primary">
            Add new product
          </Link>
          <Link href="/admin/products" className="btn btn-outline">
            Manage products
          </Link>
        </div>
      </div>
    </div>
  );
}
