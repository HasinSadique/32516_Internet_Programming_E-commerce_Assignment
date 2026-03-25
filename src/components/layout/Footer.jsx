import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white py-10">
      <aside className="container mx-auto px-4 text-center text-slate-700">
        <p className="text-lg font-semibold text-slate-900">Shop</p>
        <p className="opacity-80">Your one-stop e-commerce store.</p>
        <div className="mt-2 flex justify-center gap-4">
          <Link
            href="/products"
            className="text-blue-600 transition-colors hover:text-blue-700"
          >
            Products
          </Link>
          <Link
            href="/cart"
            className="text-blue-600 transition-colors hover:text-blue-700"
          >
            Cart
          </Link>
          <Link
            href="/order_status"
            className="text-blue-600 transition-colors hover:text-blue-700"
          >
            Order Status
          </Link>
          <Link
            href="/admin"
            className="text-blue-600 transition-colors hover:text-blue-700"
          >
            Admin Panel
          </Link>
        </div>
        <p className="mt-4 opacity-60">
          © {new Date().getFullYear()} Shop. All rights reserved.
        </p>
      </aside>
    </footer>
  );
}
