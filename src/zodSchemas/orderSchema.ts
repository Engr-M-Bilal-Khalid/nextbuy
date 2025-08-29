import { z } from "zod";
// Address fields schema
export const addressSchema = z.object({
    country: z.string(),
    first_name: z.string().min(2, "First name required"),
    last_name: z.string().min(2, "Last name required"),
    address: z.string().min(5, "Address required"),
    city: z.string().min(2, "City required"),
    postal_code: z.string().optional(),
    phone: z.string().optional(),
});

// Main form schema
export const orderSchemaClient = z.object({
    contact: z.string().min(4, "Contact is required"),
    shipping_address: addressSchema,
    billing_same_as_shipping: z.enum(["true", "false"]),
    billing_address: addressSchema.partial().optional(),
    cod: z.boolean(),
}).refine(
    (data) =>
        data.billing_same_as_shipping === "true" ||
        (data.billing_address !== undefined &&
            data.billing_address.address !== undefined &&
            data.billing_address.address.length >= 5),
    {
        message: "Billing address required if different from shipping",
        path: ["billing_address"],
    }
);

export type OrderSchemaClient = z.infer<typeof orderSchemaClient>;
