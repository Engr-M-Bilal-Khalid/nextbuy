import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcrypt";
import { Pool, PoolClient } from "pg";
import z from "zod";
import { signInSchema } from "@/zodSchemas/authSchemas";
import Database from "@/lib/dbConnection";
import SessionManager from "@/lib/sessionManager/sessionManager";

const SQL_SELECT_USER_FOR_UPDATE = `
  SELECT user_id, email, password, role_id, failed_login_attempts, login_count, is_verified
  FROM users
  WHERE email = $1
  FOR UPDATE
`;

const SQL_INC_FAILED_ATTEMPTS = `
  UPDATE users
  SET failed_login_attempts = failed_login_attempts + 1
  WHERE user_id = $1
`;

const SQL_RESET_FAILED_ATTEMPTS = `
  UPDATE users
  SET failed_login_attempts = 0
  WHERE user_id = $1
`;

const SQL_INC_LOGIN_COUNT_AND_STAMP = `
  UPDATE users
  SET login_count = login_count + 1,
      last_login_at = NOW()
  WHERE user_id = $1
`;

const SQL_SELECT_ADMIN_ID_BY_USER = `
  SELECT admin_id
  FROM admins
  WHERE user_id = $1
`;

export async function POST(req: NextRequest) {
    let client: PoolClient | null = null;

    try {
        const body = await req.json();
        const { email, password } = signInSchema.parse(body);

        const pool: Pool = Database();
        client = await pool.connect();
        await client.query("BEGIN");

        const userRes = await client.query(SQL_SELECT_USER_FOR_UPDATE, [email]);
        const user = userRes.rows[0];

        if (!user) {
            await client.query("ROLLBACK");
            return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
        }

        if (user.is_verified === false) {
            await client.query("ROLLBACK");
            return NextResponse.json({ message: "Email not verified" }, { status: 403 });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            await client.query(SQL_INC_FAILED_ATTEMPTS, [user.user_id]);
            await client.query("COMMIT");
            return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
        }

        await client.query(SQL_RESET_FAILED_ATTEMPTS, [user.user_id]);
        await client.query(SQL_INC_LOGIN_COUNT_AND_STAMP, [user.user_id]);

        const userId: number = user.user_id;
        const roleId: number = user.role_id;
        const emailAddr: string = user.email;

        await client.query("COMMIT");

        if (roleId === 1) {
            const pool2: Pool = Database();
            const adminLookup = await pool2.query(SQL_SELECT_ADMIN_ID_BY_USER, [userId]);
            if (adminLookup.rows.length === 0) {
                return NextResponse.json({ message: "Admin record not found" }, { status: 403 });
            }

            const adminId: number = adminLookup.rows[0].admin_id;
            const sessionToken = await SessionManager.getInstance().createSession(adminId);

            const cookieValue = JSON.stringify({
                sessionToken,
                userId,
                roleId,
                userRole:'admin'
            });

            const cookieStore = await cookies();
            cookieStore.set({
                name: "signInToken",
                value: cookieValue,
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge: 60 * 60 * 24 * 7,
            });

            return NextResponse.json(
                { message: "Admin Login successful", user: { user_id: userId, email: emailAddr, roleId } },
                { status: 201 }
            );
        }

        const cookieValue = JSON.stringify({
            userId,
            roleId,
            userRole:'customer'
        });

        const cookieStore = await cookies();
        cookieStore.set({
            name: "signInToken",
            value: cookieValue,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
        });

        return NextResponse.json(
            { message: "Login successful", user: { user_id: userId, email: emailAddr, roleId } },
            { status: 200 }
        );
    } catch (error: any) {
        try {
            if (client) await client.query("ROLLBACK");
        } catch { }
        if (error instanceof z.ZodError) {
            return NextResponse.json({ message: "Validation error", errors: "Invalid data" }, { status: 400 });
        }
        return NextResponse.json(
            { message: "Internal server error", error: error?.message || "An unexpected error occurred" },
            { status: 500 }
        );
    } finally {
        if (client) client.release();
    }
}
