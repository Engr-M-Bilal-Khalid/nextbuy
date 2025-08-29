import { buildEmail } from "@/components/shared/emailTemplates/verifyEmail";
import Database from "@/lib/dbConnection";
import { NextRequest, NextResponse } from "next/server";
import { Pool, PoolClient } from "pg";
import { Resend } from "resend";
import { generateVerificationCode, hashVerificationCode } from "@/lib/auth";

let pool: Pool = Database();
let emailService: Resend = new Resend(process.env.RESEND_API_KEY ?? "");

const SQL_SELECT_USER = `
  SELECT user_id, email, is_verified
  FROM users
  WHERE email = $1
`;

const SQL_UPDATE_VERIFICATION = `
  UPDATE users
  SET verification_code = $1,
      code_timestamp = $2,
      code_expiration = $3
  WHERE email = $4
  RETURNING user_id, email
`;





export async function POST(req: NextRequest) {
    let client: PoolClient | null = null;
    let email: string = "";
    let newCode: string = generateVerificationCode();
    let newVerificationCode: string = await hashVerificationCode(newCode);
    let codeTimestamp: Date = new Date();
    let codeExpiration: Date = new Date(codeTimestamp.getTime() + 100 * 1000);

    try {
        if (!process.env.RESEND_API_KEY) {
            return NextResponse.json({ message: "Email service not configured" }, { status: 500 });
        }

        const body = await req.json();
        email = String(body?.email || "").trim().toLowerCase();
        

        if (!email || !newVerificationCode) {
            return NextResponse.json({ message: "Email and newCode are required" }, { status: 400 });
        }

        client = await pool.connect();
        await client.query("BEGIN");

        const userRes = await client.query(SQL_SELECT_USER, [email]);
        const user = userRes.rows[0];

        if (!user) {
            await client.query("ROLLBACK");
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        if (user.is_verified === true) {
            await client.query("ROLLBACK");
            return NextResponse.json({ message: "Email already verified" }, { status: 200 });
        }

        const updateRes = await client.query(SQL_UPDATE_VERIFICATION, [
            newVerificationCode,
            codeTimestamp,
            codeExpiration,
            email,
        ]);

        if (updateRes.rowCount !== 1) {
            throw new Error("Failed to update verification fields");
        }

        await emailService.emails.send(buildEmail(email, newCode));

        await client.query("COMMIT");

        return NextResponse.json(
            { message: "New code has been sent", user: { email: updateRes.rows[0].email, user_id: updateRes.rows[0].user_id } },
            { status: 200 }
        );
    } catch (err: any) {
        try {
            if (client) await client.query("ROLLBACK");
        } catch { }
        const code = err?.name === "ResendError" ? 502 : 400;
        return NextResponse.json(
            { message: err?.message || "Failed to send new code. Please try again." },
            { status: code }
        );
    } finally {
        if (client) client.release();
    }
}
