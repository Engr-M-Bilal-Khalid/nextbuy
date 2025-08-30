"use client"
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HomeIcon, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import '@/app/style.css';
import { useSearchParams } from "next/navigation";
import { verifyEmailSchema } from "@/zodSchemas/authSchemas";
import { errorNotifier, successNotifier } from "@/lib/sonnerNotifications";



export default function VerifyEmailPage() {

    const router = useRouter();

    const searchParams = useSearchParams();
    const email = searchParams.get("email") ?? "";

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isResend, setIsResend] = useState(false);

    // Timer state variables
    const [resendTimer, setResendTimer] = useState(60);
    const [isTimerActive, setIsTimerActive] = useState(true);
    const [codeExpired, setCodeExpired] = useState(false);

    const form = useForm<z.infer<typeof verifyEmailSchema>>({
        resolver: zodResolver(verifyEmailSchema),
        defaultValues: {
            verificationCode: ''
        },
    });

    const { formState: { isValid } } = form;

    const onSubmit = async (values: z.infer<typeof verifyEmailSchema>) => {
        try {
            setIsSubmitting(true);

            const res = await fetch("/api/verifyEmail", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    code: values.verificationCode
                }),
            });

            const data = await res.json().catch(() => ({} as any));
            const message = data?.message || data?.error || "Unexpected response";

            if (res.status === 200 || res.status === 201) {
                successNotifier.notify(message);
                router.replace('/signIn')
                return;
            }

            if (res.status === 400 || res.status === 404) {
                errorNotifier.notify(message)
                return;
            }

            errorNotifier.notify(`Something went wrong`)
        } catch (err: any) {
            errorNotifier.notify(err ? err : `Network error`)
        } finally {
            setIsSubmitting(false);
        }

    };

    // Resend button logic
    const handleResend = async () => {
        try {
            setIsResend(true)

            const res = await fetch("/api/resendVerificationCode", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                }),
            });

            const data = await res.json().catch(() => ({} as any));
            const message = data?.message || data?.error || "Unexpected response";


            if (res.status === 200) {
                successNotifier.notify(message);
                setIsResend(false);
                setResendTimer(60);
                setIsTimerActive(true);
                setCodeExpired(false); // critical: allow Submit again
                form.reset({ verificationCode: "" }); // optional: clear input
                return;
            }


            if (res.status === 400 || res.status === 502) {
                errorNotifier.notify(message);
                setIsResend(false);
                setResendTimer(0)
                return;
            }

            errorNotifier.notify(`Something went wrong`);
            setIsResend(false);
            setResendTimer(0)
        } catch (error) {
            errorNotifier.notify(`Network error`);
            setIsResend(false);
            setResendTimer(0)
        }
    };

    // Resend timer effect
    useEffect(() => {
        if (!isTimerActive) return;
        if (resendTimer <= 0) {
            setIsTimerActive(false);
            return;
        }
        const timerId = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
        return () => clearInterval(timerId);
    }, [isTimerActive, resendTimer]);



    useEffect(() => {
        if (!isTimerActive) return;
        const expirationTimer = setTimeout(() => setCodeExpired(true), 60000);
        return () => clearTimeout(expirationTimer);
    }, [isTimerActive]);


    return (
        <>
            <div className="absolute top-11 left-[42px] lg:top-5" title="Go to Home -->">
                <Link href="/"><HomeIcon className="size-5 text-[#171918] cursor-pointer" /></Link>
            </div>
            <div className="flex flex-col items-center justify-center lg:min-h-screen min-h-[90vh] lg:mt-0 space-y-3 prada tracking-wider">
                <img src="/logo/logoWatch.png" className="size-25 lg:size-30 rounded-[10px] bg-gradient-to-b from-gray-50 to-gray-200" />
                <h1 className="shine-text font-bold text-[#171918]">Store Name</h1>
                <div className="flex items-center justify-center px-10 w-full lg:w-100 lg:px-2">
                    <p className="text-[#171918] text-[10px] lg:text-[14px] text-center">
                        Please check your email at
                        <a href="https://mail.google.com/mail/u/0/" target="_blank" rel="noopener noreferrer">
                            <span className="font-semibold text-cyan-600 cursor-pointer hover:underline ml-1">
                                muhammadbilal00376@gmail.com
                            </span>
                        </a>
                        . We've sent a <span className="font-bold shine-effect">verification code</span> you need to enter here to continue.
                    </p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-1">
                        <FormField
                            control={form.control}
                            name="verificationCode"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex justify-between lg:ml-4">
                                        <FormLabel className="text-[#171918]">Verification Code</FormLabel>
                                    </div>
                                    <FormControl>
                                        <input
                                            placeholder="Enter 6 digit code"
                                            {...field}
                                            type="text"
                                            className="bg-white text-[#171918] border-[#dee2e7] border-1 rounded-[5px] w-[100%] lg:w-100 p-2 shadow mr-10 placeholder:text-[12px] lg:placeholder:text-sm mt-3 lg:ml-4"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-500 text-center" />
                                </FormItem>
                            )}
                        />
                        <Button
                            type="submit"
                            disabled={isSubmitting || !isValid || (codeExpired && !isTimerActive)}
                            className="w-full lg:w-100 rounded-[5px] shadow-2xs tracking-wider border border-[#dee2e7] bg-[#171918] shine-effect  lg:ml-4"
                        >
                            {isSubmitting ? (
                                <LoaderCircle className="w-4 h-4 text-white animate-spin" />
                            ) : codeExpired && !isTimerActive ? (
                                "Code expired"
                            ) : (
                                "Submit"
                            )}
                        </Button>

                        <div className="flex items-center gap-3">
                            <hr className="flex-1 border-gray-300" />
                            <span className="text-gray-500 text-sm">Having trouble?</span>
                            <hr className="flex-1 border-gray-300" />
                        </div>
                        <Button
                            type="button"
                            onClick={handleResend}
                            disabled={isTimerActive}
                            className="w-full lg:w-100 rounded-[5px] shadow-2xs tracking-wider border border-[#dee2e7] bg-[#171918] shine-effect  lg:ml-4"
                        >
                            {isTimerActive ? `Resend in ${resendTimer}s` : isResend ? <LoaderCircle className="w-4 h-4 text-white animate-spin" /> : 'Resend'}
                        </Button>
                    </form>
                </Form>
            </div>
        </>
    );
}