import Database from '@/lib/dbConnection';
import { transformAllProducts } from '@/lib/transformProduct';
import { NextRequest, NextResponse } from 'next/server';

let categoryWiseQuery = `SELECT json_agg(product_data) AS products
FROM (
    SELECT
        p.product_id AS "productId",
        p.category_id AS "categoryId",
        c.name AS "categoryName",
        p.tag,
        p.title,
        p.description,
        b.name AS brand,
        TO_CHAR(p.rating, 'FM999D00') AS rating,
        p.product_detail_description,
        p.warranty_details,
        p.return_policy_details,
        p.is_active AS "isActive",

        -- Variants as JSON array
        COALESCE(json_agg(DISTINCT jsonb_build_object(
            'variantId', pv.variant_id,
            'name', pv.name,
            'color', pv.color,
            'stock', pv.stock,
            'images', pv.images,
            'priceWithoutDiscount', TO_CHAR(pv.price_without_discount, 'FM999999999.00'),
            'discount', TO_CHAR(pv.discount, 'FM999.00')
        )) FILTER (WHERE pv.variant_id IS NOT NULL), '[]') AS variants,

        -- Reviews as JSON array
        COALESCE(json_agg(DISTINCT jsonb_build_object(
            'id', pr.review_id,
            'name', pr.reviewer_name,
            'rating', pr.rating,
            'description', pr.description,
            'date', pr.review_date,
            'images', pr.images
        )) FILTER (WHERE pr.review_id IS NOT NULL), '[]') AS reviews,

        -- Specifications as JSON array
        COALESCE(json_agg(DISTINCT jsonb_build_object(
            'label', ps.label,
            'value', ps.value
        )) FILTER (WHERE ps.spec_id IS NOT NULL), '[]') AS specifications

    FROM products p
    JOIN brands b ON p.brand_id = b.brand_id
    JOIN categories c ON p.category_id = c.category_id
    LEFT JOIN product_variants pv ON p.product_id = pv.product_id
    LEFT JOIN product_reviews pr ON p.product_id = pr.product_id
    LEFT JOIN product_specifications ps ON p.product_id = ps.product_id

    WHERE c.name = $1 

    GROUP BY
        p.product_id,
        p.category_id,
        c.name,
        p.tag,
        p.title,
        p.description,
        b.name,
        p.rating,
        p.product_detail_description,
        p.warranty_details,
        p.return_policy_details
) product_data;
`


export async function POST(req: NextRequest) {
    try {
        const body = await req.json().catch(() => ({}));
        const category = String(body?.category ?? "").trim();

        if (!category) {
            return NextResponse.json(
                { success: false, message: "category is required in body" },
                { status: 400 }
            );
        }

        const client = Database();
        const result = await client.query(categoryWiseQuery, [category]);

        // Always coerce to an array
        const raw = result?.rows?.[0]?.products ?? [];
        const transformed = transformAllProducts(raw) ?? [];

        // Normalize the key to match your client expectations
        const normalized = category.toLowerCase();

        if (normalized === "earbuds") {
            return NextResponse.json({ earbudsTransformedProducts: transformed });
        }

        if (normalized === "smartwatches" || normalized === "smart watches") {
            return NextResponse.json({ smartWatchesTransformedProducts: transformed });
        }

        // Fallback for any other category names
        return NextResponse.json({
            category,
            transformedProducts: transformed,
        });
    } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch products by category",
                error: (error as Error).message,
            },
            { status: 500 }
        );
    }
}




