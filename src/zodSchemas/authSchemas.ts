
import z from "zod";

export const signUpSchema = z.object({
    email: z.string().email({
        message: 'Please enter a valid email address.',
    }),
    password: z.string()
        .min(8, {
            message: 'Password must be exactly 8 characters.',
        })
        .max(8, {
            message: 'Password must be exactly 8 characters.',
        })
        .regex(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8}$/), {
            message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
        }),
    confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export const signInSchema = z.object({
        email: z.string().email({
            message: 'Please enter a valid email address.',
        }),
        password: z.string()
            .min(8, {
                message: 'Password must be exactly 8 characters.',
            })
            .max(8, {
                message: 'Password must be exactly 8 characters.',
            })
            .regex(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8}$/), {
                message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
            }),
    });


export const verifyEmailSchema = z.object({
    verificationCode: z.string()
        .min(6, { message: 'The verification code must be exactly 6 digits.' })
        .max(6, { message: 'The verification code must be exactly 6 digits.' }),
});