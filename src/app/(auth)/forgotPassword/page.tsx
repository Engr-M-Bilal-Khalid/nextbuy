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

    const [isSubmitting, setIsSubmitting] = useState(false);

    const forgotPasswordSchema = z.object({
        email: z.string().email({
            message: 'Please enter a valid email address.',
        })
    });


    const form = useForm<z.infer<typeof forgotPasswordSchema>>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: ''
        },
    });

    const { formState: { isValid } } = form;

    
    const onSubmit = async (values: z.infer<typeof forgotPasswordSchema>) => {
        alert(`Forgot password see browser console`);
        setIsSubmitting(true);
        console.log(values);
        setIsSubmitting(false)
    };

    return (
        <>
            <div className="absolute top-11 left-[42px] lg:top-5" title="Go to Home -->">
                <Link href="/"><HomeIcon className="size-5 text-[#171918] cursor-pointer" /></Link>
            </div>
            <div className="flex flex-col items-center justify-center lg:min-h-screen min-h-[90vh] lg:mt-0 space-y-3 prada tracking-wider">
                <img src="/logo/logoWatch.png" className="size-25 lg:size-30 rounded-[10px] bg-gradient-to-b from-gray-50 to-gray-200" />
                <h1 className="shine-text font-bold text-[#171918]">Store Name</h1>
                <p className="text-[#171918] text-[10px] lg:text-[14px]"><span className="shine-text font-bold">Forgot password ? </span>We can help you.</p>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-1">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex justify-between lg:ml-4">
                                        <FormLabel className="text-[#171918]">Email</FormLabel>
                                        
                                    </div>
                                    <FormControl>
                                        <input
                                            placeholder="Enter your account email"
                                            {...field}
                                            type="email"
                                            className="bg-white text-[#171918] border-[#dee2e7] border-1 rounded-[5px] w-[100%] lg:w-100 p-2 shadow mr-10 placeholder:text-[12px] lg:placeholder:text-sm mt-3 lg:ml-4"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-500 text-center" />
                                </FormItem>
                            )}
                        />  
                        <Button
                            type="submit"
                            disabled={!isValid}
                            className="w-full lg:w-100 rounded-[5px] shadow-2xs tracking-wider border border-[#dee2e7] bg-[#171918] shine-effect  lg:ml-4"
                        >
                            {
                                isSubmitting
                                    ?
                                    <LoaderCircle className="w-4 h-4 text-white animate-spin" />
                                    :
                                    null
                            }
                            Submit
                        </Button>
                        <div className="flex items-center gap-3">
                            <hr className="flex-1 border-gray-300" />
                            <span className="text-gray-500 text-sm">Remember Password?</span>
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
