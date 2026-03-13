"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/cart", label: "Cart" },
];

export default function Header() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  return (
    <header className="navbar bg-base-200 shadow-md sticky top-0 z-50">
      <div className="navbar-start">
        <Link
          href={isAdmin ? "/admin" : "/"}
          className="btn btn-ghost text-xl font-bold text-primary"
        >
          {isAdmin ? "Admin" : "Shop"}
        </Link>
      </div>
      <div className="navbar-center hidden md:flex">
        <ul className="menu menu-horizontal gap-1">
          {isAdmin ? (
            <li>
              <Link
                href="/admin/products"
                className={pathname?.includes("/admin/products") ? "active" : ""}
              >
                Products
              </Link>
            </li>
          ) : (
            navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={
                    pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href))
                      ? "active"
                      : ""
                  }
                >
                  {link.label}
                </Link>
              </li>
            ))
          )}
        </ul>
      </div>
      <div className="navbar-end gap-2">
        {!isAdmin && (
          <Link href="/admin" className="btn btn-ghost btn-sm">
            Admin
          </Link>
        )}
        {isAdmin && (
          <Link href="/" className="btn btn-ghost btn-sm">
            Store
          </Link>
        )}
      </div>
    </header>
  );
}
