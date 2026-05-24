"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import DrawerPanel from "./DrawerPanel";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/order_status", label: "Order Status" },
];

export default function NavDrawer({ open, onClose }) {
  const pathname = usePathname();

  return (
    <DrawerPanel
      open={open}
      onClose={onClose}
      side="left"
      title="Menu"
      ariaLabel="Site navigation"
    >
      <nav className="px-2 py-3">
        <ul className="flex flex-col gap-1">
          {navLinks.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== "/" && pathname?.startsWith(link.href));

            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={onClose}
                  className={
                    isActive
                      ? "block rounded-lg bg-blue-100 px-4 py-3 text-base font-semibold text-blue-800"
                      : "block rounded-lg px-4 py-3 text-base font-medium text-slate-700 transition-colors hover:bg-blue-50 hover:text-blue-900"
                  }
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </DrawerPanel>
  );
}
