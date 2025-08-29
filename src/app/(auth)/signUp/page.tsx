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
import { signUpSchema } from "@/zodSchemas/authSchemas";
import { errorNotifier, successNotifier } from "@/lib/sonnerNotifications";




export default function Page() {

    const router = useRouter();
    //const { setAuth } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loginSuccess, setLoginSuccess] = useState(false);
    const [userId, setUserId] = useState<number>();
    const [userRole, setUserRole] = useState<string | null>(null);

    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            email: '',
            password: '',
            confirmPassword: ''
        },
    });

    const { formState: { isValid } } = form;

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };


    const onSubmit = async (values: z.infer<typeof signUpSchema>) => {
        try {
            setIsSubmitting(true);
            const response = await fetch('/api/signUp', { // Updated route path
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to sign up.');
            }
            successNotifier.notify("Account has been created successfully")
            form.reset();
            setIsSubmitting(false);
            router.replace(`/verifyEmail?email=${encodeURIComponent(values.email)}`);
        } catch (error: any) {
            console.error('Sign Up Error:', error);
            errorNotifier.notify(error)
        }
    };

    const socialsignUp = (provider: string) => {
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
            <div className="flex flex-col items-center justify-center lg:min-h-screen min-h-[90vh] lg:mt-0 space-y-2.5 prada tracking-wider">
                <img src="/logo/logoWatch.png" className="size-25 lg:size-30 rounded-[10px] bg-gradient-to-b from-gray-50 to-gray-200" />
                <h1 className="shine-text font-bold text-[#171918]">Store Name</h1>
                <p className="text-[#171918] text-[10px] lg:text-[14px]">Ready to begin? <span className="font-semibold shine-text">Create your account.</span></p>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 mt-1">
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
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex justify-between mt-1">
                                        <FormLabel className="text-[#171918]">Confirm Password</FormLabel>
                                        <FormMessage className="text-red-500 text-[10px]" />
                                    </div>
                                    <FormControl>
                                        <div className="relative">
                                            <input
                                                placeholder="Re-enter your password"
                                                {...field}
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                className=" bg-white text-[#171918] border-[#dee2e7] border-1 rounded-[5px] w-[100%] lg:w-100 p-2 shadow placeholder:text-[12px]  lg:placeholder:text-sm"
                                            />
                                            <button
                                                type="button"
                                                onClick={toggleConfirmPasswordVisibility}
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#171918]"
                                                title={showConfirmPassword ? 'Hide password' : 'Show password'}
                                            >
                                                {showConfirmPassword ? (
                                                    <Eye className="h-5 w-5 text-[#606060]" />
                                                ) : (
                                                    <EyeOff className="h-5 w-5 text-[#606060]" />
                                                )}
                                            </button>
                                        </div>
                                    </FormControl>
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
                            Sign up
                        </Button>
                        {/* --- Divider --- */}
                        <div className="flex items-center gap-3">
                            <hr className="flex-1 border-gray-300" />
                            <span className="text-gray-500 text-sm">Or continue with</span>
                            <hr className="flex-1 border-gray-300" />
                        </div>
                        <SocialAuthProviders socialSignIn={socialsignUp} />
                        <div className="flex items-center gap-3">
                            <hr className="flex-1 border-gray-300" />
                            <span className="text-gray-500 text-sm">Already have an account</span>
                            <hr className="flex-1 border-gray-300" />
                        </div>
                        <Link href="/signIn" className="text-blue-500 hover:underline text-sm flex justify-center">
                            Sign in
                        </Link>
                    </form>
                </Form>
            </div>
        </>
    )
}
