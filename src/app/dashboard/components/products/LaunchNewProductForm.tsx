"use client"
import '@/app/style.css'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { LaunchNewProductClientSchema, launchNewProductClientSchema } from "@/zodSchemas/productSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoaderCircle, X } from "lucide-react"
import { useEffect, useRef, useState } from 'react'
import { useFieldArray, useForm } from "react-hook-form"
import z from "zod"
import { errorNotifier, successNotifier } from "@/lib/sonnerNotifications"
import { deepStringify } from '@/lib/deepStringify'




export default function LaunchNewProductForm({ className }: { className?: string }) {

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imagePreviews, setImagePreviews] = useState<string[][]>([[]]); // State to hold image URLs for previews

    const form = useForm<LaunchNewProductClientSchema>({
        resolver: zodResolver(launchNewProductClientSchema),
        mode: "onBlur",
        reValidateMode: "onBlur",
        defaultValues: {
            title: '',
            tag: '',
            categoryName: undefined,
            brand: undefined,
            description: '',
            variants: [
                {
                    name: "",
                    color: "",
                    stock: 0,
                    priceWithoutDiscount: "",
                    discount: "",
                    images: [],
                },
            ],
            specifications: [{
                label: "",
                value: ""
            }],
            productDetailDescription: [""],
            returnPloicyDetails: [""],
            warrantyDetails: [""]
        },
    });

    const { control, formState: { isValid }, setValue } = form;

    const {
        fields: variantFields,
        append: appendVariant,
        remove: removeVariant,
    } = useFieldArray({
        control,
        name: "variants",
    });

    const emptyVariant: LaunchNewProductClientSchema["variants"][number] = {
        name: "",
        color: "",
        stock: 0,
        images: [],
        priceWithoutDiscount: "",
        discount: "",
    };


    const {
        fields: specificationFields,
        append: appendSpecification,
        remove: removeSpecification,
    } = useFieldArray({
        control,
        name: "specifications",
    });

    const emptySpecification: LaunchNewProductClientSchema["specifications"][number] = {
        label: "",
        value: ""
    };

    //Product Detailed Description Paragraph Start
    const [descParas, setDescParas] = useState<string[]>(
        form.getValues("productDetailDescription") ?? [""]
    );
    const firstSyncRef = useRef(true);

    useEffect(() => {
        if (firstSyncRef.current) {
            firstSyncRef.current = false;
            // Only set without validation on first mount
            form.setValue("productDetailDescription", descParas, {
                shouldDirty: false,
                shouldValidate: false,
            });
            return;
        }

        form.setValue("productDetailDescription", descParas, {
            shouldDirty: true,
            shouldValidate: false, // <-- don't validate here
        });
    }, [descParas, form]);

    const addDescPara = () => setDescParas((prev) => [...prev, ""]);
    const removeDescPara = (idx: number) =>
        setDescParas((prev) => prev.filter((_, i) => i !== idx));
    const updateDescPara = (idx: number, val: string) =>
        setDescParas((prev) => prev.map((p, i) => (i === idx ? val : p)));
    //Product Detailed Description Paragraph End

    //Return Policy Paragraph Start
    const [returnParas, setReturnParas] = useState<string[]>(
        form.getValues("returnPloicyDetails") ?? [""]
    );
    const firstSyncReturnRef = useRef(true);

    useEffect(() => {
        if (firstSyncReturnRef.current) {
            firstSyncReturnRef.current = false;
            form.setValue("returnPloicyDetails", returnParas, {
                shouldDirty: false,
                shouldValidate: false,
            });
            return;
        }
        form.setValue("returnPloicyDetails", returnParas, {
            shouldDirty: true,
            shouldValidate: false,
        });
    }, [returnParas, form]);

    const addReturnPara = () => setReturnParas((prev) => [...prev, ""]);
    const removeReturnPara = (idx: number) =>
        setReturnParas((prev) => prev.filter((_, i) => i !== idx));
    const updateReturnPara = (idx: number, val: string) =>
        setReturnParas((prev) => prev.map((p, i) => (i === idx ? val : p)));

    //Return Policy Paragraph End

    //Warranty Paragraph Start
    const [warrantyParas, setWarrantyParas] = useState<string[]>(
        form.getValues("warrantyDetails") ?? [""]
    );
    const firstSyncWarrantyRef = useRef(true);

    useEffect(() => {
        if (firstSyncWarrantyRef.current) {
            firstSyncWarrantyRef.current = false;
            form.setValue("warrantyDetails", warrantyParas, {
                shouldDirty: false,
                shouldValidate: false,
            });
            return;
        }
        form.setValue("warrantyDetails", warrantyParas, {
            shouldDirty: true,
            shouldValidate: false,
        });
    }, [warrantyParas, form]);

    const addWarrantyPara = () => setWarrantyParas((prev) => [...prev, ""]);
    const removeWarrantyPara = (idx: number) =>
        setWarrantyParas((prev) => prev.filter((_, i) => i !== idx));
    const updateWarrantyPara = (idx: number, val: string) =>
        setWarrantyParas((prev) => prev.map((p, i) => (i === idx ? val : p)));

    //Warranty Paragraph End

    const handleImageChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        index: number
    ) => {
        const files = e.target.files ? Array.from(e.target.files) : [];
        const urls = files.map(file => URL.createObjectURL(file));

        // Update form value with file objects
        setValue(`variants.${index}.images`, files as any);

        // Update local state for previews
        const newImagePreviews = [...imagePreviews];
        newImagePreviews[index] = urls;
        setImagePreviews(newImagePreviews);
    };

    const handleRemoveImage = (variantIndex: number, imageIndex: number) => {
        // Remove from previews
        const newImagePreviews = [...imagePreviews];
        newImagePreviews[variantIndex] = newImagePreviews[variantIndex].filter((_, i) => i !== imageIndex);
        setImagePreviews(newImagePreviews);

        // Remove from actual form files
        const currentFiles = (form.getValues(`variants.${variantIndex}.images`) || []) as File[];
        const updatedFiles = currentFiles.filter((_, i) => i !== imageIndex);
        setValue(`variants.${variantIndex}.images`, updatedFiles as any);
    };

    // Cleanup object URLs to prevent memory leaks
    useEffect(() => {
        return () => {
            imagePreviews.forEach(urls => {
                urls.forEach(url => URL.revokeObjectURL(url));
            });
        };
    }, [imagePreviews]);

    const onSubmit = async (values: LaunchNewProductClientSchema) => {
        setIsSubmitting(true);

        const launchProduct = async () => {
            const fd = new FormData();

            // Scalars
            fd.append("title", values.title);
            fd.append("tag", values.tag);
            fd.append("categoryName", values.categoryName);
            fd.append("brand", values.brand);
            fd.append("description", values.description);

            // Arrays of paragraphs
            values.productDetailDescription.forEach((p, i) => fd.append(`productDetailDescription[${i}]`, p));
            values.returnPloicyDetails.forEach((p, i) => fd.append(`returnPloicyDetails[${i}]`, p));
            values.warrantyDetails.forEach((p, i) => fd.append(`warrantyDetails[${i}]`, p));

            // Specifications
            values.specifications.forEach((s, i) => {
                fd.append(`specifications[${i}][label]`, s.label);
                fd.append(`specifications[${i}][value]`, s.value);
            });

            // Variants (scalars + files)
            values.variants.forEach((v, vi) => {
                fd.append(`variants[${vi}][name]`, v.name);
                fd.append(`variants[${vi}][color]`, v.color);
                fd.append(`variants[${vi}][stock]`, String(v.stock));
                fd.append(`variants[${vi}][priceWithoutDiscount]`, v.priceWithoutDiscount);
                if (v.discount != null) fd.append(`variants[${vi}][discount]`, v.discount);
                (v.images || []).forEach((file, fi) => {
                    fd.append(`variants[${vi}][images][${fi}]`, file, file.name);
                });
            });

            try {
                // Send
                const res = await fetch("/api/dashboard/products/createProduct", {
                    method: "POST",
                    body: fd, // no Content-Type header (browser will set boundary)
                });



                if (res.status === 400 || res.status === 401 || res.status === 403 || res.status === 500) {
                    errorNotifier.notify("Successfull");
                    setIsSubmitting(false);
                    return;
                }


                if (res.status === 200 || res.status === 201) {
                    const data = await res.json();
                    successNotifier.notify(data.productId);
                    setIsSubmitting(false);
                    alert(deepStringify(values))
                    return;
                }

                errorNotifier.notify("error");
                setIsSubmitting(false);
            } catch (error) {
                errorNotifier.notify("Network error");
                setIsSubmitting(false);
            }
        }

        launchProduct()
    }


    const ordinalWords = [
        "First",
        "Second",
        "Third",
        "Fourth",
        "Fifth",
        // Add more as needed
    ];

    let a = 1

    return (
        <Form {...form} key={a++}>
            <form onSubmit={form.handleSubmit(onSubmit)} className={cn("space-y-3 mt-1 overflow-auto scrollbar-hide", className)}>

                {/* Basic info Start*/}

                <h1 className="text-left text-xl shine-effect font-semibold text-gray-700">Product Info</h1>
                <Separator />

                <>
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex justify-between">
                                    <FormLabel>Product Title</FormLabel>
                                    <FormMessage className="text-red-500" />
                                </div>
                                <FormControl>
                                    <input
                                        placeholder="Product title"
                                        {...field}
                                        type="text"
                                        className="bg-white border border-[#dee2e7] rounded w-full p-2 shadow"
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    {/* Tag */}
                    <FormField
                        control={form.control}
                        name="tag"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Product Tag</FormLabel>
                                <FormControl>
                                    <input
                                        placeholder="Product Tag"
                                        {...field}
                                        type="text"
                                        className="bg-white border border-[#dee2e7] rounded w-full p-2 shadow"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Category & Brand */}
                    <div className="flex flex-col space-y-5">
                        <FormField
                            control={form.control}
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
                            control={form.control}
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
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Product Description</FormLabel>
                                <FormControl>
                                    <textarea
                                        placeholder="Product Description"
                                        {...field}
                                        rows={5}
                                        className="bg-white border border-[#dee2e7] rounded w-full p-2 shadow"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </>

                {/* Basic info End*/}

                {/* Varinats info Start*/}

                <Separator />
                <h1 className="text-left text-xl shine-effect font-semibold text-gray-700">Variants Info</h1>
                <p className="text-left font-light text-sm text-gray-600">At least one variant required</p>

                {variantFields.map((item, index) => (

                    <>
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

                            <>
                                <h1 className='text-semibold zara text-xl text-left'>
                                    {ordinalWords[index]} Variant
                                </h1>
                                {/* Variant Name */}
                                <FormField
                                    control={control}
                                    name={`variants.${index}.name`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Variant Name</FormLabel>
                                            <FormControl>
                                                <input
                                                    {...field}
                                                    placeholder="Variant title"
                                                    type="text"
                                                    className="bg-white border border-[#dee2e7] rounded w-full p-2 shadow"
                                                />
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

                                {/* Images */}
                                <FormField
                                    control={control}
                                    name={`variants.${index}.images`}
                                    render={() => (
                                        <FormItem>
                                            <FormLabel>Variant Images</FormLabel>
                                            <FormControl>
                                                <input
                                                    type="file"
                                                    multiple
                                                    onChange={(e) => handleImageChange(e, index)}
                                                    className="bg-white border border-[#dee2e7] rounded w-full p-2 shadow"
                                                />
                                            </FormControl>
                                            <FormMessage />

                                            {imagePreviews[index] && imagePreviews[index].length > 0 && (
                                                <div className="mt-2">
                                                    <p className="text-sm text-gray-800  zara">
                                                        {imagePreviews[index].length} file(s) selected
                                                    </p>
                                                    <div className="flex flex-wrap gap-4 mt-2">
                                                        {imagePreviews[index].map((src, i) => (
                                                            <div key={i} className="border-1 border-gray-800 z-10 relative size-15  rounded overflow-hidden">
                                                                <img src={src} alt={`Preview ${i}`} className="w-full h-full object-cover" />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleRemoveImage(index, i)}
                                                                    className="z-10  size-5 absolute top-0 right-0 text-red-900 bg-gray-200 rounded-full hover:bg-red-600 flex justify-center items-center "
                                                                >
                                                                    <X className="z-10  size-4 stroke-3" />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </FormItem>
                                    )}
                                />
                            </>


                        </div>
                        {
                            index === variantFields.length - 1 &&
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => appendVariant(emptyVariant)}
                                    disabled={variantFields.length >= 5}
                                    className="mt-2 border border-emerald-800 disabled:border-white bg-emerald-400 disabled:bg-white px-2 py-1 text-emerald-50 disabled:text-gray-800 rounded hover:bg-gray-700 text-sm"
                                >
                                    {
                                        variantFields.length >= 5
                                            ?
                                            "Variant Limit Met"
                                            :
                                            "Add another variant"
                                    }
                                </button>
                            </div>

                        }
                    </>
                ))}

                {/* Varinats info End*/}

                {/* Specification info Start*/}

                <Separator />
                <h1 className="text-left text-xl shine-effect font-semibold text-gray-700">Specifications Info</h1>
                <p className="text-left font-light text-sm text-gray-600">At least one specification required</p>

                {specificationFields.map((item, index) => (
                    <>
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
                            <h1 className='text-semibold zara text-xl text-left'>
                                {ordinalWords[index]} Specification
                            </h1>
                            <FormField
                                control={control}
                                name={`specifications.${index}.label`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Specfication label</FormLabel>
                                        <FormControl>
                                            <input
                                                {...field}
                                                placeholder="Specification label"
                                                type="text"
                                                className="bg-white border border-[#dee2e7] rounded w-full p-2 shadow"
                                            />
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
                                        <FormLabel>Specification Value</FormLabel>
                                        <FormControl>
                                            <input
                                                {...field}
                                                placeholder="Specification value"
                                                type="text"
                                                className="bg-white border border-[#dee2e7] rounded w-full p-2 shadow"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        {
                            index === specificationFields.length - 1 &&
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => appendSpecification(emptySpecification)}
                                    disabled={specificationFields.length >= 10}
                                    className="mt-2 border border-emerald-800 disabled:border-white bg-emerald-400 disabled:bg-white px-2 py-1 text-emerald-50 disabled:text-gray-800 rounded hover:bg-gray-700 text-sm"
                                >
                                    {
                                        specificationFields.length >= 10
                                            ?
                                            "Specification Limit Met"
                                            :
                                            "Add another specification"
                                    }
                                </button>
                            </div>

                        }
                    </>
                ))}

                {/* Specification info End*/}

                {/* Product Detail Description info Start*/}

                <Separator />
                <h1 className="text-left text-xl shine-effect font-semibold text-gray-700">Product Detailed Description Info</h1>
                <p className="text-left font-light text-sm text-gray-600">At least one paragraph required<br /> <span className='font-bold'>Minimum <span className='text-emerald-500'>10</span> characters <br />Maximum <span className='text-emerald-500'>100</span> characters</span></p>

                <div className="space-y-3 border p-3 rounded relative">
                    {descParas.map((para, idx) => (
                        <div key={idx} className="space-y-2">
                            <FormField
                                control={control}
                                name={`productDetailDescription.${idx}`}
                                render={({ field, fieldState, formState }) => (
                                    <FormItem>
                                        <FormLabel className='zara'>{ordinalWords[idx]} Paragraph </FormLabel>
                                        {/* Wrapper to anchor the absolute remove button */}
                                        <div className="relative">
                                            {/* Remove button (hidden for first item) */}
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
                                        {/* Optional: gate error display */}
                                        {(formState.isSubmitted || fieldState.isTouched) && fieldState.error ? (
                                            <FormMessage />
                                        ) : null}
                                    </FormItem>
                                )}
                            />
                            {/* Add button only on the last paragraph row (keep your existing logic if you like) */}
                            <div className="flex justify-end gap-2">
                                {idx === descParas.length - 1 && (
                                    <button
                                        type="button"
                                        onClick={addDescPara}
                                        disabled={descParas.length >= 3}

                                        className="mt-2 border border-emerald-800 disabled:border-white bg-emerald-400 disabled:bg-white px-2 py-1 text-emerald-50 disabled:text-gray-800 rounded hover:bg-gray-700 text-sm"
                                    >
                                        {
                                            descParas.length >= 3
                                                ?
                                                "Paragraph Limit Met"
                                                :
                                                "Add another paragraph"
                                        }
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Product Detail Description info End*/}

                {/* Warranty info Start */}

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
                                        <FormLabel className="zara">{ordinalWords[idx]} Paragraph</FormLabel>
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
                                        {(formState.isSubmitted || fieldState.isTouched) && fieldState.error ? (
                                            <FormMessage />
                                        ) : null}
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


                {/* Warranty info End */}

                {/* Return Policy Start */}

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
                                        <FormLabel className="zara">{ordinalWords[idx]} Paragraph</FormLabel>
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
                                        {(formState.isSubmitted || fieldState.isTouched) && fieldState.error ? (
                                            <FormMessage />
                                        ) : null}
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

                {/* Return Policy  End */}


                <Button
                    type="submit"
                    disabled={!isValid}
                    className="w-full rounded shadow border border-[#dee2e7] bg-gray-700 text-white"
                >
                    {isSubmitting ? <LoaderCircle className="w-4 h-4 animate-spin" /> : "Launch"}
                </Button>
            </form>
        </Form>
    )
}
