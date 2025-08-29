"use client"
import { Product } from "@/components/home/config";
import { Separator } from "@/components/ui/separator";
import { ProductTabs } from "./ProductTabs";

export default function ProductTabView({ currentProduct }: { currentProduct: Product }) {
    return (
        <>
            <Separator className="mt-[-40px] lg:my-2 border-1" />
            <ProductTabs className="mt-[-20px] lg:mt-2" specification={currentProduct.specifications} detailDescription={currentProduct.productDetailDescription} warrantyDetails={currentProduct.warrantyDetails} returnPloicyDetails={currentProduct.returnPloicyDetails} key={currentProduct.productId}/>
        </>
    )
}