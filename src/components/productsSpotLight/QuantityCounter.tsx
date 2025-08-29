"use client"
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import React, { useState } from "react";

//New
interface QuantityCounterProps {
    stock: number; // available stock
    initialQuantity?: number;
    onChange?: (quantity: number) => void;
    className?:string;
    inputClassName?:string
}

export default function QuantityCounter({
    stock,
    initialQuantity = 0,
    onChange,
    className,
    inputClassName
}: QuantityCounterProps) {
    const [quantity, setQuantity] = useState<number>(
        Math.min(Math.max(initialQuantity, 0), stock)
    );

    const increase = () => {
        setQuantity((qty) => {
            const newQty = Math.min(qty + 1, stock);
            if (onChange) onChange(newQty);
            return newQty;
        });
    };

    const decrease = () => {
        setQuantity((qty) => {
            const newQty = Math.max(qty - 1, 0);
            if (onChange) onChange(newQty);
            return newQty;
        });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = parseInt(e.target.value);
        if (isNaN(val)) {
            val = 0;
        }
        val = Math.min(Math.max(val, 0), stock);
        setQuantity(val);
        if (onChange) onChange(val);
    };

    return (
        <div className={cn("flex space-x-2 ml-5",className)}>
            <button
                type="button"
                onClick={decrease}
                className="px-4 py-1 bg-gray-200 rounded-[5px] hover:bg-gray-300"
                disabled={quantity <= 0}
            >
                -
            </button>
            <input
                type="text"
                min={1}
                max={stock}
                value={quantity}
                onChange={handleInputChange}
                className={cn("w-35 text-center border rounded text-gray-700 font-bold",inputClassName)}
            />
            <button
                type="button"
                onClick={increase}
                className="px-4 py-1 bg-gray-200 rounded-[5px] hover:bg-gray-300"
                disabled={quantity >= stock}
            >
                <Plus className="size-4 text-gray-900" />
            </button>
        </div>
    );
}