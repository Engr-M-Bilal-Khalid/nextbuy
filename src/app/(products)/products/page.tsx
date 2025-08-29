"use client"

import ProductGrid from "@/components/home/ProductGrid";
import ProductGridSkeleton from "@/components/skeletons/ProductGridSkeleton";
import { useAllProductContext } from "@/context/AllProducts";

export default function Page() {
    const { allProducts, loading, refetchAll } = useAllProductContext();

    return (
        <>
            {loading ? (
                <>
                    <ProductGridSkeleton categoryName="All Products" innerDivClassName="flex-col" count={20} />
                </>
            ) : allProducts?.length ? (
                
                    <ProductGrid products={allProducts}  slice={true} title="All products"/>
                
            ) : (
                <h1>No products</h1>
            )}
        </>
    );
}
