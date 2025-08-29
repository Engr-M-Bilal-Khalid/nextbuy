import { LucideTelescope, Star } from "lucide-react";
import ProductGridSkeleton from "./ProductGridSkeleton";

export default function ProductDetailSkeletonSm() {
    return (
        <div className="flex flex-col mt-7 space-y-2 h-auto mb-15 lg:hidden p-5">
            {/* Tag + rating + reviews */}
            <div className="flex items-center justify-between text-sm text-gray-700">
                <div className="h-6 w-20 rounded bg-gray-300" /> {/* Tag */}
                <div className="flex space-x-2 items-center">
                    <Star className="size-4 text-yellow-300 fill-yellow-300 mt-0.25" />
                    <div className="h-6 w-10 rounded bg-gray-300" /> {/* rating */}
                    <div className="ml-2 h-6 w-20 rounded bg-gray-300" /> {/* reviews count */}
                </div>
            </div>

            {/* Image Slider */}
            <div className="w-full h-60 rounded bg-gray-300" />

            <div className="my-2 border border-gray-300" />

            {/* Title and description */}
            <div className="space-y-1">
                <div className="h-10 w-3/4 rounded bg-gray-300" />
                <div className="h-5 w-full rounded bg-gray-300" />
            </div>

            {/* Pricing */}
            <div className="flex space-x-5">
                <div className="h-8 w-20 rounded bg-gray-300" />
                <div className="h-6 w-20 rounded bg-gray-300" />
            </div>

            {/* Discount badge */}
            <div className="px-2 py-3 bg-gray-500 bg-opacity-40 rounded-[2px] w-16 h-6" />

            {/* Views info */}
            <div className="flex space-x-2 mt-1">
                <div className="rounded-full size-6 bg-gray-300 flex items-center justify-center">
                    <LucideTelescope className="size-4 text-gray-400" />
                </div>
                <div className="h-5 w-40 rounded bg-gray-300 mt-1" />
            </div>

            {/* Color label */}
            <div className="h-6 w-40 rounded bg-gray-300 mt-2" />

            {/* Variant Radio Group placeholder */}
            <div className="h-12 w-full rounded bg-gray-300 mt-1" />

            <div className="my-2 border border-gray-300" />

            {/* Add to cart button */}
            <div className="w-full h-12 rounded bg-gray-300 mt-3" />

            {/* Quantity label and counter */}
            <div className="flex items-center space-x-4 mt-2">
                <div className="h-6 w-20 rounded bg-gray-300" />
                <div className="h-12 w-36 rounded bg-gray-300" />
            </div>

            {/* Promise Section - 4 icons + text */}
            <div className="flex mt-2 py-2 justify-between items-center border border-gray-300 rounded-[10px] space-x-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex flex-col justify-between items-center space-y-2 w-16">
                        <div className="h-8 w-8 rounded bg-gray-300" />
                        <div className="h-3 w-full rounded bg-gray-300" />
                    </div>
                ))}
            </div>
            <ProductGridSkeleton similarproducts="Similar Products" marginTrue={true} className="flex-row" innerDivClassName="flex-row"/>
            
        </div>
    );
}