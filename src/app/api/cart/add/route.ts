// app/api/cart/add/route.ts
import Database from "@/lib/dbConnection";
import { AddToCartSchema } from "@/zodSchemas/cartSchema";
import { NextRequest, NextResponse } from "next/server";
import { Pool, PoolClient } from "pg";

export async function POST(req: NextRequest) {
  let client: PoolClient | null = null;

  try {
    const body = await req.json();
    const { cartUserId, variantId, quantity } = AddToCartSchema.parse(body);

    const pool: Pool = Database();
    client = await pool.connect();

    // Begin transaction
    await client.query("BEGIN");

    // Step 1: check if this cartUserId exists in customers
    const userRes = await client.query(
      `SELECT customer_id FROM customers WHERE customer_id = $1`,
      [cartUserId]
    );

    const isCustomer = (userRes.rowCount ?? 0) > 0;

    // Step 2: find existing cart
    let cartRes;
    if (isCustomer) {
      cartRes = await client.query(
        `SELECT cart_id FROM carts WHERE customer_id = $1`,
        [cartUserId]
      );
    } else {
      cartRes = await client.query(
        `SELECT cart_id FROM carts WHERE guest_id = $1`,
        [cartUserId]
      );
    }

    let cartId: number;
    if ((cartRes.rowCount ?? 0) === 0) {
      // create new cart
      const insertRes = isCustomer
        ? await client.query(
            `INSERT INTO carts (customer_id) VALUES ($1) RETURNING cart_id`,
            [cartUserId]
          )
        : await client.query(
            `INSERT INTO carts (guest_id) VALUES ($1) RETURNING cart_id`,
            [cartUserId]
          );

      cartId = insertRes.rows[0].cart_id;
    } else {
      cartId = cartRes.rows[0].cart_id;
    }

    // Step 3: check if variant already in cart
    const itemRes = await client.query(
      `SELECT item_id, quantity FROM cart_items WHERE cart_id = $1 AND variant_id = $2`,
      [cartId, variantId]
    );

    if ((itemRes.rowCount ?? 0) > 0) {
      // update quantity
      const newQuantity = itemRes.rows[0].quantity + quantity;
      await client.query(
        `UPDATE cart_items SET quantity = $1 WHERE item_id = $2`,
        [newQuantity, itemRes.rows[0].item_id]
      );
    } else {
      // insert new item
      await client.query(
        `INSERT INTO cart_items (cart_id, variant_id, quantity) VALUES ($1, $2, $3)`,
        [cartId, variantId, quantity]
      );
    }

    // Commit transaction
    await client.query("COMMIT");

    return NextResponse.json({ success: true, cartId });
  } catch (err) {
    console.error("Error adding to cart:", err);

    if (client) {
      await client.query("ROLLBACK"); // rollback if error
    }

    return NextResponse.json(
      { success: false, message: "Error adding to cart" },
      { status: 500 }
    );
  } finally {
    if (client) {
      client.release();
    }
  }
}
