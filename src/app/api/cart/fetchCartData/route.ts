// app/api/cart/fetchCartData/route.ts
import Database from "@/lib/dbConnection";
import { NextRequest, NextResponse } from "next/server";
import { Pool, PoolClient } from "pg";

export async function POST(req: NextRequest) {
  let client: PoolClient | null = null;

  try {
    const { cartUserId } = await req.json(); // 👈 now we read from body

    if (!cartUserId) {
      return NextResponse.json(
        { success: false, message: "cartUserId is required" },
        { status: 400 }
      );
    }

    const pool: Pool = Database();
    client = await pool.connect();

    // Step 1: check if this is a registered customer
    const userRes = await client.query(
      `SELECT customer_id FROM customers WHERE customer_id = $1`,
      [cartUserId]
    );
    const isCustomer = (userRes.rowCount ?? 0) > 0;

    // Step 2: fetch cart for customer or guest
    const cartRes = isCustomer
      ? await client.query(
          `SELECT * FROM carts WHERE customer_id = $1 ORDER BY created_at DESC LIMIT 1`,
          [cartUserId]
        )
      : await client.query(
          `SELECT * FROM carts WHERE guest_id = $1 ORDER BY created_at DESC LIMIT 1`,
          [cartUserId]
        );

    if (cartRes.rowCount === 0) {
      return NextResponse.json({ cart: null, items: [] });
    }

    const cart = cartRes.rows[0];

    // Step 3: fetch cart items with product details
    const itemsRes = await client.query(
      `
      SELECT ci.item_id, ci.variant_id, ci.quantity, 
             v.price_without_discount, v.stock, v.images[1] as firstImage, v.name, v.discount, 
             p.product_id, p.title as product_name
      FROM cart_items ci
      JOIN product_variants v ON ci.variant_id = v.variant_id
      JOIN products p ON v.product_id = p.product_id
      WHERE ci.cart_id = $1
      `,
      [cart.cart_id]
    );

    return NextResponse.json({
      cart,
      items: itemsRes.rows,
    });
  } catch (err) {
    console.error("Error fetching cart:", err);
    return NextResponse.json(
      { success: false, message: "Error fetching cart" },
      { status: 500 }
    );
  } finally {
    if (client) client.release();
  }
}