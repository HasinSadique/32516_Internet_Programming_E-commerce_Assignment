"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ClipboardList, LogOut, User } from "lucide-react";
import { useCustomerSession } from "@/hooks/useCustomerSession";

export default function CustomerAuthNav({ onNavigate }) {
  const router = useRouter();
  const { user, loading, setUser } = useCustomerSession();
  const [loggingOut, setLoggingOut] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/customer/logout", { method: "POST" });
      setUser(null);
      setProfileOpen(false);
      onNavigate?.();
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Customer logout failed:", error);
    } finally {
      setLoggingOut(false);
    }
  }

  if (loading) {
    return (
      <span
        className="inline-block h-9 w-16 animate-pulse rounded-lg bg-slate-100"
        aria-hidden
      />
    );
  }

  if (user) {
    return (
      <div
        className="relative"
        onMouseEnter={() => setProfileOpen(true)}
        onMouseLeave={() => setProfileOpen(false)}
      >
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-full p-2 text-slate-700 transition-colors hover:bg-blue-50 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
          aria-label="Account menu"
          aria-expanded={profileOpen}
          aria-haspopup="true"
          onClick={() => setProfileOpen((open) => !open)}
        >
          <User className="h-6 w-6" strokeWidth={2} />
        </button>

        <div
          className={`absolute right-0 top-full z-50 pt-2 transition-all duration-150 ${
            profileOpen
              ? "pointer-events-auto visible translate-y-0 opacity-100"
              : "pointer-events-none invisible -translate-y-1 opacity-0"
          }`}
        >
          <div className="min-w-[10rem] overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg ring-1 ring-slate-100">
            <Link
              href="/profile"
              onClick={() => {
                setProfileOpen(false);
                onNavigate?.();
              }}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-blue-50 hover:text-blue-800"
            >
              <User className="h-4 w-4" />
              Profile
            </Link>
            <Link
              href="/orders"
              onClick={() => {
                setProfileOpen(false);
                onNavigate?.();
              }}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-blue-50 hover:text-blue-800"
            >
              <ClipboardList className="h-4 w-4" />
              Order History
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-blue-50 hover:text-blue-800 disabled:opacity-60"
            >
              <LogOut className="h-4 w-4" />
              {loggingOut ? "Logging out..." : "Logout"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link
      href="/login"
      onClick={onNavigate}
      className="inline-flex items-center justify-center rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
    >
      Login
    </Link>
  );
}
