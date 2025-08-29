"use client";

import { Product, Variant } from "@/components/home/config";
import { VariantRadioGroup } from "@/components/home/VariantRadioGroup";
import CustomerReviewsViews from "@/components/productsSpotLight/CustomerReviewsViews";
import ProductTabView from "@/components/productsSpotLight/ProductTabView";
import QuantityCounter from "@/components/productsSpotLight/QuantityCounter";
import SimilarProductsView from "@/components/productsSpotLight/SimilarProductsView";
import { Spotlight } from "@/components/shared/ImageSlider";
import ProductDetailSkeletonLg from "@/components/skeletons/ProductDetailSkeletonLg";
import ProductDetailSkeletonSm from "@/components/skeletons/ProductDetailSkeletonSm";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/CartContext";
import { useProductContext } from "@/context/ProductContext";
import { Award, Loader, Loader2, LucideTelescope, Package, Star, ThumbsUp, TruckElectric } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function ProductSpotlightPage() {



  const [addToCartLoading, setAddToCartLoading] = useState<Boolean>(false)
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [syncQuantity, setSyncQuantity] = useState(1);


  const { productEarbuds, productWatches } = useProductContext();

  function findProductById(category: string, productId: string): Product | undefined {
    switch (category) {
      case "Earbuds":
        return productEarbuds?.find((p) => p.productId === productId);
      case "Smart watches":
        return productWatches?.find((p) => p.productId === productId);
      default:
        return undefined;
    }
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("productId");
    const productCategory = params.get("productCategory");

    // Wait until the proper array for category is loaded
    if (
      !productId ||
      !productCategory ||
      (productCategory === "Earbuds" && !productEarbuds) ||
      (productCategory === "Watches" && !productWatches)
    ) {
      return; // do not set loading false here, keep loading state until ready
    }

    const foundProduct = findProductById(productCategory, productId) || null;
    setCurrentProduct(foundProduct);

    if (
      foundProduct?.variants &&
      Array.isArray(foundProduct.variants) &&
      foundProduct.variants.length > 0
    ) {
      setSelectedVariant(foundProduct.variants[0]);
    } else {
      setSelectedVariant(null);
    }

    setLoading(false);
  }, [productEarbuds, productWatches]);

  // Guarding variants usage
  if (loading) {
    return (
      <>
        <ProductDetailSkeletonSm />
        <ProductDetailSkeletonLg />
      </>
    );
  }

  if (!currentProduct) {
    return (
      <div className="flex flex-col space-y-6 min-h-[58vh] p-6 items-center justify-center text-center">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Oops! Product Not Found</h1>
        <p className="text-gray-600 max-w-sm">
          We're sorry, but the product you're looking for doesn't seem to exist or is no longer available.
        </p>
        <Button className="px-8 py-3 bg-gray-600 hover:bg-blue-700 text-white rounded-[5px] shadow-lg transition-colors duration-300">
          <Link href="/">Go to Shop</Link>
        </Button>
      </div>
    );
  }

  const variants = currentProduct.variants ?? [];

  if (!selectedVariant) {
    return (
      <>
        <ProductDetailSkeletonSm />
        <ProductDetailSkeletonLg />
      </>
    );
  }

  const handleVariantChange = (variantId: string) => {
    const newVariant = variants.find((v) => v.variantId === variantId);
    if (newVariant) {
      setSelectedVariant(newVariant);
    }
  };


  const { addToCart } = useCart();


  const handleAdd = async (variantId: string, quantity: number) => {
    setAddToCartLoading(true)
    await addToCart(variantId, quantity);
    setAddToCartLoading(false)
  };

  const price = Number(selectedVariant.priceWithoutDiscount);
  const discount = Number(selectedVariant.discount);
  const priceAfterDiscount = price - (price * discount) / 100;

  return (
    <>
      <div className="flex flex-col mt-7  space-y-2 h-auto mb-15 lg:hidden">
        <div className="flex items-center justify-between text-sm text-gray-700">
          <h1 className="uppercase bg-gradient-to-r from-red-500 to-purple-600 bg-clip-text text-transparent prada">
            {currentProduct.tag}
          </h1>
          <div className="flex space-x-1 text-sm">
            <Star className="size-4 text-yellow-300 fill-yellow-300 mt-0.25" />
            <span>{currentProduct.rating}</span>
            <p className="ml-2">{currentProduct.reviews.length} reviews</p>
          </div>
        </div>
        <div className="w-full">
          <Spotlight urls={selectedVariant.images} />
        </div>
        <Separator className="my-2 border-1" />
        <div className="flex flex-col space-y-1">
          <h1 className="prada text-xl tracking-widest font-extrabold text-gray-700 shine-text">{currentProduct.title}</h1>
          <p className="text-[#878d97] text-[12px]">{currentProduct.description}</p>
          <div className="flex space-x-5">
            <h1 className="font-semibold shine-text zara">Rs. {priceAfterDiscount.toFixed(2)}</h1>
            <h1 className="mt-1 text-sm text-[#878d97] ">
              <del>Rs. {price.toFixed(2)}</del>
            </h1>
          </div>
          <div className="px-2 py-3 text-gray-100 font-bold text-sm rounded-[2px] shine-effect bg-gray-500">
            {selectedVariant.discount} % off
          </div>
          <div className="flex space-x-2 mt-1">
            <div className="rounded-full size-6 bg-gray-300 flex items-center justify-center">
              <LucideTelescope className="size-4" />
            </div>
            <p className="text-[#878d97] text-[12px] mt-1"><span className="font-bold">90</span> customers views in <span className="font-bold">last 7 days</span></p>
          </div>
          <div className="flex flex-col space-y-2">
            <h1 className="font-medium text-gray-500">
              Color :{" "}
              <span className="font-bold" style={{ color: selectedVariant.color }}>
                {selectedVariant.name}
              </span>
            </h1>
            <VariantRadioGroup
              variants={variants}
              value={selectedVariant.variantId}
              onChange={handleVariantChange}
              padding={true}
            />
          </div>
          <Separator className="my-2 border-1" />
          <Button
            className="lg:px-8 lg:py-6 p-3 cursor-pointer flex items-center justify-center mt-3 lg:mt-0 shine-effect bg-gray-700 text-gray-200"
            onClick={() => handleAdd(selectedVariant.variantId, 1)}

          >
            <span className="text-sm ">
              {
                addToCartLoading
                  ?
                  <div className="flex items-center space-x-5 flex-row-reverse">
                    <Loader2 className="size-4 animate-spin stroke-1 " />
                    <h1>Adding....</h1>
                  </div>
                  :
                  "Add to cart"
              }

            </span>
          </Button>
          <div className="flex mt-2">
            <h1 className="text-gray-500">Quantity :</h1>
            <QuantityCounter
              stock={10}
              initialQuantity={0}
              onChange={(qty) => console.log("Quantity changed:", qty)}
            />
          </div>
          <h1 className="text-gray-700 text-2xl font-extrabold zara my-2">Our Promise :</h1>
          <div className="flex justify-between items-center ">
            <div className="flex flex-col justify-between items-center">
              <Award className="size-8 stroke-1 text-gray-700 fill-gray-100" />
              <p className="text-sm text-gray-700 text-center mt-2">1 year warranty</p>
            </div>
            <div className="flex flex-col justify-between items-center">
              <TruckElectric className="size-8 stroke-1 text-gray-700 fill-gray-100" />
              <p className="text-sm text-gray-700 text-center">Free shipping</p>
            </div>
            <div className="flex flex-col justify-between items-center">
              <ThumbsUp className="size-8 stroke-1 text-gray-700 fill-gray-100" />
              <p className="text-sm text-gray-700 text-center">1000+ customers</p>
            </div>
            <div className="flex flex-col justify-between items-center">
              <Package className="size-8 stroke-1 text-gray-700 fill-gray-100" />
              <p className="text-sm text-gray-700 text-center">7 days returns</p>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex flex-col mt-7  space-y-2 h-auto mb-15 ">
        <div className="flex space-x-10 h-auto items-center">
          <div className="w-1/2">
            <Spotlight urls={selectedVariant.images} desktopView={true} />
          </div>
          <div className="flex flex-col space-y-5 w-1/2">
            <div className="flex items-center justify-between text-sm text-gray-700">
              <h1 className="uppercase bg-gradient-to-r from-red-500 to-purple-600 bg-clip-text text-transparent prada">
                {currentProduct.tag}
              </h1>
              <div className="flex space-x-1 text-sm">
                <Star className="size-4 text-yellow-300 fill-yellow-300 mt-0.25" />
                <span>{currentProduct.rating}</span>
                <p className="ml-2">{currentProduct.reviews.length} reviews</p>
              </div>
            </div>
            <h1 className="prada text-3xl font-bold text-gray-700 shine-text tracking-wide">{currentProduct.title}</h1>
            <p className="text-[#878d97] ">{currentProduct.description}</p>
            <div className="flex space-x-5 items-end justify-between">
              <div className="flex items-end justify-start space-x-4">
                <h1 className="font-extrabold text-3xl shine-text zara">Rs. {priceAfterDiscount.toFixed(2)}</h1>
                <h1 className="text-xl text-[#878d97] zara">
                  <del>Rs. {price.toFixed(2)}</del>
                </h1>
              </div>
              {discount > 0 && (
                <div className="px-5 py-1 text-white bg-red-500 text-xl rounded-[5px] font-bold">
                  {selectedVariant.discount} % off
                </div>
              )}
            </div>

            <div className="flex space-x-2 items-center">
              <div className="rounded-full size-10 bg-gray-300 flex items-center justify-center ">
                <LucideTelescope className="size-7 stroke-1" />
              </div>
              <p className="text-gray-700 text-xl ">
                <span className="font-bold">90</span> customers views in <span className="font-bold">last 7 days</span>
              </p>
            </div>
            <div className="flex flex-col space-y-7">
              <h1 className="zara text-gray-700">
                Color :{" "}
                <span
                  className="font-bold"
                  style={{
                    color: selectedVariant.color,
                  }}
                >
                  {selectedVariant.name}
                </span>
              </h1>
              <VariantRadioGroup
                variants={variants}
                value={selectedVariant.variantId}
                onChange={handleVariantChange}
                padding={true}
              />
            </div>
            <div className="flex">
              <Button
                className="w-1/2 p-7 cursor-pointer flex items-center justify-center bg-gray-700 text-white rounded-[5px]"
                onClick={() => handleAdd(selectedVariant.variantId, syncQuantity)}

              >
                <span className="text-xl ">
                  {
                    addToCartLoading
                      ?
                      "Adding...."
                      :
                      "Add to cart"
                  }

                </span>
              </Button>

              <div className="flex flex-col p-0 m-0 ">
                <h1 className="text-gray-500 pb-1 mt-[-6px] ml-4">Quantity :</h1>
                <QuantityCounter
                  stock={10}
                  initialQuantity={1}
                  onChange={(qty) => setSyncQuantity(qty)} // 👈 sync counter to state
                />
              </div>
            </div>

            <h1 className="text-gray-700 text-2xl font-extrabold zara">Our Promise :</h1>
            <div className="flex justify-between items-center ">
              <div className="flex flex-col justify-between items-center">
                <Award className="size-8 stroke-1 text-gray-700 fill-gray-100" />
                <p className="text-sm text-gray-700 text-center mt-2">1 year warranty</p>
              </div>
              <div className="flex flex-col justify-between items-center">
                <TruckElectric className="size-8 stroke-1 text-gray-700 fill-gray-100" />
                <p className="text-sm text-gray-700 text-center">Free shipping</p>
              </div>
              <div className="flex flex-col justify-between items-center">
                <ThumbsUp className="size-8 stroke-1 text-gray-700 fill-gray-100" />
                <p className="text-sm text-gray-700 text-center">1000+ customers</p>
              </div>
              <div className="flex flex-col justify-between items-center">
                <Package className="size-8 stroke-1 text-gray-700 fill-gray-100" />
                <p className="text-sm text-gray-700 text-center">7 days returns</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ProductTabView currentProduct={currentProduct} key={currentProduct.productId} />
      <CustomerReviewsViews currentProduct={currentProduct} />
      <SimilarProductsView categoryId={currentProduct.categoryId} categoryName={currentProduct.categoryName} />
    </>
  );
}
