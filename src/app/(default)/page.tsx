"use client";

import BrandStrip from "@/components/home/BrandStrip";
import { CarouselDemo } from "@/components/home/Carousel";
import ProductGrid from "@/components/home/ProductGrid";
import ProductGridSkeleton from "@/components/skeletons/ProductGridSkeleton";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useProductContext } from "@/context/ProductContext";
import Link from "next/link";
import "../globals.css";
import "../style.css";

export default function Home() {
  const { productEarbuds, productWatches, earbudsloading, watchesloading } = useProductContext();
  return (
    <>
      <div className="rounded-[10px]">
        <CarouselDemo />
        <BrandStrip />
      </div>
      <>
        <Separator />
        {earbudsloading || watchesloading ? (
          <>
            <ProductGridSkeleton categoryName="Earbuds" innerDivClassName="flex-row" />
            <ProductGridSkeleton categoryName="Smart Watches" innerDivClassName="flex-row" />
          </>
        ) : productEarbuds && productWatches ? (
          <>
            <ProductGrid products={productEarbuds} categoryUrl="/categories/earbuds" slice={true} />
            <ProductGrid products={productWatches} categoryUrl="/categories/smartWatches" slice={true} />
          </>
        ) : (
          <div className="flex flex-col space-y-6 min-h-[58vh] p-6 items-center justify-center text-center">
            <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Oops! Product Not Found</h1>
            <p className="text-gray-600 max-w-sm">
              We're sorry, but the product you're looking for doesn't seem to exist or is no longer available.
            </p>
            <Button className="px-8 py-3 bg-gray-600 hover:bg-blue-700 text-white rounded-[5px] shadow-lg transition-colors duration-300">
              <Link href="/">Go to Shop</Link>
            </Button>
          </div>
        )}
      </>
    </>
  );
}



