import { NextRequest, NextResponse } from "next/server";
import Database from "@/lib/dbConnection";
import { Pool, PoolClient } from "pg";
import bcrypt from "bcrypt";

const SQL_SELECT_USER_BY_EMAIL = `
  SELECT user_id, email, is_verified, verification_code, code_expiration
  FROM users
  WHERE email = $1
`;

const SQL_UPDATE_VERIFY_USER = `
  UPDATE users
  SET is_verified = TRUE,
      verification_code = NULL,
      code_expiration = NULL
  WHERE email = $1
`;

export async function POST(req: NextRequest) {
    let client: PoolClient | null = null;

    try {
        const { email, code } = await req.json();

        if (!email || !code) {
            return NextResponse.json({ error: "Email and code are required" }, { status: 400 });
        }

        const pool: Pool = Database();
        client = await pool.connect();

        try {
            await client.query("BEGIN");

            const userResult = await client.query(SQL_SELECT_USER_BY_EMAIL, [email]);
            const user = userResult.rows[0];

            if (!user) {
                await client.query("ROLLBACK");
                return NextResponse.json({ error: "User not found" }, { status: 404 });
            }

            const compareCode = await bcrypt.compare(code, user.verification_code ?? "");
            console.log(bcrypt.compare(code, user.verification_code ?? ""))
            const codeExpiration: Date | null = user.code_expiration ? new Date(user.code_expiration) : null;
            const isVerified: boolean = Boolean(user.is_verified);

            if (isVerified) {
                await client.query("ROLLBACK");
                return NextResponse.json({ message: "Email already verified" }, { status: 201 });
            }

            const now = new Date();
            const isValidAndNotExpired = compareCode && codeExpiration !== null && codeExpiration > now;

            if (!isValidAndNotExpired) {
                await client.query("ROLLBACK");
                return NextResponse.json({ error: "Invalid or expired verification code" }, { status: 400 });
            }

            const updateResult = await client.query(SQL_UPDATE_VERIFY_USER, [email]);
            if (updateResult.rowCount !== 1) {
                throw new Error("Failed to update user verification status");
            }

            await client.query("COMMIT");
            return NextResponse.json({ message: "Email verified successfully" }, { status: 200 });
        } catch (dbErr: any) {
            try {
                if (client) await client.query("ROLLBACK");
            } catch { }
            return NextResponse.json({ error: dbErr?.message ?? "Database query failed" }, { status: 500 });
        }
    } catch (error: any) {
        return NextResponse.json({ error: error?.message || "Internal server error" }, { status: 500 });
    } finally {
        if (client) client.release();
    }
}
