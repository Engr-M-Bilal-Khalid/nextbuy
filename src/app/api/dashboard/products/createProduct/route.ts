import Database from "@/lib/dbConnection";
import { launchNewProductServerSchema } from "@/zodSchemas/productSchema";
import { NextRequest, NextResponse } from "next/server";
import { Pool, PoolClient } from "pg";
import { ZodError } from "zod";


import {
    buildVariantUrlsForCreate,
    readSpecs,
    readStringArray,
    readVariants
} from "@/app/api/dashboard/products/shared";

export async function POST(req: NextRequest) {
    try {
        const form = await req.formData();

        // 1) Build raw payload from form-data
        const rawPayload = {
            title: String(form.get("title") ?? ""),
            tag: String(form.get("tag") ?? ""),
            categoryName: String(form.get("categoryName") ?? ""),
            brand: String(form.get("brand") ?? ""),
            description: String(form.get("description") ?? ""),
            productDetailDescription: readStringArray(form, "productDetailDescription"),
            returnPloicyDetails: readStringArray(form, "returnPloicyDetails"),
            warrantyDetails: readStringArray(form, "warrantyDetails"),
            specifications: readSpecs(form),
            variants: readVariants(form),
        };

        // 2) Upload all variant images to Cloudinary and replace with secure URLs
        const variantsWithUrls = await buildVariantUrlsForCreate(rawPayload.variants)

        const payload = { ...rawPayload, variants: variantsWithUrls };

        // 3) Validate with server schema (images now string[] URLs)
        const parsed = launchNewProductServerSchema.parse(payload);


        // 4) Insert product + variants + specifications (no reviews) in a single transaction
        let client: PoolClient | null = null;
        const pool: Pool = Database();
        client = await pool.connect();

        try {

            await client.query("BEGIN");

            // 4a) Resolve brand/category (case-insensitive)
            const fkRes = await client.query<{
                brand_id: number | null;
                category_id: number | null;
            }>(
                `
        SELECT
          (SELECT brand_id FROM brands WHERE LOWER(name) = LOWER($1)) AS brand_id,
          (SELECT category_id FROM categories WHERE LOWER(name) = LOWER($2)) AS category_id
        `,
                [parsed.brand, parsed.categoryName]
            );
            const fk = fkRes.rows[0];
            if (!fk?.brand_id || !fk?.category_id) {
                throw new Error("Brand or category not found");
            }

            // 4b) Insert product and get product_id
            const prodRes = await client.query<{ product_id: number }>(
                `
        INSERT INTO products (
          brand_id, category_id, tag, title, description, rating,
          product_detail_description, warranty_details, return_policy_details
        )
        VALUES ($1, $2, $3, $4, $5, COALESCE($6::numeric, 0), $7::text[], $8::text[], $9::text[])
        RETURNING product_id
        `,
                [
                    fk.brand_id,
                    fk.category_id,
                    parsed.tag,
                    parsed.title,
                    parsed.description,
                    null, // rating optional; pass parsed.rating if you add it
                    parsed.productDetailDescription,
                    parsed.warrantyDetails,
                    parsed.returnPloicyDetails,
                ]
            );
            const productId = prodRes.rows[0].product_id;

            // 4c) Insert variants (batch VALUES)
            if (parsed.variants.length > 0) {
                const values: any[] = [];
                const rowsSql: string[] = [];
                parsed.variants.forEach((v, i) => {
                    const base = i * 6; // 6 params after productId per row
                    rowsSql.push(
                        `($1, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5}::text[], $${base + 6}::numeric, $${base + 7}::numeric)`
                    );
                    values.push(
                        v.name,
                        v.color,
                        v.stock,
                        v.images, // text[]
                        Number(v.priceWithoutDiscount),
                        v.discount != null ? Number(v.discount) : 0
                    );
                });
                await client.query(
                    `
          INSERT INTO product_variants
            (product_id, name, color, stock, images, price_without_discount, discount)
          VALUES ${rowsSql.join(",")}
          `,
                    [productId, ...values]
                );
            }

            // 4d) Insert specifications (batch VALUES)
            if (parsed.specifications.length > 0) {
                const values: any[] = [];
                const rowsSql: string[] = [];
                parsed.specifications.forEach((s, i) => {
                    const base = i * 2;
                    rowsSql.push(`($1, $${base + 2}, $${base + 3})`);
                    values.push(s.label, s.value);
                });
                await client.query(
                    `
          INSERT INTO product_specifications (product_id, label, value)
          VALUES ${rowsSql.join(",")}
          `,
                    [productId, ...values]
                );
            }

            await client.query("COMMIT");
            console.log(payload)
            return NextResponse.json({ message: "Created", productId }, { status: 201 });
        } catch (dbErr) {
            await client.query("ROLLBACK");
            console.error("DB error:", dbErr);
            return NextResponse.json({ message: "Database error" }, { status: 500 });
        } finally {
            client.release();
        }

        
    } catch (err: any) {
        if (err instanceof ZodError) {
            console.error("Validation error:", err.flatten());
            return NextResponse.json(
                { message: "Validation failed", issues: err.issues },
                { status: 400 }
            );
        }
        console.error("Unhandled error:", err);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
