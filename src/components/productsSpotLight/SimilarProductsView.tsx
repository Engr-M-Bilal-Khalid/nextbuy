"use client";
import { Product } from "@/components/home/config";
import ProductGrid from "@/components/home/ProductGrid";
import { Separator } from "@/components/ui/separator";
import { useProductContext } from "@/context/ProductContext";
import { useMemo } from "react";

interface SimilarProductsViewProps {
    categoryId: string;
    categoryName: string;
}

export default function SimilarProductsView({ categoryId, categoryName }: SimilarProductsViewProps) {
    const { productEarbuds, productWatches } = useProductContext();

    // Normalize category name once
    const normalized = categoryName.trim().toLowerCase();

    // Pick products based on category
    const similarProducts: Product[] = useMemo(() => {
        if (normalized === "earbuds") return productEarbuds ?? [];
        if (normalized === "smart watches" || normalized === "smartwatches") return productWatches ?? [];
        // default fallback
        return productEarbuds ?? [];
    }, [normalized, productEarbuds, productWatches]);

    // Dynamic category URL
    const categoryUrl = normalized === "earbuds" ? "/category/earbuds" : "/category/smartWatches";

    return (
        <div className="flex flex-col">
            <Separator className="my-2 border-1 mt-0 lg:mt-10" />
            <ProductGrid
                products={similarProducts}
                categoryUrl={categoryUrl}
                similarproducts="Simliar Products"
                marginTrue={true}
            />
            {/* Move to cart functionality */}
            {/* <ProductGrid
        products={similarProducts}
        categoryUrl={categoryUrl}
        saveForLater={true}
        similarproducts="Simliar Products"
        marginTrue={true}
      /> */}
        </div>
    );
}
