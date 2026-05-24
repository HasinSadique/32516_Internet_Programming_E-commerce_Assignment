"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCustomerSession } from "@/hooks/useCustomerSession";

const inputClassName =
  "w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500";

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading, setUser } = useCustomerSession();
  const [form, setForm] = useState({
    phone: "",
    address: "",
    postalCode: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login?redirect=/profile");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (user) {
      setForm({
        phone: user.phone || "",
        address: user.address || "",
        postalCode: user.postalCode || "",
      });
    }
  }, [user]);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: undefined }));
    setFeedback(null);
  }

  function fieldError(name) {
    return fieldErrors[name] ? (
      <p className="mt-1 text-sm text-red-600">{fieldErrors[name]}</p>
    ) : null;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFeedback(null);
    setFieldErrors({});
    setSaving(true);

    try {
      const response = await fetch("/api/customer/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: form.phone.trim(),
          address: form.address.trim(),
          postalCode: form.postalCode.trim(),
        }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (payload?.errors) {
          setFieldErrors(payload.errors);
        }
        setFeedback({
          type: "error",
          message: payload?.error || "Unable to update profile.",
        });
        return;
      }

      setUser(payload.user);
      setFeedback({
        type: "success",
        message: "Profile updated successfully.",
      });
    } catch {
      setFeedback({
        type: "error",
        message: "Unable to update profile right now. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  }

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

      {feedback ? (
        <div
          className={`mb-6 rounded-lg border px-4 py-3 text-sm ${
            feedback.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {feedback.message}
        </div>
      ) : null}

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div>
          <p className="text-sm font-medium text-slate-500">Full name</p>
          <p className="text-lg text-slate-900">{user.fullName}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">Email</p>
          <p className="text-lg text-slate-900">{user.email}</p>
        </div>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">
            Phone
          </span>
          <input
            required
            type="tel"
            name="phone"
            value={form.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            className={inputClassName}
            placeholder="e.g. 0412345678"
          />
          {fieldError("phone")}
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">
            Address
          </span>
          <input
            required
            type="text"
            name="address"
            value={form.address}
            onChange={(event) => updateField("address", event.target.value)}
            className={inputClassName}
            placeholder="Street address"
          />
          {fieldError("address")}
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">
            Postal code
          </span>
          <input
            required
            type="text"
            name="postalCode"
            value={form.postalCode}
            onChange={(event) => updateField("postalCode", event.target.value)}
            className={inputClassName}
            placeholder="e.g. 2000"
          />
          {fieldError("postalCode")}
        </label>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex w-full justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
      </form>

      <Link
        href="/orders"
        className="mt-6 inline-flex text-sm font-semibold text-blue-700 hover:text-blue-900"
      >
        View order history
      </Link>
    </div>
  );
}
