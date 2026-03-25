"use client";

import { createContext, useContext, useCallback, useState } from "react";

const CART_KEY = "shop_cart";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    if (typeof window === "undefined") {
      return [];
    }
    try {
      const raw = localStorage.getItem(CART_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }, []);

  const addToCart = useCallback(
    (product, quantity = 1) => {
      setItems((prev) => {
        const existing = prev.find((i) => i.id == product.id);
        let next;
        if (existing) {
          next = prev.map((i) =>
            i.id == product.id ? { ...i, quantity: i.quantity + quantity } : i
          );
        } else {
          next = [...prev, { id: product.id, ...product, quantity }];
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
      const next = prev.filter((i) => i.id != productId);
      if (typeof window !== "undefined") {
        localStorage.setItem(CART_KEY, JSON.stringify(next));
      }
      return next;
    });
  }, []);

  const updateQuantity = useCallback(
    (productId, quantity) => {
      if (quantity < 1) {
        removeFromCart(productId);
        return;
      }
      setItems((prev) => {
        const next = prev.map((i) =>
          i.id == productId ? { ...i, quantity } : i
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

  const totalItems = items.reduce((sum, i) => sum + (i.quantity || 1), 0);
  const totalPrice = items.reduce((sum, i) => sum + (i.price || 0) * (i.quantity || 1), 0);

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
