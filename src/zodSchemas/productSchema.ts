import z from "zod";

// Helpers
const hexColor = z
  .string()
  .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color (e.g., #000000)");

const numericString = z
  .string()
  .trim()
  .min(1, "Required")
  .refine((v) => !Number.isNaN(Number(v)), "Must be a valid number");


//Variant Base Schema
export const variantBaseSchema = z.object({
  name: z.string().trim().min(1, "Variant name is required"),
  color: hexColor,
  stock: z
    .number({ error: "Stock must be a number" })
    .int("Stock must be an integer")
    .min(0, "Stock cannot be negative"),
  priceWithoutDiscount: numericString,
  discount: numericString
    .refine((v) => {
      const n = Number(v);
      return n >= 0 && n <= 100;
    }, "Discount must be between 0 and 100").optional(),
});



//Varinat Client side with File supported image schema
export const variantClientSchema = variantBaseSchema.extend({
  images: z
    .array(
      z
        .instanceof(File)
        .refine((f) => f.size <= 5 * 1024 * 1024, { message: "Max file size is 5MB." })
        .refine((f) => ["image/jpeg", "image/png", "image/webp", "image/avif"].includes(f.type), {
          message: "Only JPEG/PNG/WebP/AVIF images are allowed.",
        })
    )
    .min(2, { message: "Please select at least two images." }),
});


//Varinat Server side with url supported after host to cloudinary
const isHttps = (u: string) => u.startsWith("https://");
const isCloudinary = (u: string) => u.includes("res.cloudinary.com"); 

export const variantServerSchema = variantBaseSchema.extend({
  images: z
    .array(
      z
        .string()
        .url("Image must be a valid URL.")
        .refine(isHttps, { message: "HTTPS is required for images." })
        .refine(isCloudinary, { message: "Image must be a Cloudinary URL." })
    )
    .min(2, { message: "Please provide at least two images." }),
});


export const VariantsClientArraySchema = z
  .array(variantClientSchema)
  .min(1, "Add at least one variant");


export const VariantsServerArraySchema = z
  .array(variantServerSchema)
  .min(1, "Add at least one variant");




// Specifications  
export const SpecificationSchema = z.object({
  label: z.string(),
  value: z.string()
})




export const SpecificationArraySchema = z.array(SpecificationSchema).min(1, "Add atleast two specifications");

export const ProductDetailDescriptionArraySchema = z.array(z.string().min(10).max(100)).min(1, "Add atleast one paragraph");

export const WarrantyDetailsArraySchema = z.array(z.string().min(10).max(100)).min(1, "Add atleast one paragraph");

export const ReturnPloicyDetailsArraySchema = z.array(z.string().min(10).max(100)).min(1, "Add atleast one paragraph");





export const launchNewProductBaseSchema = z.object({
  title: z.string().min(3),
  tag: z.string().min(3),
  categoryName: z.enum(['earbuds', 'smart watches'], {
    message: "Please select a valid category (earbuds or smartwatches).",
  }),
  brand: z.enum(['zero', 'dany', 'ronin', 'audionic'], {
    message: "Please select a valid brand (zero | dany | ronin | audionic).",
  }),
  description: z.string().min(10, { message: "Description must be at least 20 characters." }).max(30, { message: "Description must be at most 40 characters." }),
  specifications: SpecificationArraySchema,
  productDetailDescription: ProductDetailDescriptionArraySchema,
  warrantyDetails: WarrantyDetailsArraySchema,
  returnPloicyDetails: ReturnPloicyDetailsArraySchema
});

export const launchNewProductClientSchema = launchNewProductBaseSchema.extend({
  variants: z.array(variantClientSchema).min(1, { message: "At least one variant is required." }),
});

export const updateProductClientSchema = launchNewProductClientSchema.extend({
  productId: z.string().uuid()
});

// Server product: variants use URL string[]
export const launchNewProductServerSchema = launchNewProductBaseSchema.extend({
  variants: z.array(variantServerSchema).min(1, { message: "At least one variant is required." }),
});


export type LaunchNewProductClientSchema = z.infer<typeof launchNewProductClientSchema>;

export type LaunchNewProductServerSchema = z.infer<typeof launchNewProductServerSchema>;





