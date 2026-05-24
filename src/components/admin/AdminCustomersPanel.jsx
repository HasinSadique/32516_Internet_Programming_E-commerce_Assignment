"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import AdminLogoutButton from "@/components/admin/AdminLogoutButton";

function formatDate(value) {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";
  return new Intl.DateTimeFormat("en-AU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function normalizeCustomer(customer) {
  return {
    id: String(customer?.id ?? ""),
    fullName: String(customer?.fullName ?? ""),
    email: String(customer?.email ?? ""),
    phone: String(customer?.phone ?? ""),
    address: String(customer?.address ?? ""),
    postalCode: String(customer?.postalCode ?? ""),
    dateOfBirth: customer?.dateOfBirth ?? null,
    createdAt: customer?.createdAt ?? null,
  };
}

export default function AdminCustomersPanel() {
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [feedback, setFeedback] = useState(null);

  const selectedCustomer = useMemo(
    () => customers.find((customer) => customer.id === selectedCustomerId) ?? null,
    [customers, selectedCustomerId],
  );

  const filteredCustomers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return customers.filter((customer) => {
      if (!query) return true;
      return (
        customer.fullName.toLowerCase().includes(query) ||
        customer.email.toLowerCase().includes(query) ||
        customer.phone.toLowerCase().includes(query)
      );
    });
  }, [customers, searchTerm]);

  useEffect(() => {
    async function loadCustomers() {
      setIsLoading(true);
      setFeedback(null);
      try {
        const response = await fetch("/api/admin/customers", {
          cache: "no-store",
        });
        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload?.error || "Failed to fetch customers.");
        }
        setCustomers(
          Array.isArray(payload) ? payload.map(normalizeCustomer) : [],
        );
      } catch (error) {
        setFeedback({
          type: "error",
          message: error.message || "Failed to load customers.",
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadCustomers();
  }, []);

  async function handleDelete(customer) {
    const confirmDelete = window.confirm(
      `Delete the account for "${customer.fullName}" (${customer.email})?\n\nThis will permanently remove the customer profile and all of their orders. They will be able to register again with the same email.`,
    );
    if (!confirmDelete) return;

    setIsDeleting(true);
    setFeedback(null);
    try {
      const response = await fetch(`/api/admin/customers/${customer.id}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.error || "Failed to delete customer.");
      }

      setCustomers((prev) => prev.filter((item) => item.id !== customer.id));
      if (selectedCustomerId === customer.id) {
        setSelectedCustomerId("");
      }

      const ordersMessage =
        result.ordersDeleted > 0
          ? ` ${result.ordersDeleted} related order(s) were also removed.`
          : "";

      setFeedback({
        type: "success",
        message: `Customer account deleted successfully.${ordersMessage}`,
      });
    } catch (error) {
      setFeedback({
        type: "error",
        message: error.message || "Failed to delete customer.",
      });
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Manage Customers</h1>
          <p className="text-slate-600">
            View customer profiles and remove accounts when needed.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/dashboard"
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100"
          >
            Back to Dashboard
          </Link>
          <AdminLogoutButton />
        </div>
      </div>

      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-sm text-slate-500">Total customers</p>
        <p className="mt-1 text-2xl font-bold text-slate-900">
          {customers.length}
        </p>
      </div>

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

      <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4">
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by name, email, or phone"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 sm:w-80"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm text-slate-700">
              <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold">Name</th>
                  <th className="px-3 py-2 text-left font-semibold">Email</th>
                  <th className="px-3 py-2 text-left font-semibold">Phone</th>
                  <th className="px-3 py-2 text-left font-semibold">Joined</th>
                  <th className="px-3 py-2 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-3 py-8 text-center text-slate-500"
                    >
                      Loading customers...
                    </td>
                  </tr>
                ) : filteredCustomers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-3 py-8 text-center text-slate-500"
                    >
                      No customers found.
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((customer) => {
                    const isSelected = customer.id === selectedCustomerId;
                    return (
                      <tr
                        key={customer.id}
                        className={isSelected ? "bg-blue-50/60" : "bg-white"}
                      >
                        <td className="px-3 py-3 font-medium text-slate-900">
                          {customer.fullName || "N/A"}
                        </td>
                        <td className="px-3 py-3">{customer.email || "N/A"}</td>
                        <td className="px-3 py-3">{customer.phone || "N/A"}</td>
                        <td className="px-3 py-3">
                          {formatDate(customer.createdAt)}
                        </td>
                        <td className="px-3 py-3 text-right">
                          <div className="inline-flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setSelectedCustomerId(customer.id)}
                              className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100"
                            >
                              View
                            </button>
                            <button
                              type="button"
                              disabled={isDeleting}
                              onClick={() => handleDelete(customer)}
                              className="rounded-md border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-xl font-bold text-slate-900">
            Customer Profile
          </h2>
          {selectedCustomer ? (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-slate-500">Full name</p>
                <p className="text-lg text-slate-900">
                  {selectedCustomer.fullName || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Email</p>
                <p className="text-lg text-slate-900">
                  {selectedCustomer.email || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Phone</p>
                <p className="text-lg text-slate-900">
                  {selectedCustomer.phone || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Date of birth
                </p>
                <p className="text-lg text-slate-900">
                  {formatDate(selectedCustomer.dateOfBirth)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Address</p>
                <p className="text-lg text-slate-900">
                  {selectedCustomer.address || "N/A"}
                  {selectedCustomer.postalCode
                    ? `, ${selectedCustomer.postalCode}`
                    : ""}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Account created
                </p>
                <p className="text-lg text-slate-900">
                  {formatDate(selectedCustomer.createdAt)}
                </p>
              </div>
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => handleDelete(selectedCustomer)}
                className="mt-2 inline-flex w-full justify-center rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isDeleting ? "Deleting..." : "Delete Account"}
              </button>
            </div>
          ) : (
            <p className="text-sm text-slate-500">
              Select a customer from the table to view their profile details.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
