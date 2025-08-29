import { Pool } from "pg";
import crypto from "crypto";
import Database from "@/lib/dbConnection";

const formatter = new Intl.DateTimeFormat("en-PK", {
    timeZone: "Asia/Karachi",
    year: "numeric",
    month: "long",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
});

const SQL_DELETE_SESSIONS_BY_ADMIN = `DELETE FROM sessions WHERE admin_id = $1`;
const SQL_INSERT_SESSION = `
  INSERT INTO sessions (admin_id, session_token, created_at, expires_at)
  VALUES ($1, $2, $3, $4)
`;
const SQL_SELECT_SESSION_BY_ADMIN = `SELECT * FROM sessions WHERE admin_id = $1`;
const SQL_UPDATE_SESSION_EXPIRY_BY_ADMIN = `
  UPDATE sessions SET expires_at = $1 WHERE admin_id = $2
`;
const SQL_DELETE_SESSION_BY_ADMIN = `DELETE FROM sessions WHERE admin_id = $1`;
const SQL_VALIDATE_SESSION = `
  SELECT expires_at FROM sessions
  WHERE admin_id = $1 AND session_token = $2
`;

class SessionManager {
    private static instance: SessionManager;

    private constructor() { }

    public static getInstance(): SessionManager {
        if (!SessionManager.instance) {
            SessionManager.instance = new SessionManager();
            console.log("✅ SessionManager instance created using Singleton pattern.");
        }
        return SessionManager.instance;
    }

    public async createSession(adminId: number): Promise<string> {
        if (!Number.isInteger(adminId) || adminId <= 0) {
            throw new Error("Invalid adminId");
        }

        const pkOffsetMs = 5 * 60 * 60 * 1000;
        const nowUTC = new Date();
        const pool: Pool = Database();
        const sessionToken = crypto.randomBytes(32).toString("hex");
        const createdAt = new Date(nowUTC.getTime() + pkOffsetMs);
        const EIGHT_HOURS_MS = 8 * 60 * 60 * 1000;
        const expiresAt = new Date(createdAt.getTime() + EIGHT_HOURS_MS);

        const createdAtFormatted = formatter.format(createdAt);
        const expiresAtFormatted = formatter.format(expiresAt);

        await pool.query(SQL_DELETE_SESSIONS_BY_ADMIN, [adminId]);
        await pool.query(SQL_INSERT_SESSION, [adminId, sessionToken, createdAt, expiresAt]);

        console.log("✅ Session token stored in database successfully.");
        console.log("Created At (PKT):", createdAtFormatted);
        console.log("Expires At (PKT +1hr):", expiresAtFormatted);

        return sessionToken;
    }

    public async getSession(adminId: number): Promise<any> {
        if (!Number.isInteger(adminId) || adminId <= 0) {
            throw new Error("Invalid adminId");
        }
        const pool: Pool = Database();
        const result = await pool.query(SQL_SELECT_SESSION_BY_ADMIN, [adminId]);
        return result.rows.length > 0 ? result.rows[0] : null;
    }

    public async extendSession(adminId: number): Promise<void> {
        if (!Number.isInteger(adminId) || adminId <= 0) {
            throw new Error("Invalid adminId");
        }
        const pool: Pool = Database();
        const FOUR_HOUR_MS = 4 * 60 * 60 * 1000;
        const newExpiry = new Date(Date.now() + FOUR_HOUR_MS);
        await pool.query(SQL_UPDATE_SESSION_EXPIRY_BY_ADMIN, [newExpiry, adminId]);
    }

    public async clearSession(adminId: number): Promise<void> {
        if (!Number.isInteger(adminId) || adminId <= 0) {
            throw new Error("Invalid adminId");
        }
        const pool: Pool = Database();
        await pool.query(SQL_DELETE_SESSION_BY_ADMIN, [adminId]);
    }

    public async validateSession(sessionToken: string, adminId: number): Promise<boolean> {
        if (!sessionToken || typeof sessionToken !== "string") {
            return false;
        }
        if (!Number.isInteger(adminId) || adminId <= 0) {
            return false;
        }
        const pool: Pool = Database();
        const result = await pool.query(SQL_VALIDATE_SESSION, [adminId, sessionToken]);
        if (result.rows.length === 0) {
            return false;
        }
        const session = result.rows[0];
        const now = new Date();
        return session.expires_at > now;
    }
}

export default SessionManager;
