import Link from "next/link";
import { Button } from "../ui/button";
import ProductDisplay from "./ProductDisplay";
import { Product } from "./config";
import { ArrowLeft, ArrowRight, ChevronsRight } from "lucide-react";
import '../../app/style.css'
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";


export default function ProductGrid({
    products,
    categoryUrl,
    similarproducts,
    saveForLater,
    marginTrue,
    slice,
    className,
    adminView,
    title
}: {
    products: Product[] | null;
    categoryUrl?: string;
    similarproducts?: string;
    saveForLater?: Boolean;
    marginTrue?: Boolean;
    slice?: Boolean;
    className?: string;
    adminView?: Boolean;
    title?:string
}) {

    function getCategorySlugFromUrl(url: string) {
        const u = url.replace(/\/$/, "");
        return u.slice(u.lastIndexOf("/") + 1);
    }




    if (!products || products.length === 0) {
        let slug = getCategorySlugFromUrl(categoryUrl as string);
        let slugFirstLetter = slug.slice(0, 1);
        slugFirstLetter = slugFirstLetter.toUpperCase();
        let slugRemaining = slug.slice(1, slug.length)
        return (
            <div className="flex flex-col space-y-6 min-h-[20vh] p-6 items-center justify-center text-center border-1 border-gray-800 rounded-[5px] bg-gray-50">
                <h1 className={cn("text-xl lg:text-4xl font-extrabold text-left gucci text-gray-700 shine-text", !categoryUrl && 'mt-10', className)}>
                    {
                        similarproducts ?
                            similarproducts.replace(/\b\w/g, char => char.toUpperCase())
                            :
                            slugFirstLetter + slugRemaining
                    }
                </h1>
                <h1 className="text-3xl font-extrabold text-gray-800 mb-2 shine-text">No items found</h1>
                <p className="text-gray-600 max-w-sm">
                    Try switching the category below.
                </p>

            </div>
        )
    }


    const [visibleCount, setVisibleCount] = useState(8);

    const loadMoreProductsForCategoryPage = () => {
        setVisibleCount((count) => Math.min(count + 4, products.length));
    };

    const visibleProductsForCategoryPage = products.slice(0, visibleCount);
    return (
        <>
            <div className={cn("flex lg:justify-between lg:items-end lg:flex-row justify-center items-center flex-col", similarproducts && marginTrue && 'mt-5 lg:mt-5', !categoryUrl && 'lg:justify-center lg:items-center')}>
                <h1 className={cn("text-xl lg:text-4xl font-extrabold text-left gucci text-gray-700 shine-text", !categoryUrl && 'mt-10', className)}>
                    {
                        similarproducts ?
                            similarproducts.replace(/\b\w/g, char => char.toUpperCase())
                            :
                            !title
                            ?
                            products[0].categoryName
                            :
                            title
                    }
                    
                </h1>
                {
                    categoryUrl
                    &&
                    <Button variant="link" className=" text-sm text-pink-400 font-normal hidden lg:block">
                        <Link href={categoryUrl}>View all</Link>
                    </Button>
                }
            </div>
            <div className={cn("flex flex-col items-center mt-0 lg:mt-0", similarproducts && marginTrue && 'mt-5 lg:mt-5')}>
                <div
                    className={cn("w-full flex xl:grid flex-row xl:grid-cols-4 lg:grid-cols-3 grid-cols-4  xl:overflow-visible gap-4 xl:gap-6 px-0  mt-0 lg:mt-5 ", categoryUrl ? 'overflow-x-auto snap-x xl:snap-none scrollbar-hide' : 'flex-col',title && ' items-center justify-between',adminView && 'lg:w-full  lg:grid-cols-3 xl:grid-cols-3')}
                >
                    {
                        !slice
                            ?
                            visibleProductsForCategoryPage.map((product, index) => (
                                saveForLater
                                    ?
                                    <ProductDisplay
                                        key={index}
                                        product={product}
                                        className="flex-shrink-0 w-[80%] lg:w-full snap-start xl:snap-none"
                                        saveForLater={true}
                                    />
                                    :
                                    <ProductDisplay
                                        key={index}
                                        product={product}
                                        className={cn("flex-shrink-0 w-[80%] lg:w-full  snap-start xl:snap-none", !categoryUrl && 'w-full')}
                                        adminView={adminView}
                                    />
                            ))
                            :
                            products.slice(0, 4).map((product, index) => (
                                saveForLater
                                    ?
                                    <ProductDisplay
                                        key={index}
                                        product={product}
                                        className="flex-shrink-0 w-[80%] lg:w-full snap-start xl:snap-none"
                                        saveForLater={true}
                                    />
                                    :
                                    <ProductDisplay
                                        key={index}
                                        product={product}
                                        className="flex-shrink-0 w-[80%] lg:w-full snap-start xl:snap-none"
                                    />
                            ))
                    }

                    {
                        categoryUrl
                            ?
                            <div className="lg:hidden bg-gray-700 text-gray-200 text-center px-5 flex flex-col justify-center items-center rounded-[5px] prada text-xl">
                                <div className="flex space-x-0">
                                    <ChevronsRight className="size-5 shine-effect" />
                                    <ChevronsRight className="size-5 shine-effect" />
                                    <ChevronsRight className="size-5 shine-effect" />
                                    <ChevronsRight className="size-5 shine-effect" />
                                </div>
                                <Button variant="link" className="ml-2 text-sm text-white font-normal underline">
                                    <Link href={categoryUrl ? categoryUrl : '#'}>See all {products[0].categoryName}</Link>
                                </Button>
                            </div>
                            :
                            null
                    }


                </div>
                {
                    categoryUrl
                        ?
                        null
                        :
                        <div className="flex flex-col space-y-3 mt-5 w-full lg:flex-row lg:space-x-10 lg:justify-center lg:items-center">
                            <button
                                onClick={loadMoreProductsForCategoryPage}
                                disabled={visibleCount >= products.length}
                                className={cn(`w-full lg:w-[25%] p-2 lg:py-3 lg:h-12 rounded-[5px] bg-gray-700  text-gray-200 disabled:cursor-not-allowed transition cursor-pointer `, visibleCount >= products.length && 'text-[12px]',adminView && 'lg:w-auto lg:p-4')}
                            >
                                {visibleCount >= products.length ? `No More Products in ${similarproducts}` : "Load More Products"}
                            </button>
                            {
                                !adminView
                                &&
                                <button
                                    className={cn(`w-full lg:w-[25%] p-2 lg:py-3 lg:h-12 rounded-[5px] bg-gray-700  text-gray-200 disabled:cursor-not-allowed transition cursor-pointer lg:mb-3`)}
                                >
                                    <Link href='/'>Go to Home</Link>
                                </button>
                            }
                        </div>
                }
            </div>
        </>
    );
}