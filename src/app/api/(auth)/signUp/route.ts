import Database from "@/lib/dbConnection";
import { signUpSchema } from "@/zodSchemas/authSchemas";
import { NextRequest, NextResponse } from "next/server";
import { Pool, PoolClient } from "pg";
import bcrypt from "bcrypt";
import { Resend } from "resend";
import { generateUsernameFromEmail, generateVerificationCode, hashVerificationCode } from "@/lib/auth";
import z from "zod";
import { buildEmail } from "@/components/shared/emailTemplates/verifyEmail";

let pool: Pool = Database();
let client: PoolClient | null = null;

let createUserSql: string = `
  INSERT INTO users (email, password, role_id, created_at, verification_code, code_timestamp, code_expiration, userName)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
  RETURNING user_id, email
`;

let createCustomerSql: string = `
  INSERT INTO customers (user_id)
  VALUES ($1)
`;

let emailCheckSql: string = `
  SELECT email FROM users WHERE email = $1
`;

let now: Date = new Date();
let emailService: Resend = new Resend(process.env.RESEND_API_KEY ?? "");


export async function POST(req: NextRequest) {
    try {
        let body: unknown = await req.json();
        let parsed = signUpSchema.parse(body);
        let { email, password } = parsed;

        console.log(email);
        console.log(password)

        if (!process.env.RESEND_API_KEY) {
            return NextResponse.json({ message: "Email service not configured" }, { status: 500 });
        }

        let emailCheckResult = await pool.query(emailCheckSql, [email]);
        if (emailCheckResult.rows.length > 0) {
            return NextResponse.json({ message: "Email address is already taken." }, { status: 400 });
        }

        let hashedPassword: string = await bcrypt.hash(password, 10);
        let code: string = generateVerificationCode();
        let verificationCode: string = await hashVerificationCode(code);
        let codeTimestamp: Date = new Date();
        let codeExpiration: Date = new Date(codeTimestamp.getTime() + 100 * 1000);
        let roleId: number = 2;
        let userName: string = generateUsernameFromEmail(email);
        let createUserParams: (string | number | Date)[] = [
            email,
            hashedPassword,
            roleId,
            now,
            verificationCode,
            codeTimestamp,
            codeExpiration,
            userName,
        ];

        client = await pool.connect();
        await client.query("BEGIN");


        let signUpUser = await client.query(createUserSql, createUserParams);
        if (signUpUser.rows.length === 0) {
            throw new Error("User creation failed");
        }

        let user_id: number = signUpUser.rows[0].user_id;
        let customerEmail: string = signUpUser.rows[0].email;

        let signUpAsCustomer = await client.query(createCustomerSql, [user_id]);
        if (signUpAsCustomer.rowCount !== 1) {
            throw new Error("Customer creation failed");
        }

        await client.query("COMMIT");

        try {
            await emailService.emails.send(buildEmail(email, code));
        } catch {
            return NextResponse.json(
                {
                    message:
                        "Account created, but verification email failed to send. Please request a new verification code.",
                    user: { email: customerEmail, user_id },
                },
                { status: 202 }
            );
        }

        return NextResponse.json(
            {
                message: "Customer created successfully. Verification email sent.",
                user: { email: customerEmail, user_id },
            },
            { status: 201 }
        );
    } catch (error: any) {
        try {
            if (client) {
                await client.query("ROLLBACK");
            }
        } catch { }

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { message: "Validation error", errors: "Enter correct data" },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { message: "Internal server error", error: error?.message ?? "An unexpected error occurred" },
            { status: 500 }
        );
    } finally {
        if (client) {
            client.release();
            client = null;
        }
        now = new Date();
    }
}
