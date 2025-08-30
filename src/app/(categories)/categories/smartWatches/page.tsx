"use client"
import ProductGrid from "@/components/home/ProductGrid";
import ProductGridSkeleton from "@/components/skeletons/ProductGridSkeleton";
import { Button } from "@/components/ui/button";
import { useProductContext } from "@/context/ProductContext";
import Link from "next/link";

export default function Page() {
    const {  productWatches, watchesloading } = useProductContext();
    return (
        <>
            {watchesloading ? (
                <>
                    <ProductGridSkeleton categoryName="Smart watches" className="mt-5 lg:justify-center lg:items-center" count={10}/>
                </>
            ) : productWatches ? (
                <>
                    <ProductGrid products={productWatches} />
                </>
            ) : (
                <div className="flex flex-col space-y-6 min-h-[58vh] p-6 items-center justify-center text-center">
                    <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Oops! Category Not Found</h1>
                    <p className="text-gray-600 max-w-sm">
                        We're sorry, but the category you're looking for doesn't seem to exist or is no longer available.
                    </p>
                    <Button className="px-8 py-3 bg-gray-600 hover:bg-blue-700 text-white rounded-[5px] shadow-lg transition-colors duration-300">
                        <Link href="/">Go to Shop</Link>
                    </Button>
                </div>
            )}
        </>
    )
}