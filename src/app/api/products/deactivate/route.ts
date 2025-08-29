import Database from "@/lib/dbConnection";
import { NextRequest, NextResponse } from "next/server";


let productStatusUpdateQuery = `update products set is_active = NOT is_active where product_id = $1 returning title
`

export async function POST(req: NextRequest) {
    try {
        const { productId } = await req.json() as { productId?: string };
        if (!productId) {
            return NextResponse.json({ error: "productId required" }, { status: 400 });
        }

        let client, productStatusUpdateResult;
        client = Database();
        console.log(`Connected Successfully to PostgreSQL`);

        productStatusUpdateResult = await client.query(productStatusUpdateQuery, [productId]);


        if ((!productStatusUpdateResult.rows || productStatusUpdateResult.rows.length === 0)) {
            // Bad request
            return NextResponse.json({ status: "error", message: "productId required" }, { status: 400 });
        }

        console.log("------------------------------------------------")
        console.log(productStatusUpdateResult.rows[0].title);
        console.log("------------------------------------------------")

        // Success
        return NextResponse.json({ status: "ok", productId,returnProductTitle:productStatusUpdateResult.rows[0].title }, { status: 200 });
    } catch (err: any) {
        // Server error
        return NextResponse.json({ status: "error", message: err?.message ?? "Network error" }, { status: 500 });
    }
}



