// app/api/orders/confirm/route.ts
import Database from "@/lib/dbConnection";
import { NextRequest, NextResponse } from "next/server";
import { Pool, PoolClient } from "pg";

export async function POST(req: NextRequest) {
    let client: PoolClient | null = null;

    try {
        const body = await req.json();
        const { cartId, payment_status, order_status, cod, billing_same_as_shipping, shipping_address, billing_address } = body;

        if (!cartId) {
            return NextResponse.json(
                { success: false, message: "Cart ID is required" },
                { status: 400 }
            );
        }

        const pool: Pool = Database();
        client = await pool.connect();

        // ✅ Ensure cart exists
        const cartRes = await client.query(
            `SELECT cart_id FROM carts WHERE cart_id = $1`,
            [cartId]
        );
        if (cartRes.rowCount === 0) {
            return NextResponse.json(
                { success: false, message: "Cart not found" },
                { status: 404 }
            );
        }

        // ✅ Insert new order
        const insertRes = await client.query(
            `
      INSERT INTO orders 
        (cart_id, payment_status, order_status, cod, billing_same_as_shipping, shipping_address, billing_address)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING order_id;
      `,
            [
                cartId,
                payment_status ?? "unpaid",
                order_status ?? "pending",
                cod ?? true,
                billing_same_as_shipping ?? true,
                shipping_address,
                billing_same_as_shipping ? shipping_address : billing_address,
            ]
        );

        const orderId = insertRes.rows[0];

        return NextResponse.json({ success: true, orderId }, { status: 201 });
    } catch (err) {
        console.error("Error creating order:", err);
        return NextResponse.json(
            { success: false, message: "Error creating order" },
            { status: 500 }
        );
    } finally {
        if (client) client.release();
    }
}
