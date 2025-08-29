"use client"

import { useMemo, useState } from "react"
import ProductGrid from "@/components/home/ProductGrid"
import ProductGridSkeleton from "@/components/skeletons/ProductGridSkeleton"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAllProductContext } from "@/context/AllProducts"
import { Headphones, Package, Package2, Power, PowerOff, RefreshCcw, Watch } from "lucide-react"
import Link from "next/link"
import { useProductContext } from "@/context/ProductContext"
import { Product } from "@/components/home/config"
import { useProductAdminContext } from "@/context/ProductContextAdmin"
import { useAllProductAdminContext } from "@/context/AllProductsAdmin"


type Category = "all" | "smartwatches" | "earbuds"

export default function Catalogue() {
    const { allProducts, loading, refetchAll, activeProducts, inactiveProducts } = useAllProductAdminContext()
    const { productEarbuds, productWatches, earbudsloading, watchesloading, refetchEarbuds, refetchWatches, activeEarbudsProducts, activeSmartWatchesProducts, inActiveEarbudsProducts, inActiveSmartWatchesProducts } = useProductAdminContext()
    const [selectedCategory, setSelectedCategory] = useState<Category>("all");


    const [filterStatus, setFilterStatus] = useState<{
        all: "all" | "active" | "inactive";
        smartwatches: "all" | "active" | "inactive";
        earbuds: "all" | "active" | "inactive";
    }>({
        all: "all",
        smartwatches: "all",
        earbuds: "all",
    });

    const handleFilterChange = (status: "all" | "active" | "inactive") => {
        setFilterStatus((prev) => ({
            ...prev,
            [selectedCategory]: status, // only update the active category
        }));
    };


    // Decide which array to render
    const productsToShow = useMemo(() => {
        const status = filterStatus[selectedCategory as "all" | "smartwatches" | "earbuds"];

        if (selectedCategory === "all") {
            if (status === "active") return activeProducts;
            if (status === "inactive") return inactiveProducts;
            return allProducts ?? [];
        }

        if (selectedCategory === "smartwatches") {
            if (status === "active") return activeSmartWatchesProducts;
            if (status === "inactive") return inActiveSmartWatchesProducts;
            return productWatches ?? [];
        }

        if (selectedCategory === "earbuds") {
            if (status === "active") return activeEarbudsProducts;
            if (status === "inactive") return inActiveEarbudsProducts;
            return productEarbuds ?? [];
        }

        return [];
    }, [
        selectedCategory,
        filterStatus,
        allProducts,
        activeProducts,
        inactiveProducts,
        productWatches,
        productEarbuds,
        activeEarbudsProducts,
        activeSmartWatchesProducts,
        inActiveEarbudsProducts,
        inActiveSmartWatchesProducts,
    ]);


    const categoryLabel = (() => {
        const status = filterStatus[selectedCategory as "all" | "earbuds" | "smartwatches"];

        if (selectedCategory === "all") {
            if (status === "active") return "Active All Products";
            if (status === "inactive") return "Inactive All Products";
            return "All Products";
        }

        if (selectedCategory === "earbuds") {
            if (status === "active") return "Active Earbuds";
            if (status === "inactive") return "Inactive Earbuds";
            return "Earbuds";
        }

        if (selectedCategory === "smartwatches") {
            if (status === "active") return "Active Smartwatches";
            if (status === "inactive") return "Inactive Smartwatches";
            return "Smartwatches";
        }

        return "Products"; // fallback
    })();




    function refetchingAll() {
        setFilterStatus(prev => ({
            ...prev,
            [selectedCategory]: "all", // ✅ reset only current category filter
        }));
        refetchAll(); // don’t forget the ()
    }


    return (
        <div className="flex flex-col-reverse space-y-3">
            {/* Single render target card */}
            <Card className="h-[63vh] overflow-y-auto scrollbar-hide rounded-[5px] mt-20">
                <CardHeader>
                    <div className="flex justify-between">
                        <CardTitle className="shine-effect text-xl">Cataloug</CardTitle>
                        <div className="flex justify-end space-x-2 bg-gray-800 px-5 py-2 rounded-[5px]">

                            <>
                                {/* Use for display active Products in producToshow array */}
                                <div
                                    className="size-6 flex justify-center items-center bg-amber-200 rounded-full"
                                    onClick={() =>
                                        setFilterStatus(prev => ({
                                            ...prev,
                                            [selectedCategory]: "active", // ✅ updates only current category
                                        }))
                                    }
                                >
                                    <Power className="size-3.5 text-amber-600" />
                                </div>

                                {/* Use for display inactive Products in producToshow array */}
                                <div
                                    className="size-6 flex justify-center items-center bg-amber-200 rounded-full"
                                    onClick={() =>
                                        setFilterStatus(prev => ({
                                            ...prev,
                                            [selectedCategory]: "inactive", // ✅ updates only current category
                                        }))
                                    }
                                >
                                    <PowerOff className="size-3.5 text-amber-600" />
                                </div>
                            </>

                            {
                                selectedCategory === 'all'
                                &&
                                <>
                                    <div className="size-6 flex justify-center items-center  bg-gray-200 rounded-full" onClick={refetchingAll}>
                                        <RefreshCcw className="size-3.5 text-gray-800 fill-gray-50" />
                                    </div>
                                </>
                            }
                            {
                                selectedCategory === 'earbuds'
                                &&
                                <>
                                    <div className="size-6 flex justify-center items-center  bg-gray-200 rounded-full" onClick={refetchEarbuds}>
                                        <RefreshCcw className="size-3.5 text-gray-800 fill-gray-50" />
                                    </div>
                                </>
                            }
                            {
                                selectedCategory === 'smartwatches'
                                &&
                                <>
                                    <div className="size-6 flex justify-center items-center  bg-gray-200 rounded-full" onClick={refetchWatches}>
                                        <RefreshCcw className="size-3.5 text-gray-800 fill-gray-50" />
                                    </div>
                                </>
                            }
                        </div>
                    </div>
                    <CardDescription>
                        {loading || earbudsloading || watchesloading ? (
                            <ProductGridSkeleton
                                categoryName={categoryLabel}
                                className="flex flex-col mt-5 lg:justify-center lg:items-center"
                                count={5}
                                innerDivClassName="flex-col mt-3"
                            />
                        ) : productsToShow && productsToShow.length > 0 ? (
                            <ProductGrid
                                products={productsToShow}
                                similarproducts={categoryLabel}
                                marginTrue={true}
                                className="mt-0"
                                adminView={true}
                            />
                        ) : (
                            <div className="flex flex-col space-y-6 min-h-[40vh] p-6 items-center justify-center text-center">
                                <h1 className="text-3xl font-extrabold text-gray-800 mb-2">No items found</h1>
                                <p className="text-gray-600 max-w-sm">
                                    Try switching the category below.
                                </p>
                                <Button className="px-8 py-3 bg-gray-600 hover:bg-blue-700 text-white rounded-[5px] shadow-lg transition-colors duration-300">
                                    <Link href="/">Go to Shop</Link>
                                </Button>
                            </div>
                        )}
                    </CardDescription>
                </CardHeader>
            </Card>
            <Tabs
                value={selectedCategory}
                onValueChange={(v: string) => setSelectedCategory(v as Category)}
                className="w-full"
            >
                <TabsList className="w-full rounded-[5px]! flex justify-between items-center h-auto px-2 space-x-1 py-2 fixed overflow-x-auto scrollbar-hide">
                    <TabsTrigger value="all" className="rounded-[2px]! flex items-center flex-col space-x-1">
                        <Package className="size-5 text-gray-800 stroke-1" />
                        <h1 className="text-[12px]">All products</h1>
                    </TabsTrigger>
                    <TabsTrigger value="smartwatches" className="rounded-[2px]! flex items-center flex-col space-x-1">
                        <Watch className="size-5 text-gray-800 stroke-1" />
                        <h1 className="text-[12px]">Smart watches</h1>
                    </TabsTrigger>
                    <TabsTrigger value="earbuds" className="rounded-[2px]! flex items-center flex-col space-x-1">
                        <Headphones className="size-5 text-gray-800 stroke-1" />
                        <h1 className="text-[12px]">Earbuds</h1>
                    </TabsTrigger>
                </TabsList>
                {/* No inner TabsContent — Card above is the render target */}
            </Tabs>
        </div>
    )
}