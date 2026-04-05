"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();

  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    payment: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [orderId, setOrderId] = useState(null);

  const FALLBACK_IMAGE = "https://placehold.co/64x64?text=No+Image";

  if (!items || items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="mb-4 text-3xl font-bold text-slate-900">
          Your cart is empty
        </h1>
        <p className="mb-6 text-slate-600">
          Add some products to your cart before checking out.
        </p>
        <Link
          href="/products"
          className="inline-flex rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-blue-700"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  function validate(f) {
    const next = {};
    if (!f.name.trim()) next.name = "Name is required";
    if (!f.address.trim()) next.address = "Address is required";
    if (!f.phone.trim()) next.phone = "Phone number is required";
    if (!/^\+?\d{7,16}$/.test(f.phone.trim()))
      next.phone = "Enter a valid phone number";
    if (!f.email.trim()) next.email = "Email is required";
    if (f.email && !/^[^@]+@[^@]+\.[^@]+$/.test(f.email))
      next.email = "Enter a valid email address";
    if (!f.payment) next.payment = "Payment method is required";
    return next;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setIsSubmitting(true);
    setErrors({});
    const id = await submitOrder();
    if (id) {
      console.log("Order placed successfully. Order ID:", id);
      setOrderId(id);
      setSubmitted(true);
      //   clearCart();
      setIsSubmitting(false);
    } else {
      setErrors({ order: "Failed to place order" });
    }
  }

  async function submitOrder() {
    try {
      const orderPayload = {
        customer: {
          name: form.name,
          address: form.address,
          phone: form.phone,
          email: form.email,
        },
        payment: {
          method: form.payment,
        },
        items: items.map((item) => ({
          _id: item._id,
          name: item.name,
          quantity: item.quantity,
          unitPrice: item.price,
        })),
        total: totalPrice,
        timestamp: new Date().toISOString(),
      };
      // Send the POST request
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderPayload),
      });
      // Get the order ID
      if (res.ok) {
        const data = await res.json();
        return data.orderId || null;
      }
      return null;
    } catch (e) {
      console.error("Order submission failed:", e);
      return null;
    }
  }

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="mb-4 text-3xl font-bold text-green-700">Thank You!</h1>
        <p className="mb-4 text-slate-700">
          {orderId ? (
            <>
              Order placed successfully. Your order ID is{" "}
              <strong>{orderId}</strong>. <br /> You will receive an email
              shortly. Thank you.
            </>
          ) : (
            <>
              Order placed successfully. You will receive an email shortly.
              Thank you.
            </>
          )}
        </p>
        <Link
          onClick={() => clearCart()}
          href="/products"
          className="inline-flex rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-blue-700"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-900">Checkout</h1>
      <div className="container mx-auto py-8 lg:flex items-start gap-8">
        <div className="w-full lg:w-1/2 bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-8 lg:mb-0">
          <h2 className="text-xl font-bold mb-3 text-slate-900">
            Order Summary
          </h2>
          <div className="mb-2">
            {items.map((item) => (
              <div key={item._id} className="flex items-center mb-2">
                <img
                  src={item.image || FALLBACK_IMAGE}
                  alt={item.name}
                  className="w-10 h-10 object-cover rounded-lg border border-slate-100 mr-3"
                />
                <div className="flex-1">
                  <div className="font-medium text-slate-900">{item.name}</div>
                  <div className="text-slate-600 text-sm">
                    Qty: {item.quantity} &times; ${item.price?.toFixed(2)}
                  </div>
                </div>
                <div className="font-semibold text-slate-800 ml-2">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 border-t pt-3 text-lg font-semibold">
            <span>Total</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
        </div>
        <div className="w-full lg:w-1/2">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-8"
            autoComplete="off"
            noValidate
          >
            <h1 className="text-3xl font-bold mb-7 text-slate-900">
              Customer Information
              <p className="mt-1 text-xs italic text-slate-500">
                We do not require our customers to create an account or register
                with us.
              </p>
            </h1>

            <div className="mb-5">
              <label className="block text-slate-700 font-semibold mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className={`w-full rounded-md border px-3 py-2 ${errors.name ? "border-red-500" : "border-slate-300"} focus:border-blue-500 focus:ring-blue-200 focus:ring-2 outline-none`}
                value={form.name}
                disabled={isSubmitting}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              {errors.name && (
                <p className="text-sm text-red-600 mt-1">{errors.name}</p>
              )}
            </div>
            <div className="mb-5">
              <label className="block text-slate-700 font-semibold mb-1">
                Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className={`w-full rounded-md border px-3 py-2 ${errors.address ? "border-red-500" : "border-slate-300"} focus:border-blue-500 focus:ring-blue-200 focus:ring-2 outline-none`}
                value={form.address}
                disabled={isSubmitting}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                required
              />
              {errors.address && (
                <p className="text-sm text-red-600 mt-1">{errors.address}</p>
              )}
            </div>
            <div className="mb-5">
              <label className="block text-slate-700 font-semibold mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                className={`w-full rounded-md border px-3 py-2 ${errors.phone ? "border-red-500" : "border-slate-300"} focus:border-blue-500 focus:ring-blue-200 focus:ring-2 outline-none`}
                value={form.phone}
                inputMode="tel"
                disabled={isSubmitting}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                required
              />
              {errors.phone && (
                <p className="text-sm text-red-600 mt-1">{errors.phone}</p>
              )}
            </div>
            <div className="mb-5">
              <label className="block text-slate-700 font-semibold mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                className={`w-full rounded-md border px-3 py-2 ${errors.email ? "border-red-500" : "border-slate-300"} focus:border-blue-500 focus:ring-blue-200 focus:ring-2 outline-none`}
                value={form.email}
                disabled={isSubmitting}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
              {errors.email && (
                <p className="text-sm text-red-600 mt-1">{errors.email}</p>
              )}
            </div>

            <div className="mb-5">
              <label className="block text-slate-700 font-semibold mb-1">
                Payment Method <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={form.payment === "cod"}
                    onChange={() => setForm({ ...form, payment: "cod" })}
                    disabled={isSubmitting}
                    required
                  />
                  <span>Cash on Delivery (COD)</span>
                </label>
                <label className="flex items-center gap-2 text-slate-400">
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={form.payment === "card"}
                    onChange={() => setForm({ ...form, payment: "card" })}
                    disabled
                  />
                  <span>Debit/Credit Card (Coming Soon)</span>
                </label>
                <label className="flex items-center gap-2 text-slate-400">
                  <input
                    type="radio"
                    name="payment"
                    value="paypal"
                    checked={form.payment === "paypal"}
                    onChange={() => setForm({ ...form, payment: "paypal" })}
                    disabled
                  />
                  <span>Paypal (Coming Soon)</span>
                </label>
              </div>
              {errors.payment && (
                <p className="text-sm text-red-600 mt-1">{errors.payment}</p>
              )}
              {!form.payment && (
                <p className="text-sm text-red-600 mt-1">
                  Please select a payment method to continue.
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || items.length === 0}
              className="mt-1 w-full rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white transition-colors hover:bg-blue-700 disabled:bg-slate-300"
            >
              {isSubmitting ? "Placing Order..." : "Place Order"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
