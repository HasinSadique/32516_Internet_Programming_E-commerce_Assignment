"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import CustomerAuthNav from "@/components/auth/CustomerAuthNav";
import NavDrawer from "@/components/layout/NavDrawer";
import CartDrawer from "@/components/layout/CartDrawer";

function BrandLogo() {
  return (
    <>
      <svg
        className="h-7 w-7 shrink-0 text-blue-600 sm:h-8 sm:w-8"
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
      <span className="truncate text-base font-bold tracking-tight text-blue-700 sm:text-xl">
        AutoTech Solutions
      </span>
    </>
  );
}

export default function Header() {
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const { totalItems } = useCart();

  function openNavDrawer() {
    setCartDrawerOpen(false);
    setNavDrawerOpen(true);
  }

  function openCartDrawer() {
    setNavDrawerOpen(false);
    setCartDrawerOpen(true);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
      <div className="container mx-auto grid grid-cols-[auto_1fr_auto] items-center gap-2 px-3 py-3 sm:gap-4 sm:px-4">
        {/* Section 1: Nav drawer trigger */}
        <div className="flex justify-start">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg p-2 text-slate-700 transition-colors hover:bg-blue-50 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
            aria-label="Open navigation menu"
            onClick={openNavDrawer}
          >
            <Menu className="h-6 w-6 sm:h-7 sm:w-7" />
          </button>
        </div>

        {/* Section 2: Logo and name */}
        <div className="flex min-w-0 justify-center">
          <Link
            href="/"
            className="flex max-w-full items-center gap-2 transition-colors hover:text-blue-900"
          >
            <BrandLogo />
          </Link>
        </div>

        {/* Section 3: Login / profile and cart */}
        <div className="flex items-center justify-end gap-1 sm:gap-2">
          <CustomerAuthNav onNavigate={() => setNavDrawerOpen(false)} />
          <button
            type="button"
            className="relative inline-flex items-center justify-center rounded-full p-2 text-slate-700 transition-colors hover:bg-blue-50 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
            aria-label={`Open cart${totalItems > 0 ? `, ${totalItems} items` : ""}`}
            onClick={openCartDrawer}
          >
            <ShoppingCart className="h-6 w-6" strokeWidth={2} />
            {totalItems > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-700 px-1 text-[10px] font-bold text-white">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </button>
        </div>
      </div>

      <NavDrawer open={navDrawerOpen} onClose={() => setNavDrawerOpen(false)} />
      <CartDrawer
        open={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
      />
    </header>
  );
}
