import ProductGridSkeleton from "./ProductGridSkeleton";

export default function ProductDetailSkeletonLg() {
    return (
        <div className="hidden lg:flex flex-col mt-7 space-y-2 h-auto mb-15 p-5">
            <div className="flex space-x-10 h-auto">
                {/* Image/Spotlight area */}
                <div className="w-1/2">
                    <div className="w-full h-[420px] rounded bg-gray-300" />
                </div>

                {/* Details area */}
                <div className="flex flex-col space-y-5 w-1/2">
                    {/* Tag, rating, reviews */}
                    <div className="flex items-center justify-between text-sm text-gray-700">
                        <div className="h-7 w-32 rounded bg-gray-300" />
                        <div className="flex space-x-2">
                            <div className="size-5 rounded-full bg-yellow-300" />
                            <div className="h-5 w-10 rounded bg-gray-300" />
                            <div className="ml-2 h-5 w-20 rounded bg-gray-300" />
                        </div>
                    </div>

                    {/* Title */}
                    <div className="h-12 w-5/6 rounded bg-gray-300" />

                    {/* Description */}
                    <div className="h-6 w-full rounded bg-gray-300" />

                    {/* Price and discount */}
                    <div className="flex space-x-5 items-end justify-between">
                        <div className="flex items-end justify-start space-x-4">
                            <div className="h-10 w-36 rounded bg-gray-300" />
                            <div className="h-8 w-24 rounded bg-gray-300" />
                        </div>
                        <div className="px-5 py-3 w-24 h-10 rounded bg-red-300 bg-opacity-50" />
                    </div>

                    {/* Views */}
                    <div className="flex space-x-2 items-center">
                        <div className="rounded-full size-10 bg-gray-300 flex items-center justify-center" />
                        <div className="h-6 w-44 rounded bg-gray-300" />
                    </div>

                    {/* Color and variant radio group */}
                    <div className="flex flex-col space-y-7">
                        <div className="h-8 w-36 rounded bg-gray-300" />
                        <div className="h-12 w-full rounded bg-gray-300" />
                    </div>

                    {/* Add to cart and quantity */}
                    <div className="flex space-x-4">
                        <div className="w-1/2 h-14 rounded bg-gray-300" />
                        <div className="flex flex-col p-0 m-0 ">
                            <div className="h-6 w-24 rounded bg-gray-300 ml-4 mb-2" />
                            <div className="h-12 w-36 rounded bg-gray-300" />
                        </div>
                    </div>

                    {/* Promise Section */}
                    <div>
                        <h1 className="h-7 w-44 rounded bg-gray-300 mb-5" />
                        <div className="flex justify-between items-center w-full space-x-4">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="flex flex-col items-center space-y-2 w-16">
                                    <div className="h-8 w-8 rounded bg-gray-300" />
                                    <div className="h-4 w-full rounded bg-gray-300" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <ProductGridSkeleton similarproducts="Similar Products" marginTrue={true} className="flex-row"/>
            <ProductGridSkeleton similarproducts="Similar Products" marginTrue={true} className="flex-row"/>
            <ProductGridSkeleton similarproducts="Similar Products" marginTrue={true} className="flex-row"/>
        </div>
    );
}