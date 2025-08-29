// app/api/cart/remove/route.ts
import Database from "@/lib/dbConnection";
import { NextRequest, NextResponse } from "next/server";
import { Pool, PoolClient } from "pg";
import { z } from "zod";

// Define schema to validate request body
const RemoveFromCartSchema = z.object({
  cartUserId: z.string(),
  variantId: z.string(),
});

export async function POST(req: NextRequest) {
  let client: PoolClient | null = null;

  try {
    const body = await req.json();
    const { cartUserId, variantId } = RemoveFromCartSchema.parse(body);

    const pool: Pool = Database();
    client = await pool.connect();

    // Begin transaction
    await client.query("BEGIN");

    // Step 1: Check if the cartUserId exists in customers (registered user or guest)
    const userRes = await client.query(
      `SELECT customer_id FROM customers WHERE customer_id = $1`,
      [cartUserId]
    );
    const isCustomer = (userRes.rowCount ?? 0) > 0;

    // Step 2: Find the existing cart for customer or guest
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
      // No cart to remove from
      return NextResponse.json({ success: false, message: "Cart not found" }, { status: 404 });
    }

    const cartId = cartRes.rows[0].cart_id;

    // Step 3: Delete the cart item with matching variant_id
    await client.query(
      `DELETE FROM cart_items WHERE cart_id = $1 AND variant_id = $2`,
      [cartId, variantId]
    );

    // Commit transaction
    await client.query("COMMIT");

    // (Optional) Return updated cart or confirmation
    // You can fetch the updated cart here if needed and include in response

    return NextResponse.json({ success: true, cartId });
  } catch (err) {
    console.error("Error removing from cart:", err);

    if (client) {
      await client.query("ROLLBACK");
    }

    return NextResponse.json(
      { success: false, message: "Error removing from cart" },
      { status: 500 }
    );
  } finally {
    if (client) {
      client.release();
    }
  }
}
