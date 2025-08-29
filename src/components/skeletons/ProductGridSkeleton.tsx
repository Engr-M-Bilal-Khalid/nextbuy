import { cn } from "@/lib/utils";

export default function ProductGridSkeleton({
    count = 4,
    similarproducts,
    categoryName,
    marginTrue,
    className,
    innerDivClassName
}: {
    count?: number; // number of skeleton cards
    similarproducts?: string;
    categoryName?: string;
    marginTrue?: boolean;
    className?:string;
    innerDivClassName?:string
}) {
    return (
        <>
            <div
                className={cn(
                    "w-[100%] flex lg:justify-between lg:items-start lg:flex-row justify-center items-center flex-col",
                    similarproducts && marginTrue && "mt-5 lg:mt-5",className
                )}
            >
                <h1 className="text-xl lg:text-4xl font-extrabold text-left gucci text-gray-700 shine-text">
                    {
                        similarproducts ?
                            similarproducts.replace(/\b\w/g, char => char.toUpperCase())
                            :
                            categoryName
                    }
                </h1>
                {
                    !className
                    &&
                    <div className="ml-2 h-6 w-24 rounded bg-pink-400 opacity-50 hidden lg:block animate-pulse" />
                }
            </div>

            <div className={cn("w-full flex flex-col items-center mt-0 lg:mt-0", similarproducts && marginTrue && "mt-5 lg:mt-5")}>
                <div
                    className={cn("w-full flex xl:grid flex-col xl:grid-cols-4 lg:grid-cols-3 grid-cols-4 overflow-x-auto xl:overflow-visible gap-4 xl:gap-10 px-0 md:px-0 mt-0 lg:mt-5 snap-x snap-mandatory xl:snap-none scrollbar-hide",innerDivClassName)}
                >
                    {[...Array(count)].map((_, i) => (
                        <div
                            key={i}
                            className="flex-shrink-0 w-full snap-start xl:snap-none bg-white rounded-md border border-gray-200 p-4 shadow-sm "
                            style={{ minWidth: 200, maxWidth: 450, height: 320 }}
                        >
                            <div className="h-40 w-full rounded bg-gray-300 mb-4 shine-effect-skeleton" />
                            <div className="h-6 w-full rounded bg-gray-300 mb-2 shine-effect-skeleton" />
                            <div className="h-4 w-3/4 rounded bg-gray-300 mb-1 shine-effect-skeleton" />
                            <div className="h-5 w-20 rounded bg-gray-300 mt-4 shine-effect-skeleton" />
                        </div>
                    ))}

                    <div className="lg:hidden bg-gray-700 text-gray-200 text-center px-10 py-3 flex flex-col justify-center items-center rounded-[10px] prada text-xl">
                        <div className="flex space-x-3 items-center animate-pulse fade-in-35">
                            <div className="h-4 w-4 bg-pink-400 rounded-full" />
                            <div className="h-2 w-2 bg-pink-400 rounded-full" />
                            <div className="h-2 w-2 bg-pink-400 rounded-full mx-5" />
                            <div className="h-4 w-4 bg-pink-400 rounded-full" />
                        </div>
                        <div className="ml-2 h-5 w-44 rounded bg-white mt-2 " />
                    </div>
                </div>
            </div>
        </>
    );
}