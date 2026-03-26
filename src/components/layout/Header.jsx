"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react"; // Modern icon library

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/cart", label: "Cart" },
  { href: "/order_status", label: "Order Status" },
  // { href: "/admin", label: "Admin" },
];

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur shadow-sm">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link
          href="/"
          className="flex items-center gap-2 text-2xl font-bold tracking-tight text-blue-700 hover:text-blue-900 transition-colors"
        >
          <svg
            className="w-8 h-8 text-blue-600"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <rect width="32" height="32" rx="8" fill="#3B82F6" />
            <path
              d="M8 18l4.5-6L18 22l6-10"
              stroke="#fff"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          AutoTech Solutions
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
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
                    ? "rounded-full bg-blue-700/10 px-4 py-2 text-base font-semibold text-blue-700 shadow-sm ring-1 ring-blue-100"
                    : "rounded-full px-4 py-2 text-base font-medium text-slate-700 transition-all hover:bg-blue-50 hover:text-blue-800 hover:ring-1 hover:ring-blue-200"
                }
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile Hamburger */}
        <button
          className="inline-flex items-center justify-center md:hidden p-2 rounded transition-colors hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-300"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>
      </div>

      {/* Mobile nav dropdown */}
      {menuOpen && (
        <nav className="md:hidden px-4 pb-4 bg-white/90 shadow-sm animate-fade-in-down">
          <ul className="flex flex-col gap-2">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/" && pathname?.startsWith(link.href));

              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={
                      isActive
                        ? "block rounded-md bg-blue-100 px-4 py-2 text-base font-semibold text-blue-700"
                        : "block rounded-md px-4 py-2 text-base font-medium text-slate-700 transition-colors hover:bg-blue-50 hover:text-blue-900"
                    }
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </header>
  );
}
