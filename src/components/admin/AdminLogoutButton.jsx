"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogoutButton({ className = "" }) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  async function handleLogout() {
    setIsLoggingOut(true);

    try {
      await fetch("/api/admin/logout", {
        method: "POST",
      });
    } catch (error) {
      console.error("Failed to logout admin session:", error);
    } finally {
      router.replace("/admin/login");
      router.refresh();
      setIsLoggingOut(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isLoggingOut}
      className={`rounded-lg border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition-colors hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-70 ${className}`}
    >
      {isLoggingOut ? "Logging out..." : "Logout"}
    </button>
  );
}
