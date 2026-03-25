"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  // When clicked, "Home" loads the homepage (/), located at src/app/page.js
  { href: "/", label: "Home" },
  // When clicked, "Products" loads the products listing page (/products), located at src/app/products/page.js
  { href: "/products", label: "Products" },
  // When clicked, "Cart" loads the shopping cart page (/cart), located at src/app/cart/page.js
  { href: "/cart", label: "Cart" },
  // When clicked, "Order Status" loads the order status page (/order_status), located at src/app/order_status/page.js
  { href: "/order_status", label: "Order Status" },
  // When clicked, "Admin" loads the admin dashboard page (/admin), located at src/app/admin/page.js
  { href: "/admin", label: "Admin" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-bold text-blue-600">
          AutoTech
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {navLinks.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== "/" && pathname?.startsWith(link.href));

            return (
              <Link
                key={link.href}
                href={link.href}
                className={
                  isActive
                    ? "rounded-md bg-blue-100 px-3 py-2 text-sm font-medium text-blue-700"
                    : "rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900"
                }
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
