// app/api/dashboard/products/updateProduct/route.ts
import { launchNewProductServerSchema } from "@/zodSchemas/productSchema";
import { NextRequest, NextResponse } from "next/server";
import { ZodError, z } from "zod";

import {
  buildVariantUrlsForEdit,
  getDbClient,
  readSpecs,
  readStringArray,
  readVariants,
  replaceSpecifications,
  replaceVariants,
  resolveBrandCategoryIds,
} from "@/app/api/dashboard/products/shared";

// Simple UUID validator (RFC4122 variants 1-5 acceptable)
const uuidSchema = z.string().uuid();

export async function PUT(req: NextRequest) {
  let client: Awaited<ReturnType<typeof getDbClient>> | null = null;

  try {
    const form = await req.formData();

    // Required: productId (UUID)
    const productIdRaw = form.get("productId");
    const productId = uuidSchema.safeParse(productIdRaw);
    if (!productId.success) {
      return NextResponse.json({ message: "productId must be a valid UUID" }, { status: 400 });
    }

    // 1) Build raw payload (same as create)
    const rawPayload = {
      title: String(form.get("title") ?? ""),
      tag: String(form.get("tag") ?? ""),
      categoryName: String(form.get("categoryName") ?? ""),
      brand: String(form.get("brand") ?? ""),
      description: String(form.get("description") ?? ""),
      productDetailDescription: readStringArray(form, "productDetailDescription"),
      returnPloicyDetails: readStringArray(form, "returnPloicyDetails"),
      warrantyDetails: readStringArray(form, "warrantyDetails"),
      specifications: readSpecs(form),
      variants: readVariants(form),
    };

    

    
    console.log("----------------------------------rawPayload---------------------------");
    console.log(rawPayload)

    // 2) Image pipeline (merge existing + newly uploaded)
    const variantsWithUrls = await buildVariantUrlsForEdit(rawPayload.variants);
    const payloadForValidation = { ...rawPayload, variants: variantsWithUrls };


    
    console.log("----------------------------------variantsWithUrls---------------------------");
    console.log(variantsWithUrls)

    
    console.log("----------------------------------payloadForValidation---------------------------");
    console.log(payloadForValidation)

    // 3) Validate with server schema (images are URL[])
    const parsed = launchNewProductServerSchema.parse(payloadForValidation);

    console.log("----------------------------------Parsed---------------------------");
    console.log(parsed)

    // 4) Transaction
    client = await getDbClient();
    await client.query("BEGIN");

    const { brand_id, category_id } = await resolveBrandCategoryIds(client, parsed.brand, parsed.categoryName);

    // Update product (UUID param)
    await client.query(
      `
      UPDATE products
      SET
        brand_id = $1,
        category_id = $2,
        tag = $3,
        title = $4,
        description = $5,
        product_detail_description = $6::text[],
        warranty_details = $7::text[],
        return_policy_details = $8::text[]
      WHERE product_id = $9
      `,
      [
        brand_id,
        category_id,
        parsed.tag,
        parsed.title,
        parsed.description,
        parsed.productDetailDescription ?? [],
        parsed.warrantyDetails ?? [],
        parsed.returnPloicyDetails ?? [],
        productId.data, // UUID string
      ]
    );

    await replaceVariants(client, productId.data, parsed.variants);
    await replaceSpecifications(client, productId.data, parsed.specifications);

    await client.query("COMMIT");
    return NextResponse.json({ message: "Updated", productId: productId.data }, { status: 200 });
  } catch (err: any) {
    if (client) {
      try {
        await client.query("ROLLBACK");
      } catch {}
    }
    if (err instanceof ZodError) {
      return NextResponse.json({ message: "Validation failed", issues: err.issues }, { status: 400 });
    }
    console.error("Unhandled error:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  } finally {
    try {
      client?.release();
    } catch {}
  }
}


// export async function PUT(req: NextRequest) {
//   let client: Awaited<ReturnType<typeof getDbClient>> | null = null;
//   try {

//     const form = await req.formData();
//     const productIdRaw = form.get("productId");
//     const productId = uuidSchema.safeParse(productIdRaw);
//     if (!productId.success) {
//       return NextResponse.json({ message: "productId must be a valid UUID" }, { status: 400 });
//     }
//     const rawPayload = {
//       title: String(form.get("title") ?? ""),
//       tag: String(form.get("tag") ?? ""),
//       categoryName: String(form.get("categoryName") ?? ""),
//       brand: String(form.get("brand") ?? ""),
//       description: String(form.get("description") ?? ""),
//       productDetailDescription: readStringArray(form, "productDetailDescription"),
//       returnPloicyDetails: readStringArray(form, "returnPloicyDetails"),
//       warrantyDetails: readStringArray(form, "warrantyDetails"),
//       specifications: readSpecs(form),
//       variants: readVariants(form),
//     };

//     // 2) Upload all variant images to Cloudinary and replace with secure URLs
//     const variantsWithUrls = await Promise.all(
//       rawPayload.variants.map(async (variant, idx) => {
//         if (!Array.isArray(variant.images) || variant.images.length === 0) {
//           return { ...variant, images: [] as string[] };
//         }

//         const uploads = await Promise.all(
//           variant.images.map(async (file: File, fileIdx: number) => {
//             const res = await uploadFileToCloudinary(file, {
//               folder: "products/variants",
//               context: {
//                 variant_index: String(idx),
//                 file_index: String(fileIdx),
//                 variant_name: variant.name || "",
//                 color: variant.color || "",
//               },
//             });
//             return res.secure_url;
//           })
//         );

//         return { ...variant, images: uploads as string[] };
//       })
//     );

//     const payload = { productId,...rawPayload, variants: variantsWithUrls };

//     console.log(payload)

//   } catch (error) {

//   }
// }
