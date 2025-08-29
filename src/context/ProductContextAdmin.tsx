"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback, useMemo } from "react";
import { Product } from "@/components/home/config";

interface ProductContextType {
    productEarbuds: Product[] | null;
    productWatches: Product[] | null;
    activeEarbudsProducts: Product[];
    inActiveEarbudsProducts: Product[];
    activeSmartWatchesProducts: Product[],
    inActiveSmartWatchesProducts: Product[],
    earbudsloading: boolean;
    watchesloading: boolean;
    refetchEarbuds: () => Promise<void>;
    refetchWatches: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProviderAdmin({ children }: { children: ReactNode }) {
    const [productEarbuds, setProductEarbuds] = useState<Product[] | null>(null);
    const [productWatches, setProductWatches] = useState<Product[] | null>(null);
    const [earbudsloading, setEarbudsLoading] = useState(true);
    const [watchesloading, setWatchesLoading] = useState(true);

    async function fetchEarbuds(signal?: AbortSignal) {
        setEarbudsLoading(true);
        try {
            const res = await fetch(`/api/products/admin`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                cache: "no-store",
                body: JSON.stringify({ category: "Earbuds" }),
                signal,
            });
            if (!res.ok) {
                console.error("Earbuds fetch failed:", res.status, res.statusText);
                setProductEarbuds(null);
                return;
            }
            const json = await res.json();
            setProductEarbuds(json.earbudsTransformedProducts ?? null);
        } catch (err: any) {
            if (err?.name !== "AbortError") {
                console.error("Earbuds fetch error:", err);
                setProductEarbuds(null);
            }
        } finally {
            setEarbudsLoading(false);
        }
    }

    async function fetchWatches(signal?: AbortSignal) {
        setWatchesLoading(true);
        try {
            const res = await fetch(`/api/products/admin`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                cache: "no-store",
                body: JSON.stringify({ category: "Smart watches" }),
                signal,
            });
            if (!res.ok) {
                console.error("Smartwatches fetch failed:", res.status, res.statusText);
                setProductWatches(null);
                return;
            }
            const json = await res.json();
            setProductWatches(json.smartWatchesTransformedProducts ?? null);
        } catch (err: any) {
            if (err?.name !== "AbortError") {
                console.error("Smartwatches fetch error:", err);
                setProductWatches(null);
            }
        } finally {
            setWatchesLoading(false);
        }
    }

    // Stable refetch functions to expose via context
    const refetchEarbuds = useCallback(async () => {
        await fetchEarbuds(); // no signal for manual refetch
    }, []);

    const refetchWatches = useCallback(async () => {
        await fetchWatches(); // no signal for manual refetch
    }, []);

    // Initial load both in parallel with abort support
    useEffect(() => {
        const acEarbuds = new AbortController();
        const acWatches = new AbortController();

        fetchEarbuds(acEarbuds.signal);
        fetchWatches(acWatches.signal);

        return () => {
            acEarbuds.abort();
            acWatches.abort();
        };
    }, []); // do NOT include refetchEarbuds here; it's for manual use

    // Derived values (filter inside context to avoid duplicating logic in components)
    const activeEarbudsProducts = useMemo(
        () => (productEarbuds ?? []).filter((p) => p.isActive === true),
        [productEarbuds]
    );
    const inActiveEarbudsProducts = useMemo(
        () => (productEarbuds ?? []).filter((p) => p.isActive === false),
        [productEarbuds]
    )

    // Derived values (filter inside context to avoid duplicating logic in components)
    const activeSmartWatchesProducts = useMemo(
        () => (productWatches ?? []).filter((p) => p.isActive === true),
        [productWatches]
    );
    const inActiveSmartWatchesProducts = useMemo(
        () => (productWatches ?? []).filter((p) => p.isActive === false),
        [productWatches]
    )

    return (
        <ProductContext.Provider
            value={{ productEarbuds, productWatches, earbudsloading, watchesloading, refetchEarbuds, refetchWatches , activeEarbudsProducts,inActiveEarbudsProducts,activeSmartWatchesProducts,inActiveSmartWatchesProducts}}
        >
            {children}
        </ProductContext.Provider>
    );
}

export function useProductAdminContext() {
    const context = useContext(ProductContext);
    if (context === undefined) {
        throw new Error("useProductContext must be used within a ProductProvider");
    }
    return context;
}
