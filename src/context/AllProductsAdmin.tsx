"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback, useMemo } from "react";
import { Product } from "@/components/home/config";

interface AllProductContextType {
  allProducts: Product[] | null;
  activeProducts: Product[];
  inactiveProducts: Product[];
  loading: boolean;
  refetchAll: () => Promise<void>;
}

const AllProductContext = createContext<AllProductContextType | undefined>(undefined);

export function AllProductAdminProvider({ children }: { children: ReactNode }) {
  const [allProducts, setAllProducts] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Single fetch function that both initial effect and manual refresh can call
  const fetchAllProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/products/all-products/admin`, { cache: "no-store" });
      if (!res.ok) {
        console.error("Failed to fetch all products:", res.status, res.statusText);
        setAllProducts(null);
        return;
      }
      const json = await res.json();
      if (json?.allTransformedProducts) {
        setAllProducts(json.allTransformedProducts as Product[]);
        console.log(json.allTransformedProducts)
      } else {
        setAllProducts(null);
      }
    } catch (error) {
      console.error("Failed to fetch all products:", error);
      setAllProducts(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  // Derived values (filter inside context to avoid duplicating logic in components)
  const activeProducts = useMemo(
    () => (allProducts ?? []).filter((p) => p.isActive === true),
    [allProducts]
  );
  const inactiveProducts = useMemo(
    () => (allProducts ?? []).filter((p) => p.isActive === false),
    [allProducts]
  )

  // Stable context value (prevents unnecessary rerenders)
  const value = useMemo<AllProductContextType>(() => {
    return {
      allProducts,
      activeProducts,
      inactiveProducts,
      loading,
      refetchAll: fetchAllProducts,
    };
  }, [allProducts, loading, fetchAllProducts]);

  return <AllProductContext.Provider value={value}>{children}</AllProductContext.Provider>;
}

// Custom hook to use context data
export function useAllProductAdminContext() {
  const context = useContext(AllProductContext);
  if (context === undefined) {
    throw new Error("useAllProductContext must be used within an AllProductProvider");
  }
  return context;
}
