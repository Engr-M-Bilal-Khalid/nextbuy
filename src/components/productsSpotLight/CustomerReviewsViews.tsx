"use client"
import { Product } from "@/components/home/config";
import { Separator } from "@/components/ui/separator";
import { Star } from "lucide-react";
import CustomerReviews from "./CustomerReviews";

export default function CustomerReviewsViews({ currentProduct }: { currentProduct: Product }) {
    return (
        <>
            <Separator className="my-2 border-1" />
            <div className="flex ">
                <div className="flex flex-col items-center justify-center w-full py-3 space-y-2">
                    <h1 className="prada text-xl font-extrabold  text-gray-700 shine-text">
                        Customer Reviews
                    </h1>
                    <div className="flex flex-col items-center justify-center space-x-1 text-sm space-y-0.75">
                        <div className="flex space-x-1">
                            {Array.from({ length: 5 }).map((_, idx) => (
                                <Star key={idx} className="size-4 text-yellow-800 fill-yellow-300 mt-0.25" />
                            ))}
                        </div>
                        <span className="text-[13px] text-gray-700">4.9 out of 5.0</span>
                        <p className="ml-2 text-gray-700">based on 300 reviews</p>
                    </div>
                    <CustomerReviews reviews={currentProduct.reviews} />
                </div>
            </div>
        </>
    )
}