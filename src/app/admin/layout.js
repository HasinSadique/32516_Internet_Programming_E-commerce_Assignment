import Link from "next/link";

export const metadata = {
  title: "Admin | Shop",
  description: "Manage products and store settings.",
};

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-[60vh] container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="md:w-56 shrink-0">
          <nav className="menu bg-base-200 rounded-lg p-2 w-full">
            <li>
              <Link href="/admin">Dashboard</Link>
            </li>
            <li>
              <Link href="/admin/products">All Products</Link>
            </li>
            <li>
              <Link href="/admin/products/new">Add Product</Link>
            </li>
          </nav>
        </aside>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
