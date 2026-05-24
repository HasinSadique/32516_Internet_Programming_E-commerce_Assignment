"use client";

import { useCallback, useEffect, useState } from "react";

export function useCustomerSession() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadSession = useCallback(async () => {
    try {
      const response = await fetch("/api/customer/session", {
        cache: "no-store",
      });

      if (response.ok) {
        const payload = await response.json();
        setUser(payload.user || null);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to load customer session:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  return { user, loading, setUser, reloadSession: loadSession };
}
