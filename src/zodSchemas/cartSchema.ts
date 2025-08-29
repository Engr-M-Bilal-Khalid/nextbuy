// Schema
import { z } from "zod";


export const AddToCartSchema = z.object({
   cartUserId: z.string().uuid(),
    variantId: z.string().uuid(),
    quantity: z.number().min(1),
})