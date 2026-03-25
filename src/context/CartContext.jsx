"use client";

import { createContext, useContext, useCallback, useState } from "react";

const CART_KEY = "shop_cart";

const CartContext = createContext(null);

function normalizeIdentifier(value) {
  if (value == null) return "";
  if (typeof value === "object" && value.$oid) {
    return String(value.$oid);
  }
  return String(value);
}

function getCartItemId(item) {
  return normalizeIdentifier(item?._id ?? item?.id);
}

function normalizeQuantity(value, fallback = 1) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 1) return fallback;
  return Math.floor(parsed);
}

function normalizeCartItem(item) {
  if (!item || typeof item !== "object") return null;

  const productId = getCartItemId(item);
  if (!productId) return null;

  const normalizedItem = { ...item };
  delete normalizedItem.id;

  return {
    ...normalizedItem,
    _id: productId,
    quantity: normalizeQuantity(item.quantity, 1),
  };
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    if (typeof window === "undefined") {
      return [];
    }
    try {
      const raw = localStorage.getItem(CART_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      const normalized = Array.isArray(parsed)
        ? parsed.map(normalizeCartItem).filter(Boolean)
        : [];
      localStorage.setItem(CART_KEY, JSON.stringify(normalized));
      return normalized;
    } catch {
      return [];
    }
  });

  const addToCart = useCallback(
    (product, quantity = 1) => {
      setItems((prev) => {
        const productId = getCartItemId(product);
        const qtyToAdd = normalizeQuantity(quantity, 1);
        if (!productId) return prev;

        const existing = prev.find((i) => getCartItemId(i) === productId);
        let next;
        if (existing) {
          next = prev.map((i) =>
            getCartItemId(i) === productId
              ? { ...i, quantity: normalizeQuantity(i.quantity, 1) + qtyToAdd }
              : i
          );
        } else {
          const nextItem = normalizeCartItem({
            ...product,
            _id: productId,
            quantity: qtyToAdd,
          });
          if (!nextItem) return prev;
          next = [...prev, nextItem];
        }
        if (typeof window !== "undefined") {
          localStorage.setItem(CART_KEY, JSON.stringify(next));
        }
        return next;
      });
    },
    []
  );

  const removeFromCart = useCallback((productId) => {
    setItems((prev) => {
      const normalizedProductId = normalizeIdentifier(productId);
      const next = prev.filter((i) => getCartItemId(i) !== normalizedProductId);
      if (typeof window !== "undefined") {
        localStorage.setItem(CART_KEY, JSON.stringify(next));
      }
      return next;
    });
  }, []);

  const updateQuantity = useCallback(
    (productId, quantity) => {
      const normalizedProductId = normalizeIdentifier(productId);
      const normalizedQuantity = normalizeQuantity(quantity, 0);

      if (normalizedQuantity < 1) {
        removeFromCart(normalizedProductId);
        return;
      }

      setItems((prev) => {
        const next = prev.map((i) =>
          getCartItemId(i) === normalizedProductId
            ? { ...i, _id: getCartItemId(i), quantity: normalizedQuantity }
            : i
        );
        if (typeof window !== "undefined") {
          localStorage.setItem(CART_KEY, JSON.stringify(next));
        }
        return next;
      });
    },
    [removeFromCart]
  );

  const clearCart = useCallback(() => {
    setItems([]);
    if (typeof window !== "undefined") localStorage.removeItem(CART_KEY);
  }, []);

  const totalItems = items.reduce(
    (sum, item) => sum + normalizeQuantity(item.quantity, 1),
    0
  );
  const totalPrice = items.reduce(
    (sum, item) =>
      sum + (Number(item.price) || 0) * normalizeQuantity(item.quantity, 1),
    0
  );

  const value = {
    items,
    totalItems,
    totalPrice,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
