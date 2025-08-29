// app/api/products/reactivate/route.ts
import Database from "@/lib/dbConnection";
import { NextRequest, NextResponse } from "next/server";
import { Pool, PoolClient } from "pg";

export async function POST(req: NextRequest) {
  let client: PoolClient | null = null;
  try {
    const { productId, variants } = await req.json();
    if (!productId || !variants) {
      return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
    }

    const pool: Pool = Database();
    client = await pool.connect();
    await client.query("BEGIN");

    // 1) Update product status → active
    const titleResult = await client.query(
      `UPDATE products SET is_active = true WHERE product_id = $1 returning title`,
      [productId]
    );

    const productTitle = titleResult.rows[0].title

    // 2) Update stock counts for each variant
    for (const v of variants) {
      await client.query(
        `UPDATE product_variants SET stock = $1 WHERE product_id = $2 AND name = $3`,
        [v.stock, productId, v.name]
      );
    }

    await client.query("COMMIT");

    return NextResponse.json({ message: "Product reactivated", productId,productTitle }, { status: 200 });
  } catch (err) {
    if (client) await client.query("ROLLBACK");
    console.error("Reactivate API error:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  } finally {
    if (client) client.release();
  }
}
