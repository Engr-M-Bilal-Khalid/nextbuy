import { NextRequest, NextResponse } from 'next/server';
import Database from '@/lib/dbConnection';
import { Product } from '@/components/home/config';

let query = `SELECT
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

WHERE p.product_id = $1  

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
    p.return_policy_details;
`
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get('productId');

  if (!productId) {
    return NextResponse.json({ success: false, message: 'No productId provided' }, { status: 400 });
  }

  let client;
  try {
    client = Database();
    console.log(`Connected Successfully to PostgreSQL`);
    const result = await client.query(query, [productId]);
    console.log('Query executed successfully:', result.rows);

    // Check if product was found
    if (!result.rows || result.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 400 }
      );
    }

    const transformedProduct = transformProduct(result.rows[0]);
    return NextResponse.json({ success: true, product: transformedProduct });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch product', error: (error as Error).message },
      { status: 500 }
    );
  }
}


function transformProduct(raw: any): Product {
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
    specifications: raw.specifications,
    productDetailDescription: raw.product_detail_description,
    warrantyDetails: raw.warranty_details,
    returnPloicyDetails: raw.return_policy_details,
  };
}
