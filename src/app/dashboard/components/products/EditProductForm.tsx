"use client";

import "@/app/style.css";
import { Product } from "@/components/home/config";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { LaunchNewProductClientSchema, launchNewProductClientSchema } from "@/zodSchemas/productSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, X } from "lucide-react";
import { title } from "process";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";


// --------------------------------

export interface EditProductFormProps {
    initialValues: Product;
    onCancel: () => void;
    onSave: (values: LaunchNewProductClientSchema & { _existingUrls?: string[][]; _removeUrls?: string[][] }) => void | Promise<void>;
    isSaving?: boolean;
    className?: string;
}

// Helpers
const ensureArray = <T,>(arr: T[] | undefined | null, fallbackOne: T) =>
    Array.isArray(arr) && arr.length > 0 ? arr : [fallbackOne];

// Convert Product -> LaunchNewProductClientSchema defaults
function toClientDefaultsFromProduct(p: Product): LaunchNewProductClientSchema & {
    // transient fields for edit experience
    variants: (LaunchNewProductClientSchema["variants"][number] & { _existingUrls?: string[]; _removeUrls?: string[] })[];
} {
    // Category enum in client schema is ("earbuds" | "smart watches")
    const categorySlug = (() => {
        const c = (p.categoryName || "").toLowerCase();
        if (c.includes("watch")) return "smart watches";
        return "earbuds";
    })() as LaunchNewProductClientSchema["categoryName"];

    // Brand enum is ('zero' | 'dany' | 'ronin' | 'audionic')
    const brandSlug = (p.brand || "zero").toLowerCase() as LaunchNewProductClientSchema["brand"];

    const variants = ensureArray(
        (p.variants || []).map((v) => ({
            name: v.name ?? "",
            color: v.color ?? "#000000",
            stock: typeof v.stock === "number" ? v.stock : 0,
            priceWithoutDiscount: String(v.priceWithoutDiscount ?? ""),
            discount: v.discount != null ? String(v.discount) : "",
            images: [] as File[], // new uploads go here
            _existingUrls: Array.isArray(v.images) ? v.images : [],
            _removeUrls: [], // if user decides to remove existing URLs
        })),
        {
            name: "",
            color: "#000000",
            stock: 0,
            priceWithoutDiscount: "",
            discount: "",
            images: [],
            _existingUrls: [],
            _removeUrls: [],
        }
    );

    const specifications = ensureArray(
        (p.specifications || []).map((s) => ({ label: s.label ?? "", value: s.value ?? "" })),
        { label: "", value: "" }
    );

    const productDetailDescription = ensureArray(p.productDetailDescription?.map(String), "");
    const warrantyDetails = ensureArray(p.warrantyDetails?.map(String), "");
    const returnPloicyDetails = ensureArray(p.returnPloicyDetails?.map(String), "");

    return {
        title: p.title ?? "",
        tag: p.tag ?? "",
        categoryName: categorySlug,
        brand: brandSlug,
        description: p.description ?? "",
        variants,
        specifications,
        productDetailDescription,
        warrantyDetails,
        returnPloicyDetails,
    };
}

const ordinalWords = ["First", "Second", "Third", "Fourth", "Fifth"];

export default function EditProductForm({
    initialValues,
    onCancel,
    onSave,
    isSaving = false,
    className,
}: EditProductFormProps) {
    // Build defaults from initialValues
    const computedDefaults = useMemo(() => toClientDefaultsFromProduct(initialValues), [initialValues]);

    // Use same schema as create form
    const form = useForm<LaunchNewProductClientSchema>({
        resolver: zodResolver(launchNewProductClientSchema),
        mode: "onSubmit",
        defaultValues: computedDefaults,
    });

    const { control, formState: { isValid }, setValue, getValues, handleSubmit } = form;

    // Manage previews: start with existing URLs; when user adds files, append their blob URLs
    const [imagePreviews, setImagePreviews] = useState<string[][]>(
        computedDefaults.variants.map(v => (v as any)._existingUrls ?? [])
    );

    // Field arrays
    const { fields: variantFields, append: appendVariant, remove: removeVariant } = useFieldArray({
        control,
        name: "variants",
    });

    const { fields: specificationFields, append: appendSpecification, remove: removeSpecification } = useFieldArray({
        control,
        name: "specifications",
    });

    // Paragraphs are already bound to form state in your create form; keep your same pattern:
    const [descParas, setDescParas] = useState<string[]>(computedDefaults.productDetailDescription ?? [""]);
    const firstSyncDesc = useRef(true);
    useEffect(() => {
        if (firstSyncDesc.current) {
            firstSyncDesc.current = false;
            form.setValue("productDetailDescription", descParas, { shouldDirty: false, shouldValidate: false });
            return;
        }
        form.setValue("productDetailDescription", descParas, { shouldDirty: true, shouldValidate: false });
    }, [descParas, form]);

    const [returnParas, setReturnParas] = useState<string[]>(computedDefaults.returnPloicyDetails ?? [""]);
    const firstSyncReturn = useRef(true);
    useEffect(() => {
        if (firstSyncReturn.current) {
            firstSyncReturn.current = false;
            form.setValue("returnPloicyDetails", returnParas, { shouldDirty: false, shouldValidate: false });
            return;
        }
        form.setValue("returnPloicyDetails", returnParas, { shouldDirty: true, shouldValidate: false });
    }, [returnParas, form]);

    const [warrantyParas, setWarrantyParas] = useState<string[]>(computedDefaults.warrantyDetails ?? [""]);
    const firstSyncWarranty = useRef(true);
    useEffect(() => {
        if (firstSyncWarranty.current) {
            firstSyncWarranty.current = false;
            form.setValue("warrantyDetails", warrantyParas, { shouldDirty: false, shouldValidate: false });
            return;
        }
        form.setValue("warrantyDetails", warrantyParas, { shouldDirty: true, shouldValidate: false });
    }, [warrantyParas, form]);

    // Refresh previews if initialValues change
    useEffect(() => {
        setImagePreviews(computedDefaults.variants.map(v => (v as any)._existingUrls ?? []));
    }, [computedDefaults]);

    // Image handlers
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const files = e.target.files ? Array.from(e.target.files) : [];
        const urls = files.map(file => URL.createObjectURL(file));

        setValue(`variants.${index}.images`, files as any, { shouldDirty: true, shouldValidate: false });

        // Mix existing URLs + new preview URLs (you can show them separated if you prefer)
        setImagePreviews(prev => {
            const copy = [...prev];
            const existing = (getValues(`variants.${index}`) as any)?._existingUrls ?? [];
            copy[index] = [...existing, ...urls];
            return copy;
        });
    };

    const handleRemoveExistingImage = (variantIndex: number, url: string) => {
        // Optional removal: keep track of URLs to remove on server
        const v = getValues(`variants.${variantIndex}`) as any;
        const currentRemove = Array.isArray(v._removeUrls) ? v._removeUrls : [];
        const updatedRemove = [...currentRemove, url];
        setValue(`variants.${variantIndex}._removeUrls` as any, updatedRemove, { shouldDirty: true });

        // Update previews
        setImagePreviews(prev => {
            const copy = [...prev];
            copy[variantIndex] = copy[variantIndex].filter(u => u !== url);
            return copy;
        });

        // Also strip from _existingUrls in form value so UI stays in sync
        const currentExisting = Array.isArray(v._existingUrls) ? v._existingUrls : [];
        const updatedExisting = currentExisting.filter((u: string) => u !== url);
        setValue(`variants.${variantIndex}._existingUrls` as any, updatedExisting, { shouldDirty: true, shouldValidate: false });
    };

    // Cleanup blob URLs
    useEffect(() => {
        return () => {
            imagePreviews.forEach(urls => urls.forEach(url => URL.revokeObjectURL(url)));
        };
    }, [imagePreviews]);

    const onSubmit = handleSubmit(async (vals) => {
        // Collect transient fields for server to know which old URLs to keep/remove.
        const existingUrls: string[][] = (getValues("variants") as any).map((v: any) => v._existingUrls ?? []);
        const removeUrls: string[][] = (getValues("variants") as any).map((v: any) => v._removeUrls ?? []);

        await onSave({ ...vals, _existingUrls: existingUrls, _removeUrls: removeUrls });
    });

    // Empty rows to append
    const emptyVariant: LaunchNewProductClientSchema["variants"][number] & { _existingUrls?: string[]; _removeUrls?: string[] } = {
        name: "",
        color: "#000000",
        stock: 0,
        images: [],
        priceWithoutDiscount: "",
        discount: "",
        _existingUrls: [],
        _removeUrls: [],
    };
    const emptySpecification: LaunchNewProductClientSchema["specifications"][number] = { label: "", value: "" };

    // Paragraph helpers
    const addDescPara = () => setDescParas(prev => [...prev, ""]);
    const removeDescPara = (idx: number) => setDescParas(prev => prev.filter((_, i) => i !== idx));
    const updateDescPara = (idx: number, val: string) => setDescParas(prev => prev.map((p, i) => (i === idx ? val : p)));

    const addReturnPara = () => setReturnParas(prev => [...prev, ""]);
    const removeReturnPara = (idx: number) => setReturnParas(prev => prev.filter((_, i) => i !== idx));
    const updateReturnPara = (idx: number, val: string) => setReturnParas(prev => prev.map((p, i) => (i === idx ? val : p)));

    const addWarrantyPara = () => setWarrantyParas(prev => [...prev, ""]);
    const removeWarrantyPara = (idx: number) => setWarrantyParas(prev => prev.filter((_, i) => i !== idx));
    const updateWarrantyPara = (idx: number, val: string) => setWarrantyParas(prev => prev.map((p, i) => (i === idx ? val : p)));


    const titlePrefix = initialValues.title.slice(0, 11);
    const titleSuffix = initialValues.title.slice(11, initialValues.title.length);


    return (
        <Form {...form}>
            <form onSubmit={onSubmit} className={cn("space-y-3  overflow-auto scrollbar-hide", className)}>
                {/* Header */}

                <h2 className="text-lg font-semibold text-gray-900 shine-effect -mt-1 zara uppercase tracking-wider underline underline-offset-4 lg:hidden">
                    Edit {titlePrefix}-
                    <br />
                    {
                        titleSuffix.length > 0 && `-${titleSuffix}`
                    }

                </h2>

                
                <h2 className="hidden lg:block text-lg font-semibold lg:text-2xl -mt-3 text-gray-900 shine-effect zara uppercase tracking-wider underline underline-offset-4">
                    Edit {initialValues.title}
                </h2>


                {/* Basic info */}
                <h1 className="text-left text-xl shine-effect font-semibold text-gray-700">Product Info</h1>
                <Separator />

                <>
                    {/* Title */}
                    <FormField
                        control={control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex justify-between">
                                    <FormLabel>Product Title</FormLabel>
                                    <FormMessage className="text-red-500" />
                                </div>
                                <FormControl>
                                    <input {...field} type="text" className="bg-white border border-[#dee2e7] rounded w-full p-2 shadow" />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    {/* Tag */}
                    <FormField
                        control={control}
                        name="tag"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Product Tag</FormLabel>
                                <FormControl>
                                    <input {...field} type="text" className="bg-white border border-[#dee2e7] rounded w-full p-2 shadow" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Category & Brand */}
                    <div className="flex flex-col space-y-5">
                        <FormField
                            control={control}
                            name="categoryName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Product Category</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="bg-white border-[#dee2e7] w-full">
                                                <SelectValue placeholder="Select a category" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="smart watches">Smart watches</SelectItem>
                                            <SelectItem value="earbuds">Earbuds</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={control}
                            name="brand"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Product Brand</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="bg-white border-[#dee2e7] w-full">
                                                <SelectValue placeholder="Select a brand" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="zero">Zero</SelectItem>
                                            <SelectItem value="dany">Dany</SelectItem>
                                            <SelectItem value="ronin">Ronin</SelectItem>
                                            <SelectItem value="audionic">Audionic</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Description */}
                    <FormField
                        control={control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Product Description</FormLabel>
                                <FormControl>
                                    <textarea {...field} rows={5} className="bg-white border border-[#dee2e7] rounded w-full p-2 shadow" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </>

                {/* Variants */}
                <Separator />
                <h1 className="text-left text-xl shine-effect font-semibold text-gray-700">Variants Info</h1>
                <p className="text-left font-light text-sm text-gray-600">At least one variant required</p>

                {variantFields.map((item, index) => (
                    <div key={item.id} className="space-y-3 border p-3 rounded relative">
                        {index > 0 && (
                            <button
                                type="button"
                                onClick={() => removeVariant(index)}
                                className="absolute -top-2 -right-2 flex items-center justify-center border border-red-400 size-6 bg-red-50 rounded-full"
                            >
                                <X className="w-4 h-4 text-red-400" />
                            </button>
                        )}

                        <h1 className="text-semibold zara text-xl text-left">{ordinalWords[index]} Variant</h1>

                        {/* Variant Name */}
                        <FormField
                            control={control}
                            name={`variants.${index}.name`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Variant Name</FormLabel>
                                    <FormControl>
                                        <input {...field} placeholder="Variant title" type="text" className="bg-white border border-[#dee2e7] rounded w-full p-2 shadow" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Color */}
                        <FormField
                            control={control}
                            name={`variants.${index}.color`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Color</FormLabel>
                                    <FormControl>
                                        <input
                                            {...field}
                                            type="color"
                                            value={field.value || "#000000"}
                                            onChange={(e) => field.onChange(e.target.value)}
                                            className="bg-white border border-[#dee2e7] rounded w-full p-2 shadow"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Stock */}
                        <FormField
                            control={control}
                            name={`variants.${index}.stock`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Stock</FormLabel>
                                    <FormControl>
                                        <input
                                            {...field}
                                            type="number"
                                            value={field.value ?? 0}
                                            onChange={(e) => field.onChange(e.currentTarget.valueAsNumber)}
                                            min={0}
                                            className="bg-white border border-[#dee2e7] rounded w-full p-2 shadow"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Price */}
                        <FormField
                            control={control}
                            name={`variants.${index}.priceWithoutDiscount`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Price (before discount)</FormLabel>
                                    <FormControl>
                                        <input
                                            {...field}
                                            type="number"
                                            value={field.value ?? ""}
                                            onChange={(e) => field.onChange(e.target.value)}
                                            className="bg-white border border-[#dee2e7] rounded w-full p-2 shadow"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Discount */}
                        <FormField
                            control={control}
                            name={`variants.${index}.discount`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Discount</FormLabel>
                                    <FormControl>
                                        <input
                                            {...field}
                                            type="number"
                                            min={0}
                                            max={100}
                                            value={field.value ?? ""}
                                            onChange={(e) => field.onChange(e.target.value)}
                                            className="bg-white border border-[#dee2e7] rounded w-full p-2 shadow"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Images: show existing previews + allow new uploads */}
                        <FormItem>
                            <FormLabel>Variant Images</FormLabel>
                            <FormControl>
                                <input type="file" multiple onChange={(e) => handleImageChange(e, index)} className="bg-white border border-[#dee2e7] rounded w-full p-2 shadow" />
                            </FormControl>
                            {imagePreviews[index] && imagePreviews[index].length > 0 && (
                                <div className="mt-2">
                                    <p className="text-sm text-gray-800">{imagePreviews[index].length} image(s)</p>
                                    <div className="flex flex-wrap gap-4 mt-2">
                                        {imagePreviews[index].map((src, i) => (
                                            <div key={i} className="relative size-15 rounded overflow-hidden">
                                                <img src={src} alt={`Preview ${i}`} className="w-full h-full object-cover" />
                                                {/* Uncomment to support removal of old URLs in edit: */}
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveExistingImage(index, src)}
                                                    className="absolute top-0 right-0 size-5 bg-red-200 rounded-full flex items-center justify-center"
                                                    title="Remove existing image"
                                                >
                                                    <X className="w-3 h-3 stroke-1 text-red-800" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </FormItem>
                    </div>
                ))}

                {/* Add variant */}
                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={() => appendVariant(emptyVariant)}
                        disabled={variantFields.length >= 5}
                        className="mt-2 border border-emerald-800 disabled:border-white bg-emerald-400 disabled:bg-white px-2 py-1 text-emerald-50 disabled:text-gray-800 rounded hover:bg-gray-700 text-sm"
                    >
                        {variantFields.length >= 5 ? "Variant Limit Met" : "Add another variant"}
                    </button>
                </div>

                {/* Specifications */}
                <Separator />
                <h1 className="text-left text-xl shine-effect font-semibold text-gray-700">Specifications Info</h1>
                <p className="text-left font-light text-sm text-gray-600">At least one specification required</p>

                {specificationFields.map((item, index) => (
                    <div key={item.id} className="space-y-3 border p-3 rounded relative">
                        {index > 0 && (
                            <button
                                type="button"
                                onClick={() => removeSpecification(index)}
                                className="absolute -top-2 -right-2 flex items-center justify-center border border-red-400 size-6 bg-red-50 rounded-full"
                            >
                                <X className="w-4 h-4 text-red-400" />
                            </button>
                        )}

                        <h1 className="text-semibold zara text-xl text-left">{ordinalWords[index]} Specification</h1>

                        <FormField
                            control={control}
                            name={`specifications.${index}.label`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Specification label</FormLabel>
                                    <FormControl>
                                        <input {...field} type="text" className="bg-white border border-[#dee2e7] rounded w-full p-2 shadow" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={control}
                            name={`specifications.${index}.value`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Specification value</FormLabel>
                                    <FormControl>
                                        <input {...field} type="text" className="bg-white border border-[#dee2e7] rounded w-full p-2 shadow" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                ))}

                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={() => appendSpecification(emptySpecification)}
                        disabled={specificationFields.length >= 10}
                        className="mt-2 border border-emerald-800 disabled:border-white bg-emerald-400 disabled:bg-white px-2 py-1 text-emerald-50 disabled:text-gray-800 rounded hover:bg-gray-700 text-sm"
                    >
                        {specificationFields.length >= 10 ? "Specification Limit Met" : "Add another specification"}
                    </button>
                </div>

                {/* Product Detail Description */}
                <Separator />
                <h1 className="text-left text-xl shine-effect font-semibold text-gray-700">Product Detailed Description Info</h1>
                <p className="text-left font-light text-sm text-gray-600">
                    At least one paragraph required
                    <br />
                    <span className="font-bold">
                        Minimum <span className="text-emerald-500">10</span> characters
                        <br />
                        Maximum <span className="text-emerald-500">100</span> characters
                    </span>
                </p>

                <div className="space-y-3 border p-3 rounded relative">
                    {descParas.map((para, idx) => (
                        <div key={idx} className="space-y-2">
                            <FormField
                                control={control}
                                name={`productDetailDescription.${idx}`}
                                render={({ field, fieldState, formState }) => (
                                    <FormItem>
                                        <FormLabel className="zara">{ordinalWords[idx] || `Paragraph #${idx + 1}`} Paragraph</FormLabel>
                                        <div className="relative">
                                            {idx > 0 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeDescPara(idx)}
                                                    aria-label={`Remove paragraph ${idx + 1}`}
                                                    className="absolute -top-2 -right-2 flex items-center justify-center border border-red-400 size-6 bg-red-50 rounded-full hover:bg-red-100"
                                                >
                                                    <X className="w-4 h-4 text-red-500" />
                                                </button>
                                            )}
                                            <FormControl>
                                                <textarea
                                                    {...field}
                                                    value={para}
                                                    onChange={(e) => {
                                                        field.onChange(e.target.value);
                                                        updateDescPara(idx, e.target.value);
                                                    }}
                                                    placeholder="paragraph"
                                                    className="bg-white border border-[#dee2e7] rounded w-full p-2 shadow"
                                                />
                                            </FormControl>
                                        </div>
                                        {(formState.isSubmitted || fieldState.isTouched) && fieldState.error ? <FormMessage /> : null}
                                    </FormItem>
                                )}
                            />
                            <div className="flex justify-end gap-2">
                                {idx === descParas.length - 1 && (
                                    <button
                                        type="button"
                                        onClick={addDescPara}
                                        disabled={descParas.length >= 3}
                                        className="mt-2 border border-emerald-800 disabled:border-white bg-emerald-400 disabled:bg-white px-2 py-1 text-emerald-50 disabled:text-gray-800 rounded hover:bg-gray-700 text-sm"
                                    >
                                        {descParas.length >= 3 ? "Paragraph Limit Met" : "Add another paragraph"}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Warranty */}
                <Separator />
                <h1 className="text-left text-xl shine-effect font-semibold text-gray-700">Warranty Details</h1>
                <p className="text-left font-light text-sm text-gray-600">
                    At least one paragraph required
                    <br />
                    <span className="font-bold">
                        Minimum <span className="text-emerald-500">10</span> characters
                        <br />
                        Maximum <span className="text-emerald-500">100</span> characters
                    </span>
                </p>

                <div className="space-y-3 border p-3 rounded relative">
                    {warrantyParas.map((para, idx) => (
                        <div key={idx} className="space-y-2">
                            <FormField
                                control={control}
                                name={`warrantyDetails.${idx}`}
                                render={({ field, fieldState, formState }) => (
                                    <FormItem>
                                        <FormLabel className="zara">{ordinalWords[idx] || `Paragraph #${idx + 1}`} Paragraph</FormLabel>
                                        <div className="relative">
                                            {idx > 0 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeWarrantyPara(idx)}
                                                    aria-label={`Remove warranty paragraph ${idx + 1}`}
                                                    className="absolute -top-2 -right-2 flex items-center justify-center border border-red-400 size-6 bg-red-50 rounded-full hover:bg-red-100"
                                                >
                                                    <X className="w-4 h-4 text-red-500" />
                                                </button>
                                            )}
                                            <FormControl>
                                                <textarea
                                                    {...field}
                                                    value={para}
                                                    onChange={(e) => {
                                                        field.onChange(e.target.value);
                                                        updateWarrantyPara(idx, e.target.value);
                                                    }}
                                                    placeholder="paragraph"
                                                    className="bg-white border border-[#dee2e7] rounded w-full p-2 shadow"
                                                />
                                            </FormControl>
                                        </div>
                                        {(formState.isSubmitted || fieldState.isTouched) && fieldState.error ? <FormMessage /> : null}
                                    </FormItem>
                                )}
                            />
                            <div className="flex justify-end gap-2">
                                {idx === warrantyParas.length - 1 && (
                                    <button
                                        type="button"
                                        onClick={addWarrantyPara}
                                        disabled={warrantyParas.length >= 3}
                                        className="mt-2 border border-emerald-800 disabled:border-white bg-emerald-400 disabled:bg-white px-2 py-1 text-emerald-50 disabled:text-gray-800 rounded hover:bg-gray-700 text-sm"
                                    >
                                        {warrantyParas.length >= 3 ? "Paragraph Limit Met" : "Add another paragraph"}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Return Policy */}
                <Separator />
                <h1 className="text-left text-xl shine-effect font-semibold text-gray-700">Return Policy Details</h1>
                <p className="text-left font-light text-sm text-gray-600">
                    At least one paragraph required
                    <br />
                    <span className="font-bold">
                        Minimum <span className="text-emerald-500">10</span> characters
                        <br />
                        Maximum <span className="text-emerald-500">100</span> characters
                    </span>
                </p>

                <div className="space-y-3 border p-3 rounded relative">
                    {returnParas.map((para, idx) => (
                        <div key={idx} className="space-y-2">
                            <FormField
                                control={control}
                                name={`returnPloicyDetails.${idx}`}
                                render={({ field, fieldState, formState }) => (
                                    <FormItem>
                                        <FormLabel className="zara">{ordinalWords[idx] || `Paragraph #${idx + 1}`} Paragraph</FormLabel>
                                        <div className="relative">
                                            {idx > 0 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeReturnPara(idx)}
                                                    aria-label={`Remove return policy paragraph ${idx + 1}`}
                                                    className="absolute -top-2 -right-2 flex items-center justify-center border border-red-400 size-6 bg-red-50 rounded-full hover:bg-red-100"
                                                >
                                                    <X className="w-4 h-4 text-red-500" />
                                                </button>
                                            )}
                                            <FormControl>
                                                <textarea
                                                    {...field}
                                                    value={para}
                                                    onChange={(e) => {
                                                        field.onChange(e.target.value);
                                                        updateReturnPara(idx, e.target.value);
                                                    }}
                                                    placeholder="paragraph"
                                                    className="bg-white border border-[#dee2e7] rounded w-full p-2 shadow"
                                                />
                                            </FormControl>
                                        </div>
                                        {(formState.isSubmitted || fieldState.isTouched) && fieldState.error ? <FormMessage /> : null}
                                    </FormItem>
                                )}
                            />
                            <div className="flex justify-end gap-2">
                                {idx === returnParas.length - 1 && (
                                    <button
                                        type="button"
                                        onClick={addReturnPara}
                                        disabled={returnParas.length >= 3}
                                        className="mt-2 border border-emerald-800 disabled:border-white bg-emerald-400 disabled:bg-white px-2 py-1 text-emerald-50 disabled:text-gray-800 rounded hover:bg-gray-700 text-sm"
                                    >
                                        {returnParas.length >= 3 ? "Paragraph Limit Met" : "Add another paragraph"}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="flex flex-col-reverse justify-end gap-5 border-t py-5">
                    <div className="flex justify-center">
                        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSaving} className="rounded-full! border-1 border-red-800 bg-red-100 w-[15%] ">
                            <X className="size-5 stroke-1 text-red-800" />
                        </Button>
                    </div>
                    <Button type="submit" disabled={isSaving || !isValid} className="rounded-[5px]! bg-gray-700 shine-effect text-white">
                        {isSaving ? (
                            <span className="inline-flex items-center gap-2">
                                <LoaderCircle className="w-4 h-4 animate-spin" /> Updating...
                            </span>
                        ) : (
                            "Update"
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
}


