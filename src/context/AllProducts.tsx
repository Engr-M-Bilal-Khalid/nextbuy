"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback, useMemo } from "react";
import { Product } from "@/components/home/config";

interface AllProductContextType {
  allProducts: Product[] | null;
  loading: boolean;
  refetchAll: () => Promise<void>;
}

const AllProductContext = createContext<AllProductContextType | undefined>(undefined);

export function AllProductProvider({ children }: { children: ReactNode }) {
  const [allProducts, setAllProducts] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Single fetch function that both initial effect and manual refresh can call
  const fetchAllProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/products/all-products`, { cache: "no-store" });
      if (!res.ok) {
        console.error("Failed to fetch all products:", res.status, res.statusText);
        setAllProducts(null);
        return;
      }
      const json = await res.json();
      if (json?.allTransformedProducts) {
        setAllProducts(json.allTransformedProducts as Product[]);
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

  // Stable context value (prevents unnecessary rerenders)
  const value = useMemo<AllProductContextType>(() => {
    return {
      allProducts,
      loading,
      refetchAll: fetchAllProducts,
    };
  }, [allProducts, loading, fetchAllProducts]);

  return <AllProductContext.Provider value={value}>{children}</AllProductContext.Provider>;
}

// Custom hook to use context data
export function useAllProductContext() {
  const context = useContext(AllProductContext);
  if (context === undefined) {
    throw new Error("useAllProductContext must be used within an AllProductProvider");
  }
  return context;
}
