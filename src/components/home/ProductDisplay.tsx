"use client"
import EditProductForm from "@/app/dashboard/components/products/EditProductForm";
import ReactivateWithCounters from "@/app/dashboard/components/products/ReactivateWithCounters";
import "@/app/style.css";
import { useAllProductAdminContext } from "@/context/AllProductsAdmin";
import { errorNotifier, successNotifier } from "@/lib/sonnerNotifications";
import { cn } from "@/lib/utils";
import { HeartHandshakeIcon, Loader2, Power, PowerOff, Star, X } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import Carousel from "../shared/ImageSlider";
import { Button } from "../ui/button";
import { Modal } from "../ui/modal";
import { Product, Variant } from "./config";
import { VariantRadioGroup } from "./VariantRadioGroup";
import { useCart } from "@/context/CartContext";

export default function ProductDisplay({ product, className, saveForLater, adminView }: { product: Product, className?: string, saveForLater?: Boolean, adminView?: Boolean }) {


    const { refetchAll } = useAllProductAdminContext();

    const [deactivatingStatus, setIsDeactivatingStatus] = useState<Boolean>(false)

    const [clicked, setClicked] = useState(false);

    const variants: Variant[] = product.variants;

    // Store the whole selected variant object in state, default to the first variant
    const [selectedVariant, setSelectedVariant] = React.useState<Variant>(variants[0]);

    // Handler receives variantId, find the whole variant object and update state
    const handleVariantChange = (variantId: string) => {
        const newVariant = variants.find(v => v.variantId === variantId);
        if (newVariant) {
            setSelectedVariant(newVariant);
        }
    };

    // Calculate discounted price from selected variant
    const price = Number(selectedVariant.priceWithoutDiscount);
    const discount = Number(selectedVariant.discount);
    const priceAfterDiscount = price - (price * discount) / 100;

    const { addToCart } = useCart();
    const [addToCartLoading, setAddToCartLoading] = useState(false)

    const handleAdd = async (variantId: string, quantity: number) => {
        setAddToCartLoading(true)
        await addToCart(variantId, quantity);
        setAddToCartLoading(false)
    };

    function moveToCart() {
        alert(`Moved to cart: ${selectedVariant.name}`);
    }

    function addToFavourite() {
        alert(`Added to favourite ${selectedVariant.name}`)
    }

    function removeFromFavourite() {
        alert(`Remove from favourites ${selectedVariant.name}`)
    }

    //Admin
    const [open, setOpen] = useState(false);
    const [activeModalOpen, setActiveModalOpen] = useState(false);
    const [inActiveModalOpen, setInActiveModalOpen] = useState(false);

    return (
        <div
            key={product.productId}
            className={cn("shadow rounded-[10px] p-2 grid grid-rows-[1fr_0.4fr] h-[80%] lg:h-auto gap-y-2 border-1 border-gray-400 prada", className, adminView ? 'h-auto rounded-[5px]  w-full' : null)}
        >
            {/* Top Section */}
            <div className="flex flex-col p-2 rounded-[5px] bg-gradient-to-b from-white to-gray-100">
                <div className="flex justify-between">
                    <h1 className="uppercase bg-gradient-to-r from-red-500 to-purple-600 bg-clip-text text-transparent prada">
                        {product.tag}
                    </h1>
                    <ul className="flex space-x-2">
                        <Star className="size-4 fill-yellow-300 text-yellow-300 mt-[1px]" />
                        <p className="text-sm text-gray-500">{product.rating}</p>
                    </ul>
                </div>

                {/* Image carousel showing selected variant images */}
                <div className={cn("flex items-center justify-center w-full h-[220px] xl:h-65", adminView && "h-auto")}>
                    <div className="w-[200px] xl:w-60">
                        <Carousel urls={selectedVariant.images} adminView={adminView} />
                    </div>
                </div>


            </div>

            {/* Bottom Section */}
            <div className={cn("flex flex-col space-y-1 p-2", adminView && "space-y-0.25 p-1")}>
                <div className="flex justify-between">
                    <h1 className={cn("zara font-semibold tracking-wide", adminView && "font-normal tracking-normal lg:text-xl lg:font-semibold lg:tracking-wide")}>
                        <Link
                            href={`/productSpotlight?productId=${product.productId}&productCategory=${product.categoryName}`}
                            onClick={() => setClicked(true)}
                            className={`${clicked ? 'text-sky-600' : 'text-inherit'} transition-colors duration-200 ease-out`}
                        >
                            {product.title.split(' ').slice(0, 2).join(' ')}
                        </Link>
                    </h1>
                    <div className="px-2 py-1  bg-red-500 text-white lg:text-sm text-[10px] rounded-[2px] shine-effect">
                        {discount} % OFF
                    </div>
                </div>
                <div className="flex justify-between items-end">
                    <div className="flex flex-col">
                        <h1 className="prada text-[10px] tracking-widest uppercase text-[#878d97]">
                            Brand :: {product.brand}
                        </h1>
                        <p className="text-[#878d97] text-sm">
                            {product.description.split(' ').slice(0, 3).join(' ')}
                        </p>
                    </div>
                    {
                        !adminView
                            ?
                            <div className={cn("p-1 bg-gray-200 rounded-[5px] border-1", saveForLater ? 'border-yellow-500' : 'border-red-800')} onClick={saveForLater ? removeFromFavourite : addToFavourite}>
                                {
                                    saveForLater
                                        ?
                                        <X className="size-5 stroke-2 text-yellow-500 " />
                                        :
                                        <HeartHandshakeIcon className="size-5 stroke-1 text-red-800 fill-red-500" />
                                }
                            </div>
                            :
                            <div className={cn("p-1  rounded-[2px] border-1 cursor-pointer transition-all duration-300 ease-in-out", !product.isActive ? "border-red-800 bg-sky-200 hover:bg-amber-50  text-amber-400 hover:border-amber-800" : "border-amber-800 bg-sky-200 hover:bg-red-50 text-red-400  hover:border-red-800")} title={product.isActive ? "Deactivate" : "Activate"}>
                                {
                                    !product.isActive
                                        ?
                                        <>
                                            <Power className="size-5 stroke-2" onClick={() => setInActiveModalOpen(true)} />
                                            <Modal
                                                isOpen={inActiveModalOpen}
                                                onClose={() => setInActiveModalOpen(false)}
                                                isFullscreen={false}
                                                showCloseButton={true}
                                                className=" w-[80vw] h-[60vh] max-h-[80vh] lg:w-[40vw] lg:h-auto  overflow-y-auto scrollbar-hide mx-5 rounded-[5px]!  border-1 border-gray-300"
                                            >
                                                <ReactivateWithCounters
                                                    product={product}
                                                    onClose={() => setInActiveModalOpen(false)}
                                                    onReactivate={() => {
                                                        setInActiveModalOpen(false)
                                                    }}
                                                />
                                            </Modal>
                                        </>
                                        :
                                        <>
                                            <PowerOff className="size-5 stroke-2" onClick={() => setActiveModalOpen(true)} />
                                            <Modal
                                                isOpen={activeModalOpen}
                                                onClose={() => setActiveModalOpen(false)}
                                                isFullscreen={false}
                                                showCloseButton={true}
                                                className="w-[80vw] h-[60vh] max-h-[80vh] lg:w-[40vw] lg:h-auto  overflow-y-auto scrollbar-hide mx-5 rounded-[5px]!  border-1 border-gray-300"
                                            >
                                                <div className="flex h-full flex-col">
                                                    {/* Header */}
                                                    <div className="h-[60px] flex items-center justify-between border-b px-6 py-4">
                                                        <h2 className="text-sm lg:text-2xl font-semibold text-red-600 dark:text-gray-100 shine-effect">
                                                            Inactivate <span className="font-extrabold">{product.title}</span>
                                                        </h2>
                                                    </div>

                                                    {/* Body */}
                                                    <div className="px-6 py-4 flex-1 flex items-center">
                                                        <div className="text-sm text-gray-700 dark:text-gray-300 flex flex-col">
                                                            <p>
                                                                Do you really want to inactivate <span className="font-bold shine-effect underline underline-offset-4">{product.title}</span> ?
                                                            </p>
                                                            <p className="mt-3">
                                                                Stock on hand
                                                            </p>
                                                            <div className="flex justify-between font-extrabold my-3">
                                                                <h1>Variants</h1>
                                                                <h1>Units</h1>
                                                            </div>
                                                            {
                                                                product.variants.map((v, i) => (
                                                                    <div className="flex justify-between space-y-0.25" key={i}>
                                                                        <h1
                                                                            className="underline underline-offset-4"
                                                                            style={{ color: v.color?.toLowerCase() === "#ffffff" ? "#000000" : v.color }}
                                                                        >
                                                                            {v.name}
                                                                        </h1>

                                                                        <h1 className="font-bold text-emerald-500 shine-effect">{v.stock}</h1>
                                                                    </div>
                                                                ))
                                                            }
                                                        </div>
                                                    </div>

                                                    {/* Footer */}
                                                    <div className="flex justify-end  gap-2 border-t py-3 px-3">
                                                        <button
                                                            type="button"
                                                            onClick={() => setActiveModalOpen(false)}
                                                            className="px-4 py-2 rounded-[2px]! bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={async () => {
                                                                setIsDeactivatingStatus(true)
                                                                try {
                                                                    const res = await fetch("/api/products/deactivate", {
                                                                        method: "POST",
                                                                        headers: { "Content-Type": "application/json" },
                                                                        body: JSON.stringify({ productId: product.productId }),
                                                                    });
                                                                    if (!res.ok) {
                                                                        const err = await res.json().catch(() => ({}));
                                                                        errorNotifier.notify(err);
                                                                        setIsDeactivatingStatus(false);
                                                                    }
                                                                    const data = await res.json()
                                                                    setActiveModalOpen(false);
                                                                    successNotifier.notify(`${data.returnProductTitle} deactivated`);
                                                                    setIsDeactivatingStatus(false)
                                                                } catch (e: any) {
                                                                    errorNotifier.notify("Network error");
                                                                    setIsDeactivatingStatus(false)
                                                                }
                                                            }}
                                                            className="px-4 py-2 rounded-[2px]! bg-gray-700 text-white hover:bg-amber-800"
                                                        >
                                                            {
                                                                deactivatingStatus
                                                                    ?
                                                                    <div className="flex space-x-2">
                                                                        <span>Deactivating</span>
                                                                        <Loader2 className="text-white stroke-2 size-4 mt-0.5 animate-spin" />
                                                                    </div>
                                                                    :
                                                                    "Confirm"
                                                            }
                                                        </button>

                                                    </div>
                                                </div>
                                            </Modal>
                                        </>
                                }
                            </div>
                    }
                </div>

                <p className={cn("prada text-[10px] tracking-widest uppercase flex justify-between mt-1", `text-[#878d97]`, adminView && "lg:text-sm font-semibold lg:tracking-normal lg:text-gray-700")}>
                    <span>{selectedVariant.name}</span>
                    <span>Stock : {selectedVariant.stock}</span>
                </p>

                {/* Variant selector */}
                <VariantRadioGroup
                    variants={variants}
                    value={selectedVariant.variantId}
                    onChange={handleVariantChange}
                />

                {/* Price & Add to Cart */}
                <div className="flex justify-between">
                    <div className="flex flex-col space-y-1">
                        <h1 className="font-light text-sm text-[#878d97]">
                            <del>Rs. {price.toFixed(2)}</del>
                        </h1>
                        <h1 className="font-semibold">
                            Rs. {priceAfterDiscount.toFixed(2)}
                        </h1>
                    </div>
                    {
                        !adminView
                            ?
                            <Button
                                className="w-1/2 lg:px-2 lg:py-6 p-2 cursor-pointer flex items-center justify-center mt-3 lg:mt-0 bg-gray-700 text-white"
                                onClick={saveForLater ? moveToCart : () => handleAdd(selectedVariant.variantId, 1)}
                            >
                                <span className="">
                                    {saveForLater ? (
                                        `Move to cart`
                                    ) : addToCartLoading ? (
                                        <Loader2 className="size-4 animate-spin stroke-2" />
                                    ) : (
                                        `Add to cart`
                                    )}
                                </span>
                            </Button>

                            :
                            <>
                                <button
                                    onClick={() => setOpen(true)}
                                    className="w-[50%] lg:w-auto lg:px-8 lg:py-3 p-3 cursor-pointer flex items-center justify-center mt-3 lg:mt-0 bg-emerald-400 rounded-[5px]! border-1 border-emerald-400 hover:bg-white text-gray-800 hover:border-gray-900 hover:text-gray-800 transition-all duration-300 ease-in-out"
                                >
                                    <span className="">Edit</span>
                                </button>

                                <Modal
                                    isOpen={open}
                                    onClose={() => setOpen(false)}
                                    isFullscreen={false}
                                    showCloseButton={true}
                                    className="w-[70vw] h-[63vh] lg:h-[75vh]  lg:max-w-[90vh] lg:z-10 max-w-none overflow-y-auto scrollbar-hide mx-5 rounded-[5px]!  border-1 border-gray-400"
                                >
                                    <EditProductForm initialValues={product} onCancel={() => setOpen(false)}
                                        onSave={async (values) => {
                                            alert(product.productId);
                                            const fd = new FormData();
                                            fd.append("productId", product.productId); // ensure product.productId is the UUID string
                                            // Scalars
                                            fd.append("title", values.title);
                                            fd.append("tag", values.tag);
                                            fd.append("categoryName", values.categoryName); // must match server lookup string
                                            fd.append("brand", values.brand);
                                            fd.append("description", values.description);

                                            // Paragraph arrays
                                            values.productDetailDescription.forEach((p, i) => fd.append(`productDetailDescription[${i}]`, p));
                                            values.returnPloicyDetails.forEach((p, i) => fd.append(`returnPloicyDetails[${i}]`, p));
                                            values.warrantyDetails.forEach((p, i) => fd.append(`warrantyDetails[${i}]`, p));

                                            // Specifications
                                            values.specifications.forEach((s, i) => {
                                                fd.append(`specifications[${i}][label]`, s.label);
                                                fd.append(`specifications[${i}][value]`, s.value);
                                            });

                                            // Variants: send scalars, new Files, and edit helpers (_existingUrls/_removeUrls)
                                            values.variants.forEach((v: any, vi: number) => {
                                                fd.append(`variants[${vi}][name]`, v.name);
                                                fd.append(`variants[${vi}][color]`, v.color);
                                                fd.append(`variants[${vi}][stock]`, String(v.stock));
                                                fd.append(`variants[${vi}][priceWithoutDiscount]`, String(v.priceWithoutDiscount ?? "")); // server casts numeric
                                                if (v.discount != null && v.discount !== "") {
                                                    fd.append(`variants[${vi}][discount]`, String(v.discount));
                                                }

                                                // New files (client-side) — same as create
                                                (v.images || []).forEach((file: File, fi: number) => {
                                                    if (file instanceof File) {
                                                        fd.append(`variants[${vi}][images][${fi}]`, file, file.name);
                                                    }
                                                });

                                                // Existing URLs to keep (edit helper for server to merge)
                                                if (Array.isArray(v._existingUrls)) {
                                                    v._existingUrls.forEach((url: string, ei: number) => {
                                                        fd.append(`variants[${vi}][_existingUrls][${ei}]`, url);
                                                    });
                                                }

                                                // URLs to remove (edit helper)
                                                if (Array.isArray(v._removeUrls)) {
                                                    v._removeUrls.forEach((url: string, ri: number) => {
                                                        fd.append(`variants[${vi}][_removeUrls][${ri}]`, url);
                                                    });
                                                }
                                            });

                                            try {
                                                const res = await fetch("/api/dashboard/products/updateProduct", {
                                                    method: "PUT",
                                                    body: fd, // let the browser set multipart boundary
                                                });

                                                if (!res.ok) {
                                                    const errJson = await res.json().catch(() => ({}));
                                                    console.error("Update failed:", errJson);
                                                    // Optionally show toast here
                                                    errorNotifier.notify("Error res is not ok")
                                                    return;
                                                }

                                                // success
                                                // Optionally read { message, productId }:
                                                // const data = await res.json();
                                                // success toast...
                                                successNotifier.notify("Successfull")
                                                setOpen(false);
                                            } catch (e) {
                                                console.error("Network error during update:", e);
                                                // toast error...
                                                errorNotifier.notify("Error in catch block")
                                            }
                                            setOpen(false)
                                        }}

                                        className="p-5 lg:p-10"
                                        isSaving={false}
                                    />
                                </Modal>
                            </>
                    }
                </div>
            </div>
        </div>
    );
}













