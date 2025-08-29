"use client"
import "@/app/style.css";
import { deepStringify } from "@/lib/deepStringify";
import { errorNotifier, successNotifier } from "@/lib/sonnerNotifications";
import { CheckCircle2, Edit3, Loader2, Minus, Plus } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

export default function ReactivateWithCounters({
    product,
    onClose,
    onReactivate,
}: {
    product: any;
    onClose: () => void;
    onReactivate: () => Promise<void> | void;
}) {
    const makeKey = (v: any) => String(v.id ?? v.name);

    const initialMap = useMemo(() => {
        const m: Record<string, number> = {};
        for (const v of product?.variants ?? []) m[makeKey(v)] = Number(v.stock ?? 0);
        return m;
    }, [product?.variants]);

    const [editing, setEditing] = useState(false);              // true when "Change stock counts" is active
    const [counts, setCounts] = useState<Record<string, number>>(initialMap); // live edits
    const savedCountsRef = useRef<Record<string, number> | null>(null);       // committed counts after "Stock OK"
    const [saved, setSaved] = useState(false);                  // true after "Stock OK"
    const [submitting, setSubmitting] = useState(false);        // disable buttons during API calls

    const [togglingStatus, setIsTogglingStatus] = useState<Boolean>(false)

    useEffect(() => {
        setCounts(initialMap);
        setEditing(false);
        savedCountsRef.current = null;
        setSaved(false);
    }, [initialMap]);

    const setCount = (key: string, next: number) => {
        const val = Number.isFinite(next) ? Math.max(0, Math.floor(next)) : 0;
        setCounts((prev) => ({ ...prev, [key]: val }));
    };
    const inc = (key: string) => setCount(key, (counts[key] ?? 0) + 1);
    const dec = (key: string) => setCount(key, (counts[key] ?? 0) - 1);

    const totalRecorded = useMemo(
        () => (product?.variants ?? []).reduce((s: number, v: any) => s + Number(v.stock ?? 0), 0),
        [product?.variants]
    );
    const totalEditing = useMemo(() => Object.values(counts).reduce((s, n) => s + Number(n ?? 0), 0), [counts]);
    const totalSaved = useMemo(() => {
        const obj = savedCountsRef.current;
        if (!obj) return null;
        return Object.values(obj).reduce((s, n) => s + Number(n ?? 0), 0);
    }, [savedCountsRef.current, saved]);

    // Build payload depending on whether saved counts exist
    const buildPayload = () => {
        const useCounts =
            savedCountsRef.current ??
            (product?.variants ?? []).reduce((acc: Record<string, number>, v: any) => {
                const key = makeKey(v);
                acc[key] = Number(v.stock ?? 0);
                return acc;
            }, {});
        return {
            productId: String(product.id ?? product.productId ?? ""),
            variants: (product?.variants ?? []).map((v: any) => ({
                name: makeKey(v),
                stock: Number(useCounts[makeKey(v)] ?? v.stock ?? 0),
            })),
        };
    };

    // Reactivate button click
    const handleReactivate = async () => {
        // guard: must not be in editing mode to proceed
        if (editing) return;

        const payload = buildPayload();
        const hasSavedCounts = !!savedCountsRef.current; // if false -> "Stock is OK" without edits; if true -> edited counts

        try {
            setSubmitting(true);

            if (hasSavedCounts) {
                try {
                    setIsTogglingStatus(true);
                    const res = await fetch("/api/products/reactivate", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(payload),
                    });

                    if (!res.ok) {
                        const err = await res.json().catch(() => ({}));
                        errorNotifier.notify(err.message || "Failed to reactivate");
                        setIsTogglingStatus(false);
                        return;
                    }

                    const data = await res.json();
                    successNotifier.notify(`${data.productTitle} reactivated with updated stock`);
                    setIsTogglingStatus(false);
                } catch (e: any) {
                    errorNotifier.notify("Network error while reactivating");
                    setIsTogglingStatus(false);
                }

                onReactivate();
            } else {
                //Condition 1 call
                const arrayOf = [product.productId, payload]
                setIsTogglingStatus(true)
                try {
                    const res = await fetch("/api/products/deactivate", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ productId: product.productId }),
                    });
                    if (!res.ok) {
                        const err = await res.json().catch(() => ({}));
                        errorNotifier.notify(err);
                        setIsTogglingStatus(false);
                    }
                    const data = await res.json()
                    successNotifier.notify(`${data.returnProductTitle} deactivated`);
                    setIsTogglingStatus(false)
                } catch (e: any) {
                    errorNotifier.notify("Network error");
                    setIsTogglingStatus(false)
                }
                onReactivate();
            }

            // optional external side-effect


            onClose();
            // optional: show success toast
            // successNotifier.notify("Product reactivated");
        } catch (e: any) {
            console.error(e);
            // toast.error(e.message || "Failed to reactivate product");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="flex h-full flex-col">
            <div className="h-[60px] flex items-center justify-between border-b px-6 py-4">
                <h2 className="text-[12px] font-semibold text-amber-600 dark:text-amber-400 shine-effect">
                    Reactivate
                    <span className="ml-1 text-sm font-extrabold text-gray-900 shine-effect underline underline-offset-4">
                        {product.title}
                    </span>
                </h2>
            </div>

            <div className="px-6 py-4 flex-1">
                <div className="text-sm text-gray-700 dark:text-gray-300 flex flex-col gap-4">
                    <div className="rounded border border-amber-300 bg-amber-50 px-4 py-3 text-amber-800 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                        <p className="font-medium">Stock may be inconsistent. You can adjust counts before reactivating.</p>
                    </div>

                    <p>
                        Do you want to reactivate
                        <span className="ml-1 font-bold shine-effect underline underline-offset-4">{product.title}</span>
                        ?
                    </p>

                    <div>
                        <div className="flex items-center justify-between font-semibold mb-2">
                            <span>Variants</span>
                            <span>{editing ? "Set units" : saved ? "Saved units" : "Recorded units"}</span>
                        </div>

                        <div>
                            {(product?.variants ?? []).map((v: any, i: number) => {
                                const key = makeKey(v);
                                const isWhite =
                                    typeof v.color === "string" &&
                                    ["white", "#fff", "#ffffff", "rgb(255,255,255)"].includes((v.color || "").trim().toLowerCase());
                                const safeColor = isWhite ? "#000000" : v.color;

                                const displayed = editing
                                    ? counts[key] ?? Number(v.stock ?? 0)
                                    : savedCountsRef.current
                                        ? savedCountsRef.current[key] ?? Number(v.stock ?? 0)
                                        : Number(v.stock ?? 0);

                                return (
                                    <div key={i} className="flex items-center justify-between py-1">
                                        <h1 className="underline underline-offset-4" style={{ color: safeColor }} title={v.color}>
                                            {v.name}
                                        </h1>

                                        {!editing ? (
                                            <span className="font-bold text-emerald-600 dark:text-emerald-400">{displayed}</span>
                                        ) : (
                                            <div className="flex items-center justify-end gap-2">
                                                <button type="button" onClick={() => setCount(key, displayed - 1)} aria-label="Decrease">
                                                    <Minus className="size-3 stroke-2 text-gray-800" />
                                                </button>
                                                <input
                                                    type="number"
                                                    inputMode="numeric"
                                                    value={displayed}
                                                    onChange={(e) => setCount(key, Number(e.target.value))}
                                                    className="w-10 text-center rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 py-1"
                                                    min={0}
                                                />
                                                <button type="button" onClick={() => inc(key)} aria-label="Increase">
                                                    <Plus className="size-3 stroke-2 text-gray-800" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-3 flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 border-t-1 border-b-1 border-gray-300 py-3">
                            <span>Total recorded: {totalRecorded}</span>
                            {editing ? <span>Editing total: {totalEditing}</span> : saved && totalSaved !== null ? <span>Saved total: {totalSaved}</span> : null}
                        </div>

                        {!editing ? (
                            <div className="flex gap-2 mt-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        // choose to edit counts (API 2 path)
                                        setCounts(initialMap);
                                        setEditing(true);
                                        setSaved(false);
                                        savedCountsRef.current = null;
                                    }}
                                    className="inline-flex items-center gap-2 rounded-[4px] border px-3 py-1.5 text-xs bg-white hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800 border-gray-300 dark:border-gray-700"
                                    disabled={submitting}
                                >
                                    <Edit3 className="size-4" />
                                    Change stock counts
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        // choose "Stock is OK" (API 1 path)
                                        savedCountsRef.current = null; // indicates no edited counts
                                        setSaved(true);
                                        // not editing; Reactivate becomes enabled
                                    }}
                                    className="inline-flex items-center gap-2 rounded-[4px] border px-3 py-1.5 text-xs bg-emerald-600 text-white hover:bg-emerald-700 border-emerald-700"
                                    disabled={submitting}
                                >
                                    <CheckCircle2 className="size-4" />
                                    Stock OK
                                </button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={() => {
                                    // finish editing and save counts, enabling Reactivate (API 2 path)
                                    savedCountsRef.current = { ...counts };
                                    setSaved(true);
                                    setEditing(false);
                                }}
                                className="inline-flex items-center gap-2 rounded-[4px] border px-3 py-1.5 text-xs bg-emerald-600 text-white hover:bg-emerald-700 border-emerald-700 mt-5"
                                disabled={submitting}
                            >
                                <CheckCircle2 className="size-4" />
                                Stock OK
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-2 border-t py-3 px-3">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-[2px] bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                    disabled={submitting}
                >
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={handleReactivate}
                    className="px-4 py-2 rounded-[2px] bg-gray-600 text-white hover:bg-gray-700 disabled:opacity-50"
                    disabled={editing || submitting}
                >
                    {
                        togglingStatus
                            ?
                            <div className="flex space-x-2">
                                <span>Reactivating</span>
                                <Loader2 className="text-white stroke-2 size-4 mt-0.5 animate-spin" />
                            </div>
                            :
                            "Reactivate"
                    }
                </button>
            </div>
        </div>
    );
}