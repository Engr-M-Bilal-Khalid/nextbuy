import Database from "@/lib/dbConnection";
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { Pool, PoolClient } from "pg";

// Schema for update (set quantity, not add)
const UpdateCartSchema = z.object({
  cartUserId: z.string(),
  variantId: z.string(),
  quantity: z.number().min(0), // allow 0 for "remove"
});

export async function POST(req: NextRequest) {
  let client: PoolClient | null = null;

  try {
    const body = await req.json();
    const { cartUserId, variantId, quantity } = UpdateCartSchema.parse(body);

    const pool: Pool = Database();
    client = await pool.connect();

    await client.query("BEGIN");

    // Step 1: check if user is a registered customer
    const userRes = await client.query(
      `SELECT customer_id FROM customers WHERE customer_id = $1`,
      [cartUserId]
    );
    const isCustomer = (userRes.rowCount ?? 0) > 0;

    // Step 2: find cart for this user (customer or guest)
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

    if ((cartRes.rowCount ?? 0) === 0) {
      throw new Error("Cart not found for user");
    }

    const cartId = cartRes.rows[0].cart_id;

    // Step 3: check if variant exists in cart_items
    const itemRes = await client.query(
      `SELECT item_id FROM cart_items WHERE cart_id = $1 AND variant_id = $2`,
      [cartId, variantId]
    );

    if ((itemRes.rowCount ?? 0) === 0) {
      throw new Error("Item not found in cart");
    }

    const itemId = itemRes.rows[0].item_id;

    if (quantity === 0) {
      // quantity 0 means remove item
      await client.query(`DELETE FROM cart_items WHERE item_id = $1`, [itemId]);
    } else {
      // update item quantity
      await client.query(
        `UPDATE cart_items SET quantity = $1 WHERE item_id = $2`,
        [quantity, itemId]
      );
    }

    await client.query("COMMIT");

    return NextResponse.json({ success: true, cartId, variantId, quantity });
  } catch (err) {
    console.error("Error updating cart:", err);

    if (client) {
      await client.query("ROLLBACK");
    }

    return NextResponse.json(
      { success: false, message: "Error updating cart" },
      { status: 500 }
    );
  } finally {
    if (client) {
      client.release();
    }
  }
}
