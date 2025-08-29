"use client"
import DiscountBanner from "@/components/home/DiscountBanner";
import Navbar from "@/components/home/Navbar";
import ResponsiveSearch from "@/components/home/ResponsiveSearch";
import "../../app/globals.css";

const placeholders = [
    "iPhone 15 Pro Max",
    "Samsung Galaxy S24 Ultra",
    "Sony WH-1000XM5 headphones",
    "MacBook Pro M3",
    "Amazon Echo Dot",
];
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => console.log(e.target.value);
const onSubmit = (e: React.FormEvent<HTMLFormElement>) => { e.preventDefault(); console.log("submitted"); };

export default function LayoutWrapperz() {
    return (
        <>
            <DiscountBanner />
            <Navbar placeholders={placeholders} onChange={handleChange} onSubmit={onSubmit} />
            <ResponsiveSearch placeholders={placeholders} onChange={handleChange} onSubmit={onSubmit} />
        </>
    );
}


export function ProfileNav() {
    return (
        <Navbar placeholders={placeholders} onChange={handleChange} onSubmit={onSubmit}/>
    )
}
