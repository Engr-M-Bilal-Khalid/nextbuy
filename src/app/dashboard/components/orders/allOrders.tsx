"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { FaSquareWhatsapp } from "react-icons/fa6";

type Address = {
    city: string;
    phone: string;
    address: string;
    country: string;
    last_name: string;
    first_name: string;
    postal_code: string;
};

type OrderItem = {
    variantId: string;
    quantity: number;
    status: string;
    name: string;
    stock: number;
    images: string[];
    priceWithoutDiscount: string;
    discount: string;
    actualPrice: number;
    productTitle: string;
};

type Order = {
    orderId: string;
    cartId: string;
    paymentStatus: string;
    orderStatus: string;
    cod: boolean;
    billingSameAsShipping: boolean;
    shippingAddress: Address;
    billingAddress: Address;
    createdAt: string;
    items: OrderItem[];
};

export default function OrdersList() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);


    const message = "Hello! I want to place an order." // 👈 custom message

    const handleWhatsAppClick = (phoneNumber: string) => {
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
        window.open(url, "_blank") // open WhatsApp in new tab/app
    }

    useEffect(() => {
        async function fetchOrders() {
            try {
                const res = await fetch("/api/orders/allOrders"); // 👈 replace with your API endpoint
                const data = await res.json();

                if (data.success) {
                    // always wrap into array if single order comes
                    const normalizedOrders = Array.isArray(data.orders)
                        ? data.orders
                        : [data.orders];
                    setOrders(normalizedOrders);
                }
            } catch (error) {
                console.error("Failed to fetch orders", error);
            } finally {
                setLoading(false);
            }
        }

        fetchOrders();
    }, []);

    if (loading) return <p>Loading orders...</p>;

    if (orders.length === 0) return <p>No orders found.</p>;

    return (
        <div className="space-y-8">
            {orders.map((order, idx) => (
                <div
                    key={order.orderId}
                    className="border rounded-xl shadow-md p-6 bg-white"
                >
                    <h2 className="text-lg font-bold mb-2">
                        Order #{idx + 1} - {order.orderStatus.toUpperCase()}
                    </h2>
                    <p>
                        <strong>Order ID:</strong> {order.orderId}
                    </p>
                    <p>
                        <strong>Payment Status:</strong> {order.paymentStatus}
                    </p>
                    <p>
                        <strong>Created At:</strong>{" "}
                        {new Date(order.createdAt).toLocaleString()}
                    </p>

                    {/* Shipping Address */}
                    <div className="mt-4">
                        <h3 className="font-semibold">Shipping Address</h3>
                        <ul className="ml-4 list-disc">
                            <li>{order.shippingAddress.first_name} {order.shippingAddress.last_name}</li>
                            <li>{order.shippingAddress.address}</li>
                            <li>{order.shippingAddress.city}, {order.shippingAddress.country}</li>
                            <li>{order.shippingAddress.postal_code}</li>
                            <li>Phone: {order.shippingAddress.phone}</li>
                        </ul>
                    </div>

                    {/* Billing Address */}
                    <div className="mt-4">
                        <h3 className="font-semibold">Billing Address</h3>
                        <ul className="ml-4 list-disc">
                            <li>{order.billingAddress.first_name} {order.billingAddress.last_name}</li>
                            <li>{order.billingAddress.address}</li>
                            <li>{order.billingAddress.city}, {order.billingAddress.country}</li>
                            <li>{order.billingAddress.postal_code}</li>
                            <li onClick={() => handleWhatsAppClick(order.billingAddress.phone)} className="flex flex-rowcursor-pointer hover:underline hover:underline-offset-2 items-center">
                                <FaSquareWhatsapp className="size-7 mt-1 fill-emerald-500 z-10 text-white bg-transparent" /> <span>: {order.billingAddress.phone}</span>
                            </li>
                        </ul>
                    </div>

                    {/* Order Items */}
                    <div className="mt-4">
                        <h3 className="font-semibold">Items</h3>
                        <div className="space-y-4">
                            {order.items.map((item, i) => (
                                <div
                                    key={item.variantId + i}
                                    className="border rounded-lg p-4 flex gap-4 items-center"
                                >
                                    <img
                                        src={item.images[0]}
                                        alt={item.productTitle}
                                        className="w-20 h-20 object-cover rounded-md"
                                    />
                                    <div>
                                        <p className="font-medium">{item.productTitle}</p>
                                        <p>
                                            Variant: <span className="font-semibold">{item.name}</span>
                                        </p>
                                        <p>Quantity: {item.quantity}</p>
                                        <p>Price: ${item.actualPrice.toFixed(2)}</p>
                                        <p>Status: {item.status}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
