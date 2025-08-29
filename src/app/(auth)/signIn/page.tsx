"use client"
import SocialAuthProviders from "@/components/auth/SocialLogInProviders";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, HomeIcon, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import '../../style.css';
import { signInSchema } from "@/zodSchemas/authSchemas";
import { errorNotifier, successNotifier } from "@/lib/sonnerNotifications";
import { useAuth } from "@/context/AuthContext";


export default function Page() {
    const router = useRouter();
    const { setAuth } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loginSuccess, setLoginSuccess] = useState(false);


    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const { formState: { isValid } } = form;

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const onSubmit = async (values: z.infer<typeof signInSchema>) => {
        setIsSubmitting(true);
        try {
            const res = await fetch("/api/signIn", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });

            const data = await res.json().catch(() => ({} as any));
            const message = data?.message || "Unexpected response";

            if (res.status === 400 || res.status === 401 || res.status === 403 || res.status === 500) {
                errorNotifier.notify(message);
                setIsSubmitting(false);
                return;
            }


            if (res.status === 200 || res.status === 201) {
                const user = data?.user;
                if (!user || typeof user.roleId !== "number" || typeof user.user_id !== "number") {
                    errorNotifier.notify("Malformed response");
                    setIsSubmitting(false);
                    return;
                }

                setAuth(user.user_id, user.roleId);

                successNotifier.notify(message || "Login successful");
                setLoginSuccess(true);
                setIsSubmitting(false);

                if (user.roleId === 1) {
                    router.replace("/dashboard");
                } else if (user.roleId === 2) {
                    router.replace("/");
                } else {
                    router.replace("/");
                }
                return;
            }

            errorNotifier.notify(message);
            setIsSubmitting(false);
        } catch (err: any) {
            errorNotifier.notify(err?.message || "Network error");
            setIsSubmitting(false);
        }
    };


    const socialSignIn = (provider: string) => {
        switch (provider) {
            case 'google':
                alert(`Google sign-in`);
                break;
            case 'facebook':
                alert(`Facebook sign-in`);
                break;
            case 'instagram':
                alert(`Instagram sign-in`);
                break;
            case 'tiktok':
                alert(`Tiktok sign-in`);
                break;
            case 'linkedIn':
                alert(`LinkedIn sign-in`);
                break;
            default:
                alert(`Google sign-in`);
                break;
        }
    }

    return (
        <>
            <div className="absolute top-11 left-[42px] lg:top-5" title="Go to Home -->">
                <Link href="/"><HomeIcon className="size-5 text-[#171918] cursor-pointer" /></Link>
            </div>
            <div className="flex flex-col items-center justify-center lg:min-h-screen min-h-[90vh] lg:mt-0 space-y-4 prada tracking-wider">
                <img src="/logo/logoWatch.png" className="size-25 lg:size-30 rounded-[10px] bg-gradient-to-b from-gray-50 to-gray-200" />
                <h1 className="shine-text font-bold text-[#171918]">Store Name</h1>
                <p className="text-[#171918] text-[10px] lg:text-[14px]">Your account is waiting. Let's get you <span className="shine-text font-bold">signed in.</span></p>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 mt-1">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex justify-between">
                                        <FormLabel className="text-[#171918]">Email</FormLabel>
                                        <FormMessage className="text-red-500" />
                                    </div>
                                    <FormControl>
                                        <input
                                            placeholder="Enter your email"
                                            {...field}
                                            type="email"
                                            className="bg-white text-[#171918] border-[#dee2e7] border-1 rounded-[5px] w-[100%] lg:w-full p-2 shadow mr-10 placeholder:text-[12px] lg:placeholder:text-sm"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex justify-between mt-1">
                                        <FormLabel className="text-[#171918]">Password</FormLabel>
                                        <FormMessage className="text-red-500 text-[10px]" />
                                    </div>
                                    <FormControl>
                                        <div className="relative">
                                            <input
                                                placeholder="Enter your password"
                                                {...field}
                                                type={showPassword ? 'text' : 'password'}
                                                className=" bg-white text-[#171918] border-[#dee2e7] border-1 rounded-[5px] w-[100%] lg:w-100 p-2 shadow placeholder:text-[12px]  lg:placeholder:text-sm"
                                            />
                                            <button
                                                type="button"
                                                onClick={togglePasswordVisibility}
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#171918]"
                                                title={showPassword ? 'Hide password' : 'Show password'}
                                            >
                                                {showPassword ? (
                                                    <Eye className="h-5 w-5 text-[#606060]" />
                                                ) : (
                                                    <EyeOff className="h-5 w-5 text-[#606060]" />
                                                )}
                                            </button>
                                        </div>
                                    </FormControl>
                                    <Link href="/forgotPassword" className="text-right text-blue-500 hover:underline text-sm">
                                        Forgot Password
                                    </Link>

                                </FormItem>
                            )}
                        />
                        <Button
                            type="submit"
                            disabled={!isValid}
                            className="w-full rounded-[5px] shadow-2xs tracking-wider border border-[#dee2e7] bg-[#171918] shine-effect"
                        >
                            {
                                isSubmitting
                                    ?
                                    <LoaderCircle className="w-4 h-4 text-white animate-spin" />
                                    :
                                    null
                            }
                            Sign in
                        </Button>
                        {/* --- Divider --- */}
                        <div className="flex items-center gap-3">
                            <hr className="flex-1 border-gray-300" />
                            <span className="text-gray-500 text-sm">Or continue with</span>
                            <hr className="flex-1 border-gray-300" />
                        </div>
                        <SocialAuthProviders socialSignIn={socialSignIn} />
                        <div className="flex items-center gap-3">
                            <hr className="flex-1 border-gray-300" />
                            <span className="text-gray-500 text-sm">Do not have an account</span>
                            <hr className="flex-1 border-gray-300" />
                        </div>
                        <Link href="/signUp" className="text-blue-500 hover:underline text-sm flex justify-center">
                            Sign up
                        </Link>
                    </form>
                </Form>
            </div>
        </>
    )
}
