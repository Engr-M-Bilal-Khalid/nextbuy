import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
    const cookieStore = await cookies();
    //1st method
    // cookieStore.set({
    //     name: "signInToken",
    //     value: "",
    //     path: "/",
    //     httpOnly: true,
    //     maxAge: 0, // Immediately expire the cookie
    //     secure: process.env.NODE_ENV === "production",
    //     sameSite: "lax",
    // });
    //2nd method
    cookieStore.delete("signInToken");

    return NextResponse.json({ message: "Logged out successfully" }, { status: 200 });
}
