"use client";

import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { errorNotifier, successNotifier } from "@/lib/sonnerNotifications";
import QuantityCounter from "@/components/productsSpotLight/QuantityCounter";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { orderSchemaClient, OrderSchemaClient } from "@/zodSchemas/orderSchema";
import { confirmOrder } from "@/lib/orderHelpers";
import { useRouter } from "next/navigation";
import Link from "next/link";






const countryOptions = [
    { value: "Pakistan", label: "Pakistan" },
    // Add more countries as needed
];





const CheckoutPage = () => {
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isValid, isSubmitting },
    } = useForm<OrderSchemaClient>({
        resolver: zodResolver(orderSchemaClient),
        mode: "onChange",
        defaultValues: {
            contact: "",
            shipping_address: {
                country: "Pakistan",
                first_name: "",
                last_name: "",
                address: "",
                city: "",
                postal_code: "",
                phone: "",
            },
            billing_same_as_shipping: "true",
            billing_address: undefined,
            cod: true,
        },
    });


    const { fullCart, fetchCart, removeFromCart, updateQuantity } = useCart();

    let cartId = fullCart?.cart.cart_id;

    const billingSame = watch("billing_same_as_shipping");

    // const onSubmit: SubmitHandler<OrderSchemaClient> = async (data) => {
    //     try {
    //         const cartId = fullCart?.cart.cart_id;
    //         if (!cartId) {
    //             alert("No cart found");
    //             return;
    //         }

    //         const result = await confirmOrder(data, cartId);

    //         if (result.success) {
    //             alert("Order confirmed successfully!");
    //             // Redirect or clear form as needed
    //         } else {
    //             alert("Order confirmation failed");
    //         }
    //     } catch (error: any) {
    //         alert(error.message || "Unexpected error");
    //     }
    // };

    const router = useRouter();

    const onSubmit: SubmitHandler<OrderSchemaClient> = async (data) => {
        try {
            const cartId = fullCart?.cart.cart_id;
            if (!cartId) {
                errorNotifier.notify("No cart found");
                return;
            }

            const result = await confirmOrder(data, cartId);

            if (result.success) {
                successNotifier.notify("Order confirmed successfully!");
                router.push(`/thank-you?orderId=${result.data}`);
            } else {
                errorNotifier.notify(result.message || "Order confirmation failed");
            }
        } catch (error: any) {
            errorNotifier.notify(error.message || "Unexpected error occurred");
        }
    };



    // 🔹 Load cart when Navbar mounts
    useEffect(() => {
        fetchCart();
    }, []);

    const handleRemove = async (variantId: string, productName: string) => {
        try {
            await removeFromCart(variantId);
            successNotifier.notify(`Removed ${productName}`);
            fetchCart()
        } catch (error) {
            // Handle error or show failure notification here
            console.error("Failed to remove item", error);
        }
    };

    return (
        <div className="flex flex-col space-y-1 ">
            <div className="border-b-1 h-auto py-2 lg:py-5 lg:px-14 border-gray-200">
                <h1 className="lg:text-3xl text-gray-800 font-semibold tracking-widest">Al Nazeer Communication</h1>
            </div>
            <div className="flex flex-col lg:flex-row h-auto lg:h-[80vh] w-full space-x-5 space-y-5 ">
                <div className={`w-full lg:w-1/2 lg:px-8 lg:py-4 overflow-y-auto scrollbar-hide rounded `}>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 lg:space-y-6 bg-white lg:px-6 rounded ">
                        <h2 className="font-bold lg:text-xl lg:mb-4 text-gray-700">Contact</h2>
                        <input
                            {...register("contact")}
                            placeholder="Email or mobile phone number"
                            className="w-full rounded-[2px] border border-gray-200 p-2 text-gray-700 placeholder:text-gray-400"
                        />
                        {errors.contact && <span className="text-gray-700">{errors.contact.message}</span>}

                        <h2 className="font-bold lg:my-4 lg:text-xl text-gray-700">Shipping Address</h2>

                        <select
                            {...register("shipping_address.country")}
                            className="w-full border border-gray-200 rounded-[2px] p-2 text-gray-700 mb-2"
                        >
                            {countryOptions.map((opt) => (
                                <option value={opt.value} key={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>

                        <div className="flex gap-2 mb-2">
                            <input
                                {...register("shipping_address.first_name")}
                                placeholder="First name"
                                className="w-1/2 border border-gray-200 rounded-[2px] p-2 text-gray-700 placeholder:text-gray-400"
                            />
                            <input
                                {...register("shipping_address.last_name")}
                                placeholder="Last name"
                                className="w-1/2 border border-gray-200 rounded-[2px] p-2 text-gray-700 placeholder:text-gray-400"
                            />
                        </div>
                        {(errors.shipping_address?.first_name || errors.shipping_address?.last_name) && (
                            <div className="text-gray-700 mb-2">
                                {errors.shipping_address?.first_name?.message} {errors.shipping_address?.last_name?.message}
                            </div>
                        )}

                        <input
                            {...register("shipping_address.address")}
                            placeholder="Address"
                            className="w-full border border-gray-200 rounded-[2px] p-2 text-gray-700 placeholder:text-gray-400 mb-2"
                        />
                        {errors.shipping_address?.address && (
                            <span className="text-gray-700">{errors.shipping_address.address.message}</span>
                        )}

                        <div className="flex gap-2 mb-2">
                            <input
                                {...register("shipping_address.city")}
                                placeholder="City"
                                className="w-1/2 border border-gray-200 rounded-[2px] p-2 text-gray-700 placeholder:text-gray-400"
                            />
                            <input
                                {...register("shipping_address.postal_code")}
                                placeholder="Postal code"
                                className="w-1/2 border border-gray-200 rounded-[2px] p-2 text-gray-700 placeholder:text-gray-400"
                            />
                        </div>
                        {errors.shipping_address?.city && (
                            <span className="text-gray-700">{errors.shipping_address.city.message}</span>
                        )}

                        <input
                            {...register("shipping_address.phone")}
                            placeholder="Whatsapp Number"
                            className="w-full border border-gray-200 rounded-[2px] p-2 text-gray-700 placeholder:text-gray-400 mb-4"
                        />
                        {errors.shipping_address?.phone && (
                            <span className="text-gray-700">{errors.shipping_address.phone.message}</span>
                        )}

                        <h2 className="font-bold mb-2 text-gray-700">Billing Address</h2>

                        <div className="mb-4">
                            <label className="flex items-center space-x-3 cursor-pointer text-gray-700">
                                <input
                                    type="radio"
                                    {...register("billing_same_as_shipping")}
                                    value="true"
                                    checked={billingSame === "true"}
                                    onChange={() => setValue("billing_same_as_shipping", "true")}
                                    className="accent-gray-700"
                                />
                                <span>Same as shipping address</span>
                            </label>
                            <label className="flex items-center space-x-3 cursor-pointer text-gray-700 mt-2">
                                <input
                                    type="radio"
                                    {...register("billing_same_as_shipping")}
                                    value="false"
                                    checked={billingSame === "false"}
                                    onChange={() => setValue("billing_same_as_shipping", "false")}
                                    className="accent-gray-700"
                                />
                                <span>Use a different billing address</span>
                            </label>
                        </div>

                        {billingSame === "false" && (
                            <div className="border border-gray-300 rounded p-4 mb-4 bg-white">
                                <select
                                    {...register("billing_address.country")}
                                    className="w-full border border-gray-200 rounded-[2px] p-2 text-gray-700 mb-2"
                                >
                                    {countryOptions.map((opt) => (
                                        <option value={opt.value} key={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                                <div className="flex gap-2 mb-2">
                                    <input
                                        {...register("billing_address.first_name")}
                                        placeholder="First name"
                                        className="w-1/2 border border-gray-200 rounded-[2px] p-2 text-gray-700 placeholder:text-gray-400"
                                    />
                                    <input
                                        {...register("billing_address.last_name")}
                                        placeholder="Last name"
                                        className="w-1/2 border border-gray-200 rounded-[2px] p-2 text-gray-700 placeholder:text-gray-400"
                                    />
                                </div>
                                {(errors.billing_address?.first_name || errors.billing_address?.last_name) && (
                                    <div className="text-gray-700 mb-2">
                                        {errors.billing_address?.first_name?.message} {errors.billing_address?.last_name?.message}
                                    </div>
                                )}

                                <input
                                    {...register("billing_address.address")}
                                    placeholder="Address"
                                    className="w-full border border-gray-200 rounded-[2px] p-2 text-gray-700 placeholder:text-gray-400 mb-2"
                                />
                                {errors.billing_address?.address && (
                                    <span className="text-gray-700">{errors.billing_address.address.message}</span>
                                )}

                                <div className="flex gap-2 mb-2">
                                    <input
                                        {...register("billing_address.city")}
                                        placeholder="City"
                                        className="w-1/2 border border-gray-200 rounded-[2px] p-2 text-gray-700 placeholder:text-gray-400"
                                    />
                                    <input
                                        {...register("billing_address.postal_code")}
                                        placeholder="Postal code"
                                        className="w-1/2 border border-gray-200 rounded-[2px] p-2 text-gray-700 placeholder:text-gray-400"
                                    />
                                </div>
                                {errors.billing_address?.city && (
                                    <span className="text-gray-700">{errors.billing_address.city.message}</span>
                                )}

                                <input
                                    {...register("billing_address.phone")}
                                    placeholder="Whatsapp Number"
                                    className="w-full border border-gray-200 rounded-[2px] p-2 text-gray-700 placeholder:text-gray-400"
                                />
                                {errors.billing_address?.phone && (
                                    <span className="text-gray-700">{errors.billing_address.phone.message}</span>
                                )}
                            </div>
                        )}

                        <div className="flex items-center space-x-3 mb-4">
                            <input
                                type="checkbox"
                                {...register("cod")}
                                defaultChecked={true}
                                className="accent-gray-700 size-5 p-2"
                            />
                            <label className="text-gray-700">Cash on Delivery (COD)</label>
                        </div>
                        <div>
                            <Separator className="my-2"/>
                            <p>Now we offer only COD</p>
                        </div>

                        <button
                            type="submit"
                            disabled={!isValid || isSubmitting || fullCart?.items.length === 0}
                            className="w-full border-1 rounded-[5px] py-2 font-bold bg-gray-700 text-white tracking-widest lg:text-xl uppercase hover:border-gray-800 hover:bg-gray-100 hover:text-gray-800 transition duration-300 ease-in-out cursor-pointer disabled:bg-transparent disabled:text-gray-800 text-sm"
                        >
                            {
                                fullCart?.items.length !== 0
                                    ?
                                    isSubmitting ? <LoaderCircle className="animate-spin w-5 h-5 mx-auto" /> : "Complete order"
                                    :
                                    "Cart is empty!"
                            }
                        </button>
                    </form>
                </div>
                <Separator className="lg:hidden"/>
                <div className={`w-full lg:w-1/2 lg:px-8 lg:py-4 overflow-y-auto scrollbar-hide  rounded `}>
                    <h2 className="font-bold text-xl  text-gray-700">Order Details</h2>
                    <div>
                        {
                            !fullCart
                                ? <div>Loading cart...</div>
                                : fullCart.items.length === 0
                                    ?
                                    <div className="flex flex-col space-y-3 items-center justify-center h-full min-h-[200px]">
                                        <img
                                            src="/assets/emptycart.png"
                                            alt="Empty cart"
                                            width={290}
                                            height={290}
                                            className=""
                                        />
                                        <p className="text-gray-600">Oops! Your cart is empty</p>
                                        <button
                                            className="w-full border-1 rounded-[5px] py-2 font-bold bg-gray-700 text-white tracking-widest text-sm lg:text-xl  hover:border-gray-800 hover:bg-gray-100 hover:text-gray-800 transition duration-300 ease-in-out cursor-pointer"
                                        >
                                            <Link href="/">Shop Now</Link>
                                        </button>
                                    </div>

                                    : (
                                        <ul className="flex flex-col space-y-5 p-4 overflow-y-auto scrollbar-hide">
                                            {fullCart.items.map(item => (
                                                <div key={item.item_id}>
                                                    <li
                                                        key={item.item_id}
                                                        className="relative border-1 flex flex-row space-x-3 border-gray-200 rounded-[3px] py-2 px-2 items-center"
                                                    >
                                                        <div
                                                            className={cn(`cursor-pointer absolute -right-6 -top-3 bg-red-50 w-6 h-6 rounded-full border border-red-600 flex justify-center items-center transition-color duration-300 ease-in-out 
  hover:bg-red-600 hover:text-white hover:border-red-600 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-400`, isSubmitting && 'hidden')}
                                                            title="Remove from cart"
                                                            onClick={() => handleRemove(item.variant_id, item.product_name)}
                                                        >
                                                            <X className="stroke-1 size-4" />
                                                        </div>

                                                        <div className="flex  rounded-[2px] border-1  border-gray-200 shadow-accent w-[100px] h-[100px] p-1">
                                                            <img src={item.firstimage} alt={item.product_name} width={100} className="object-cover" />
                                                        </div>
                                                        <div className="flex flex-col space-y-0.25">
                                                            <p className="prada text-sm lg:text-[16px] font-bold text-gray-700 shine-text tracking-wide">{item.product_name}</p>
                                                            <p className="text-gray-800 text-sm lg:text-[16px] prada tracking-wide">Color : {item.name}</p>
                                                            <p className="text-gray-700 flex flex-row space-x-3 text-sm lg:text-[16px]">
                                                                <del>Rs: {item.price_without_discount}</del>
                                                                <span className='text-gray-900  font-bold'>
                                                                    Rs: {(parseFloat(item.price_without_discount) * (1 - Number(item.discount) / 100)).toFixed(2)}
                                                                </span>
                                                            </p>
                                                            <QuantityCounter
                                                                stock={10}
                                                                initialQuantity={item.quantity}
                                                                onChange={(qty) => updateQuantity(item.variant_id, qty)}
                                                                className="ml-0"
                                                                inputClassName="w-10 text-center placeholder:text-red-900 border rounded text-gray-900 font-normal"
                                                            />
                                                        </div>
                                                    </li>
                                                </div>
                                            ))}
                                        </ul>
                                    )
                        }
                    </div>

                </div>
            </div>
            <div className="border-t-1 mt-2 lg:mt-0 h-auto py-2 lg:py-5 lg:px-14 border-gray-200">
                <h1 className="lg:text-3xl text-gray-800 font-semibold tracking-widest">Al Nazeer Communication</h1>
            </div>
        </div>
    );
};

export default CheckoutPage;
