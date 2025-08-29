import { Product } from "@/components/home/config";

export function transformAllProducts(rawProductsArray: any[]): Product[] {
    return rawProductsArray.map(transformProduct);
}

export function transformProduct(raw: any): Product {
    return {
        productId: raw.productId,
        categoryId: raw.categoryId,
        categoryName: raw.categoryName,
        tag: raw.tag,
        title: raw.title,
        description: raw.description,
        brand: raw.brand,
        rating: raw.rating,
        variants: raw.variants,
        reviews: raw.reviews.map((r: any) => ({
            ...r,
            date: r.date, // or new Date(r.date) if you want Date objects
        })),
        isActive:raw.isActive,
        specifications: raw.specifications,
        productDetailDescription: raw.product_detail_description,
        warrantyDetails: raw.warranty_details,
        returnPloicyDetails: raw.return_policy_details,
    };
}