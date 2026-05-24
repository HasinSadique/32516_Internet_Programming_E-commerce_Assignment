"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const inputClassName =
  "w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500";

const initialForm = {
  fullName: "",
  dateOfBirth: "",
  address: "",
  postalCode: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
};

export default function CustomerRegisterPage() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [redirectTo, setRedirectTo] = useState("/");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setRedirectTo(params.get("redirect") || "/");
  }, []);

  useEffect(() => {
    let isActive = true;

    async function checkSession() {
      try {
        const response = await fetch("/api/customer/session", {
          cache: "no-store",
        });

        if (response.ok) {
          window.location.assign(redirectTo);
          return;
        }
      } catch (sessionError) {
        console.error("Failed to verify customer session:", sessionError);
      } finally {
        if (isActive) {
          setCheckingSession(false);
        }
      }
    }

    checkSession();

    return () => {
      isActive = false;
    };
  }, [redirectTo]);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setFieldErrors({});
    setLoading(true);

    try {
      const response = await fetch("/api/customer/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: form.fullName.trim(),
          dateOfBirth: form.dateOfBirth,
          address: form.address.trim(),
          postalCode: form.postalCode.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          password: form.password,
          confirmPassword: form.confirmPassword,
        }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (payload?.errors) {
          setFieldErrors(payload.errors);
        }
        setError(payload?.error || "Unable to complete registration.");
        return;
      }

      window.location.assign(redirectTo);
      return;
    } catch {
      setError("Unable to register right now. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function fieldError(name) {
    return fieldErrors[name] ? (
      <p className="mt-1 text-sm text-red-600">{fieldErrors[name]}</p>
    ) : null;
  }

  if (checkingSession) {
    return (
      <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-16">
        <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="font-medium text-slate-700">Checking your session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mx-auto w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="mb-2 text-center text-3xl font-bold text-blue-800">
          Customer Registration
        </h1>
        <p className="mb-6 text-center text-sm text-slate-600">
          Create an account to shop and place orders.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <label
                htmlFor="fullName"
                className="mb-1 block font-semibold text-slate-700"
              >
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                autoComplete="name"
                className={`${inputClassName} ${fieldErrors.fullName ? "border-red-500" : ""}`}
                value={form.fullName}
                onChange={(event) => updateField("fullName", event.target.value)}
                required
                disabled={loading}
              />
              {fieldError("fullName")}
            </div>

            <div>
              <label
                htmlFor="dateOfBirth"
                className="mb-1 block font-semibold text-slate-700"
              >
                Date of Birth
              </label>
              <input
                id="dateOfBirth"
                type="date"
                className={`${inputClassName} ${fieldErrors.dateOfBirth ? "border-red-500" : ""}`}
                value={form.dateOfBirth}
                onChange={(event) =>
                  updateField("dateOfBirth", event.target.value)
                }
                required
                disabled={loading}
              />
              {fieldError("dateOfBirth")}
            </div>

            <div>
              <label
                htmlFor="postalCode"
                className="mb-1 block font-semibold text-slate-700"
              >
                Postal Code
              </label>
              <input
                id="postalCode"
                type="text"
                autoComplete="postal-code"
                className={`${inputClassName} ${fieldErrors.postalCode ? "border-red-500" : ""}`}
                value={form.postalCode}
                onChange={(event) =>
                  updateField("postalCode", event.target.value)
                }
                required
                disabled={loading}
              />
              {fieldError("postalCode")}
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="address"
                className="mb-1 block font-semibold text-slate-700"
              >
                Address
              </label>
              <input
                id="address"
                type="text"
                autoComplete="street-address"
                className={`${inputClassName} ${fieldErrors.address ? "border-red-500" : ""}`}
                value={form.address}
                onChange={(event) => updateField("address", event.target.value)}
                required
                disabled={loading}
              />
              {fieldError("address")}
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-1 block font-semibold text-slate-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className={`${inputClassName} ${fieldErrors.email ? "border-red-500" : ""}`}
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
                required
                disabled={loading}
              />
              {fieldError("email")}
            </div>

            <div>
              <label
                htmlFor="phone"
                className="mb-1 block font-semibold text-slate-700"
              >
                Phone
              </label>
              <input
                id="phone"
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                className={`${inputClassName} ${fieldErrors.phone ? "border-red-500" : ""}`}
                value={form.phone}
                onChange={(event) => updateField("phone", event.target.value)}
                required
                disabled={loading}
              />
              {fieldError("phone")}
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1 block font-semibold text-slate-700"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                className={`${inputClassName} ${fieldErrors.password ? "border-red-500" : ""}`}
                value={form.password}
                onChange={(event) => updateField("password", event.target.value)}
                required
                disabled={loading}
              />
              {fieldError("password")}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-1 block font-semibold text-slate-700"
              >
                Re-type Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                className={`${inputClassName} ${fieldErrors.confirmPassword ? "border-red-500" : ""}`}
                value={form.confirmPassword}
                onChange={(event) =>
                  updateField("confirmPassword", event.target.value)
                }
                required
                disabled={loading}
              />
              {fieldError("confirmPassword")}
            </div>
          </div>

          {error && <p className="text-center text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-700 px-4 py-2.5 font-semibold text-white shadow transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link
            href={
              redirectTo === "/"
                ? "/login"
                : `/login?redirect=${encodeURIComponent(redirectTo)}`
            }
            className="font-semibold text-blue-700 hover:text-blue-900"
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
