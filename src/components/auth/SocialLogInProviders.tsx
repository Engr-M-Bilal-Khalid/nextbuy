"use client"
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FaTiktok } from "react-icons/fa";
import { FaFacebookF, FaLinkedinIn, FaSquareInstagram } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import '@/app/style.css';


interface SocialAuthProvidersProps {
    socialSignIn: (provider: string) => void
}

export default function SocialAuthProviders({ socialSignIn }: SocialAuthProvidersProps) {
    const buttonClasses =
        "size-12 rounded-full p-2 flex justify-center items-center cursor-pointer transition-all duration-500 ease-in-out hover:scale-105";

    return (
        <>
            {/* --- Social Login Buttons --- */}
            <div className="flex flex-row justify-between lg:w-100 w-full">
                {/* Google */}
                <button
                    type="button"
                    className={cn(
                        buttonClasses,
                        "border border-gray-300 text-[#171918] bg-white"
                    )}
                    onClick={() => socialSignIn("google")}
                >
                    <FcGoogle className="size-4" />
                </button>

                {/* Facebook */}
                <button
                    type="button"
                    className={cn(buttonClasses, "text-white bg-[#0086ff]")}
                    onClick={() => socialSignIn("facebook")}
                >
                    <FaFacebookF className="size-4" />
                </button>

                {/* Instagram */}
                <Button
                    type="button"
                    className={cn(buttonClasses, "bg-instagram-gradient text-white")}
                    onClick={() => socialSignIn("instagram")}
                >
                    <FaSquareInstagram className="size-4" />
                </Button>

                {/* TikTok */}
                <button
                    type="button"
                    className={cn(
                        buttonClasses,
                        " text-white bg-black"
                    )}
                    onClick={() => socialSignIn("tiktok")}
                >
                    <FaTiktok className="size-4" />
                </button>

                {/* LinkedIn */}
                <button
                    type="button"
                    className={cn(
                        buttonClasses,
                        " text-white bg-[#0073b2]"
                    )}
                    onClick={() => socialSignIn("linkedIn")}
                >
                    <FaLinkedinIn className="size-4" />
                </button>
            </div>
        </>
    );
}