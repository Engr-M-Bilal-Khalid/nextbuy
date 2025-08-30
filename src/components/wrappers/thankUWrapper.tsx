"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ThankYouPageWrapper() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get("orderId");

    return (
        <div className="flex flex-col items-center justify-center h-[70vh] px-6">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className={cn("bg-emerald-100 rounded-[10px] p-8 text-center max-w-md w-full", !orderId && "bg-red-200")}
            >
                {orderId ? (
                    <>
                        <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">
                            Thank You!
                        </h1>
                        <p className="text-gray-600 mb-2">
                            Your order has been placed successfully.
                        </p>
                        <p className="text-sm text-gray-500 mb-6">
                            Your Order ID: <span className="font-mono">{orderId}</span>
                        </p>
                        <p className="text-sm text-gray-500 mb-6">
                            Email us at: <span className="font-mono">muhammadbilal00376@gmail.com</span> with your any question or suggestion
                        </p>
                    </>
                ) : (
                    <>
                        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">
                            No Order Found
                        </h1>
                        <p className="text-gray-600 mb-6">
                            It looks like you haven’t placed any order.
                        </p>
                    </>
                )}

                <div className="flex flex-col gap-3">
                    <Link href="/orders">
                        <Button className="w-full">View My Orders</Button>
                    </Link>
                    <Link href="/">
                        <Button variant="outline" className="w-full">
                            Continue Shopping
                        </Button>
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
