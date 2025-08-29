import { OrderSchemaClient } from "@/zodSchemas/orderSchema";

// helpers/api.ts
export async function confirmOrder(
    orderData: OrderSchemaClient,
    cartId: string | undefined
) {
    if (!cartId) {
        return {
            success: false,
            message: "Cart ID is required",
            data: null,
        };
    }

    try {
        const response = await fetch("/api/orders/confirm", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...orderData, cartId }),
        });

        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
            return {
                success: false,
                message: result.message || "Failed to confirm order",
                data: null,
            };
        }

        return {
            success: true,
            message: result.message || "Order confirmed successfully",
            data: result.data || null,
        };
    } catch (err: any) {
        return {
            success: false,
            message: err.message || "Unexpected error while confirming order",
            data: null,
        };
    }
}
