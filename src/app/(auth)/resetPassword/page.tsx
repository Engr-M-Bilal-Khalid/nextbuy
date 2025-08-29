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


export default function Page() {
    const router = useRouter();
    //const { setAuth } = useAuth();
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loginSuccess, setLoginSuccess] = useState(false);
    const [userId, setUserId] = useState<number>();
    const [userRole, setUserRole] = useState<string | null>(null);

    const resetPasswordSchema = z.object({
        newPassword: z.string()
            .min(8, {
                message: 'Password must be exactly 8 characters.',
            })
            .max(8, {
                message: 'Password must be exactly 8 characters.',
            })
            .regex(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8}$/), {
                message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
            }),
        confirmNewPassword: z.string(),
    }).refine(data => data.newPassword === data.confirmNewPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    }
    );
    const form = useForm<z.infer<typeof resetPasswordSchema>>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            newPassword: '',
            confirmNewPassword: ''
        },
    });
    const { formState: { isValid } } = form;

    const toggleNewPasswordVisibility = () => {
        setShowNewPassword(!showNewPassword);
    };

    const toggleConfirmNewPasswordVisibility = () => {
        setShowConfirmNewPassword(!showConfirmNewPassword);
    };


    const onSubmit = async (values: z.infer<typeof resetPasswordSchema>) => {
        alert(`Sign-In see browser console`);
        console.log(values)
    };

    return (
        <>
            <div className="absolute top-11 left-[42px] lg:top-5" title="Go to Home -->">
                <Link href="/"><HomeIcon className="size-5 text-[#171918] cursor-pointer" /></Link>
            </div>
            <div className="flex flex-col items-center justify-center lg:min-h-screen min-h-[90vh] lg:mt-0 space-y-4 prada tracking-wider">
                <img src="/logo/logoWatch.png" className="size-25 lg:size-30 rounded-[10px] bg-gradient-to-b from-gray-50 to-gray-200" />
                <h1 className="shine-text font-bold text-[#171918]">Store Name</h1>
                <p className="text-[#171918] text-[10px] lg:text-[14px]">You're almost there! Set a <span className="font-bold shine-effect">new password</span> to get back in.</p>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 mt-1">
                        <FormField
                            control={form.control}
                            name="newPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex justify-between">
                                        <FormLabel className="text-[#171918]">New Password</FormLabel>
                                        <FormMessage className="text-red-500" />
                                    </div>
                                    <FormControl>
                                        <input
                                            placeholder="Enter new password"
                                            {...field}
                                            type={showNewPassword ? 'text' : 'password'}
                                            className="bg-white text-[#171918] border-[#dee2e7] border-1 rounded-[5px] w-[100%] lg:w-full p-2 shadow mr-10 placeholder:text-[12px] lg:placeholder:text-sm"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="confirmNewPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex justify-between mt-1">
                                        <FormLabel className="text-[#171918]">Confirm New Password</FormLabel>
                                        <FormMessage className="text-red-500 text-[10px]" />
                                    </div>
                                    <FormControl>
                                        <input
                                            placeholder="Re-enter new password"
                                            {...field}
                                            type={showConfirmNewPassword ? 'text' : 'password'}
                                            className=" bg-white text-[#171918] border-[#dee2e7] border-1 rounded-[5px] w-[100%] lg:w-110 p-2 shadow placeholder:text-[12px]  lg:placeholder:text-sm"
                                        />
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
                            Reset
                        </Button>
                        <div className="relative">
                            <button
                                type="button"
                                onClick={toggleNewPasswordVisibility}
                                className="absolute bottom-38 right-0 pr-3 flex items-center text-[#171918]"
                                title={showNewPassword ? 'Hide password' : 'Show password'}
                            >
                                {showNewPassword ? (
                                    <Eye className="h-5 w-5 text-[#606060]" />
                                ) : (
                                    <EyeOff className="h-5 w-5 text-[#606060]" />
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={toggleConfirmNewPasswordVisibility}
                                className="absolute bottom-18 right-0 pr-3 flex items-center text-[#171918]"
                                title={showConfirmNewPassword ? 'Hide password' : 'Show password'}
                            >
                                {showConfirmNewPassword ? (
                                    <Eye className="h-5 w-5 text-[#606060]" />
                                ) : (
                                    <EyeOff className="h-5 w-5 text-[#606060]" />
                                )}
                            </button>
                        </div>
                        <div className="flex items-center gap-3">
                            <hr className="flex-1 border-gray-300" />
                            <span className="text-gray-500 text-sm">Remember Password ?</span>
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
