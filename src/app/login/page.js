"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const inputClassName =
  "w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500";

export default function CustomerLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const router = useRouter();
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
          router.replace(redirectTo);
          router.refresh();
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
  }, [router, redirectTo]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setFieldErrors({});
    setLoading(true);

    try {
      const response = await fetch("/api/customer/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (payload?.errors) {
          setFieldErrors(payload.errors);
        }
        setError(payload?.error || "Invalid email or password.");
        return;
      }

      router.replace(redirectTo);
      router.refresh();
    } catch {
      setError("Unable to login right now. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (checkingSession) {
    return (
      <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-16">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="font-medium text-slate-700">Checking your session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="mb-2 text-center text-3xl font-bold text-blue-800">
          Customer Login
        </h1>
        <p className="mb-6 text-center text-sm text-slate-600">
          Sign in to continue shopping and checkout.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
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
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              disabled={loading}
            />
            {fieldErrors.email && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
            )}
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
              autoComplete="current-password"
              className={`${inputClassName} ${fieldErrors.password ? "border-red-500" : ""}`}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              disabled={loading}
            />
            {fieldErrors.password && (
              <p className="mt-1 text-sm text-red-600">
                {fieldErrors.password}
              </p>
            )}
          </div>

          {error && <p className="text-center text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-700 px-4 py-2.5 font-semibold text-white shadow transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Don&apos;t have an account?{" "}
          <Link
            href={
              redirectTo === "/"
                ? "/register"
                : `/register?redirect=${encodeURIComponent(redirectTo)}`
            }
            className="font-semibold text-blue-700 hover:text-blue-900"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
