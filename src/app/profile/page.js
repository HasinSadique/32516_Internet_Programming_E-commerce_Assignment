"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useCustomerSession } from "@/hooks/useCustomerSession";

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading } = useCustomerSession();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login?redirect=/profile");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="container mx-auto flex min-h-[50vh] items-center justify-center px-4 py-16">
        <p className="font-medium text-slate-600">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto max-w-lg px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold text-slate-900">Your Profile</h1>
      <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <p className="text-sm font-medium text-slate-500">Full name</p>
          <p className="text-lg text-slate-900">{user.fullName}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">Email</p>
          <p className="text-lg text-slate-900">{user.email}</p>
        </div>
        {user.phone && (
          <div>
            <p className="text-sm font-medium text-slate-500">Phone</p>
            <p className="text-lg text-slate-900">{user.phone}</p>
          </div>
        )}
        {user.address && (
          <div>
            <p className="text-sm font-medium text-slate-500">Address</p>
            <p className="text-lg text-slate-900">
              {user.address}
              {user.postalCode ? `, ${user.postalCode}` : ""}
            </p>
          </div>
        )}
      </div>
      <Link
        href="/orders"
        className="mt-6 inline-flex text-sm font-semibold text-blue-700 hover:text-blue-900"
      >
        View order history
      </Link>
    </div>
  );
}
