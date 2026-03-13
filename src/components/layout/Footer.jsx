import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer footer-center bg-base-200 text-base-content py-10 mt-auto">
      <aside>
        <p className="font-semibold text-lg">Shop</p>
        <p className="opacity-80">Your one-stop e-commerce store.</p>
        <div className="flex gap-4 mt-2">
          <Link href="/products" className="link link-hover">
            Products
          </Link>
          <Link href="/cart" className="link link-hover">
            Cart
          </Link>
          <Link href="/admin" className="link link-hover">
            Admin
          </Link>
        </div>
        <p className="mt-4 opacity-60">© {new Date().getFullYear()} Shop. All rights reserved.</p>
      </aside>
    </footer>
  );
}
