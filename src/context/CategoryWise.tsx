"use client";

import React, { createContext, useCallback, useContext, ReactNode } from "react";

export interface ProductRefetchContextType {
    refetchEarbuds: () => Promise<void>;
    refetchWatches: () => Promise<void>;
}

const ProductRefetchContext = createContext<ProductRefetchContextType | undefined>(undefined);

export function ProductRefetchProvider({ children }: { children: ReactNode }) {
    // Fetch only ALL products
    

    // Fetch only Earbuds
    const refetchEarbuds = useCallback(async () => {
        await fetch("/api/products?category=earbuds", { cache: "no-store" });

    }, []);

    // Fetch only Smartwatches
    const refetchWatches = useCallback(async () => {
        await fetch("/api/products?category=smartwatches", { cache: "no-store" });

    }, []);

    return (
        <ProductRefetchContext.Provider value={{ refetchEarbuds, refetchWatches }}>
            {children}
        </ProductRefetchContext.Provider>
    );
}

// Hook to consume
export function useProductRefetch() {
    const ctx = useContext(ProductRefetchContext);
    if (ctx === undefined) {
        throw new Error("useProductRefetch must be used within a ProductRefetchProvider");
    }
    return ctx;
}
