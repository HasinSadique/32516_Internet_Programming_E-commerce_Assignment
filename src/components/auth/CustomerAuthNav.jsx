"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CustomerAuthNav({ onNavigate }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    let isActive = true;

    async function loadSession() {
      try {
        const response = await fetch("/api/customer/session", {
          cache: "no-store",
        });

        if (response.ok) {
          const payload = await response.json();
          if (isActive) {
            setUser(payload.user || null);
          }
        } else if (isActive) {
          setUser(null);
        }
      } catch (error) {
        console.error("Failed to load customer session:", error);
        if (isActive) {
          setUser(null);
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    loadSession();

    return () => {
      isActive = false;
    };
  }, []);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/customer/logout", { method: "POST" });
      setUser(null);
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
      <span className="rounded-full px-4 py-2 text-sm text-slate-500">...</span>
    );
  }

  if (user) {
    return (
      <>
        <span className="hidden rounded-full px-3 py-2 text-sm font-medium text-slate-600 lg:inline">
          Hi, {user.fullName.split(" ")[0]}
        </span>
        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="rounded-full px-4 py-2 text-base font-medium text-slate-700 transition-all hover:bg-blue-50 hover:text-blue-800 hover:ring-1 hover:ring-blue-200 disabled:opacity-60"
        >
          {loggingOut ? "Logging out..." : "Logout"}
        </button>
      </>
    );
  }

  return (
    <>
      <Link
        href="/login"
        onClick={onNavigate}
        className="rounded-full px-4 py-2 text-base font-medium text-slate-700 transition-all hover:bg-blue-50 hover:text-blue-800 hover:ring-1 hover:ring-blue-200"
      >
        Login
      </Link>
      {/* <Link
        href="/register"
        onClick={onNavigate}
        className="rounded-full bg-blue-700 px-4 py-2 text-base font-semibold text-white shadow-sm transition-all hover:bg-blue-800"
      >
        Register
      </Link> */}
    </>
  );
}
