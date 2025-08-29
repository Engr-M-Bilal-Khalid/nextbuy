// app/api/dashboard/products/shared.ts
import type { Pool, PoolClient } from "pg";
import Database from "@/lib/dbConnection";
import { uploadFileToCloudinary } from "@/lib/uploadToCloudinary";

// ---------- FormData readers ----------
export function readStringArray(form: FormData, prefix: string): string[] {
  const items: string[] = [];
  for (let i = 0; ; i++) {
    const v = form.get(`${prefix}[${i}]`);
    if (v == null) break;
    if (typeof v !== "string") break;
    items.push(v);
  }
  return items;
}

export function readSpecs(form: FormData): { label: string; value: string }[] {
  const specs: { label: string; value: string }[] = [];
  for (let i = 0; ; i++) {
    const label = form.get(`specifications[${i}][label]`);
    const value = form.get(`specifications[${i}][value]`);
    if (label == null && value == null) break;
    specs.push({ label: String(label ?? ""), value: String(value ?? "") });
  }
  return specs;
}

export type VariantIncoming = {
  name: string;
  color: string;
  stock: number;
  priceWithoutDiscount: string;
  discount?: string;
  images: File[];
  _existingUrls?: string[];
  _removeUrls?: string[];
};

export function readVariants(form: FormData): VariantIncoming[] {
  const variants: VariantIncoming[] = [];
  for (let vi = 0; ; vi++) {
    const name = form.get(`variants[${vi}][name]`);
    const color = form.get(`variants[${vi}][color]`);
    const stock = form.get(`variants[${vi}][stock]`);
    const price = form.get(`variants[${vi}][priceWithoutDiscount]`);
    const discount = form.get(`variants[${vi}][discount]`);

    if (name == null && color == null && stock == null && price == null && discount == null) break;

    const images: File[] = [];
    for (let fi = 0; ; fi++) {
      const f = form.get(`variants[${vi}][images][${fi}]`);
      if (!(f instanceof File)) break;
      images.push(f);
    }

    const existingUrls: string[] = [];
    for (let ei = 0; ; ei++) {
      const u = form.get(`variants[${vi}][_existingUrls][${ei}]`);
      if (u == null) break;
      existingUrls.push(String(u));
    }

    const removeUrls: string[] = [];
    for (let ri = 0; ; ri++) {
      const u = form.get(`variants[${vi}][_removeUrls][${ri}]`);
      if (u == null) break;
      removeUrls.push(String(u));
    }

    variants.push({
      name: String(name ?? ""),
      color: String(color ?? ""),
      stock: stock != null ? Number(stock) : 0,
      priceWithoutDiscount: String(price ?? ""),
      discount: discount != null ? String(discount) : undefined,
      images,
      _existingUrls: existingUrls.length ? existingUrls : undefined,
      _removeUrls: removeUrls.length ? removeUrls : undefined,
    });
  }
  return variants;
}

// ---------- Image pipeline (edit-friendly) ----------
export async function buildVariantUrlsForEdit(variants: VariantIncoming[]) {
  return Promise.all(
    variants.map(async (variant, idx) => {
      const existing = Array.isArray(variant._existingUrls) ? variant._existingUrls : [];
      const toRemove = new Set(Array.isArray(variant._removeUrls) ? variant._removeUrls : []);
      const keptExisting = existing.filter((u) => !toRemove.has(u));

      let uploaded: string[] = [];
      if (Array.isArray(variant.images) && variant.images.length > 0) {
        uploaded = await Promise.all(
          variant.images.map(async (file, fileIdx) => {
            const res = await uploadFileToCloudinary(file, {
              folder: "products/variants",
              context: {
                variant_index: String(idx),
                file_index: String(fileIdx),
                variant_name: variant.name || "",
                color: variant.color || "",
              },
            });
            return res.secure_url;
          })
        );
      }

      const merged = [...keptExisting, ...uploaded];

      return {
        name: variant.name,
        color: variant.color,
        stock: variant.stock,
        priceWithoutDiscount: variant.priceWithoutDiscount,
        discount: variant.discount,
        images: merged, // string[] (URLs)
      };
    })
  );
}

// For create flows
export async function buildVariantUrlsForCreate(variants: { images: File[] }[] & Record<string, any>[]) {
  return Promise.all(
    variants.map(async (variant, idx) => {
      const uploaded: string[] = Array.isArray(variant.images)
        ? await Promise.all(
            variant.images.map(async (file, fileIdx) => {
              const res = await uploadFileToCloudinary(file, {
                folder: "products/variants",
                context: { variant_index: String(idx), file_index: String(fileIdx) },
              });
              return res.secure_url;
            })
          )
        : [];
      return { ...variant, images: uploaded };
    })
  );
}

// ---------- DB utilities ----------
export async function getDbClient(): Promise<PoolClient> {
  const pool: Pool = Database();
  return pool.connect();
}

export async function resolveBrandCategoryIds(
  client: PoolClient,
  brandName: string,
  categoryName: string
): Promise<{ brand_id: number; category_id: number }> {
  const fkRes = await client.query<{
    brand_id: number | null;
    category_id: number | null;
  }>(
    `
    SELECT
      (SELECT brand_id FROM brands WHERE LOWER(name) = LOWER($1)) AS brand_id,
      (SELECT category_id FROM categories WHERE LOWER(name) = LOWER($2)) AS category_id
    `,
    [brandName, categoryName]
  );
  const fk = fkRes.rows[0];
  if (!fk?.brand_id || !fk?.category_id) throw new Error("Brand or category not found");
  return { brand_id: fk.brand_id, category_id: fk.category_id };
}

// NOTE: productId is UUID string here
export async function replaceVariants(
  client: PoolClient,
  productId: string,
  variants: Array<{
    name: string;
    color: string;
    stock: number;
    images: string[];
    priceWithoutDiscount: string | number;
    discount?: string | number;
  }>
) {
  await client.query(`DELETE FROM product_variants WHERE product_id = $1`, [productId]);

  if (!variants?.length) return;

  const values: any[] = [];
  const rowsSql: string[] = [];

  variants.forEach((v, i) => {
    const base = i * 6;
    rowsSql.push(
      `($1, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5}::text[], $${base + 6}::numeric, $${base + 7}::numeric)`
    );
    values.push(
      v.name,
      v.color,
      Number(v.stock ?? 0),
      v.images ?? [],
      Number(v.priceWithoutDiscount ?? 0),
      v.discount != null ? Number(v.discount) : 0
    );
  });

  await client.query(
    `
    INSERT INTO product_variants
      (product_id, name, color, stock, images, price_without_discount, discount)
    VALUES ${rowsSql.join(",")}
    `,
    [productId, ...values]
  );
}

export async function replaceSpecifications(
  client: PoolClient,
  productId: string,
  specifications: { label: string; value: string }[]
) {
  await client.query(`DELETE FROM product_specifications WHERE product_id = $1`, [productId]);

  if (!specifications?.length) return;

  const values: any[] = [];
  const rowsSql: string[] = [];

  specifications.forEach((s, i) => {
    const base = i * 2;
    rowsSql.push(`($1, $${base + 2}, $${base + 3})`);
    values.push(s.label ?? "", s.value ?? "");
  });

  await client.query(
    `
    INSERT INTO product_specifications (product_id, label, value)
    VALUES ${rowsSql.join(",")}
    `,
    [productId, ...values]
  );
}
