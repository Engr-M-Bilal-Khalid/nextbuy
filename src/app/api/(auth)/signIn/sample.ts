// import { NextResponse, NextRequest } from 'next/server';
// import { z } from 'zod';
// import bcrypt from 'bcrypt';
// import Database from '@/lib/postgresSqlDbConnection';
// import { cookies } from 'next/headers';
// import { Pool } from 'pg'; // Changed from 'mssql' to 'pg'
// import SessionManager from '@/lib/designPatterns/singleton/Session-manager';

// const signInSchema = z.object({
//     email: z.string().email(),
//     password: z.string().min(8).max(8),
// });

// export async function POST(req: NextRequest) {
//     try {
//         const body = await req.json();
//         const { email, password } = signInSchema.parse(body);

//         const pool: Pool = await Database(); // Ensure Database.getInstance() returns pg.Pool

//         const result = await pool.query(
//             'SELECT user_id, email, password, role_id, failed_login_attempts, login_count FROM users WHERE email = $1',
//             [email]
//         );

//         const user = result.rows[0]; // Access results via .rows

//         if (!user) {
//             return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
//         }

//         const passwordMatch = await bcrypt.compare(password, user.password);
//         if (!passwordMatch) {
//             await pool.query(
//                 'UPDATE users SET failed_login_attempts = failed_login_attempts + 1 WHERE user_id = $1',
//                 [user.user_id]
//             );

//             return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
//         }

//         await pool.query(
//             'UPDATE users SET failed_login_attempts = 0 WHERE user_id = $1',
//             [user.user_id]
//         );

//         await pool.query(
//             'UPDATE users SET login_count = login_count + 1 WHERE user_id = $1',
//             [user.user_id]
//         );

//         const roleResult = await pool.query(
//             'SELECT role_name FROM user_roles WHERE role_id = $1',
//             [user.role_id]
//         );

//         const roleName = roleResult.rows[0]?.role_name; // Access results via .rows

//         const userForResponse = {
//             user_id: user.user_id,
//             email: user.email,
//             role: roleName,
//             roleId: user.role_id
//         };


//         const sessionManager = SessionManager.getInstance();
//         const sessionToken = await sessionManager.createSession(user.user_id);

//         await pool.query(
//             'UPDATE users SET last_login_at = NOW() WHERE user_id = $1', // Changed GETDATE() to NOW()
//             [user.user_id]
//         );

//         const cookieValue = JSON.stringify({
//             sessionToken: sessionToken,
//             userId: user.user_id,
//             userRole: roleName
//         });

//         const cookieStore = await cookies();
//         cookieStore.set({
//             name: 'session-token',
//             value: cookieValue,
//             httpOnly: true,
//             secure: process.env.NODE_ENV === 'production',
//             path: '/',
//             maxAge: 60 * 60 * 24 * 7,
//         });

//         cookieStore.delete("guest-id");

//         return NextResponse.json({ message: 'Login successful', user: userForResponse }, { status: 200 });

//     } catch (error: any) {
//         console.error('Sign In Error:', error);
//         if (error instanceof z.ZodError) {
//             return NextResponse.json({ message: 'Validation error', errors: "Invalid data" }, { status: 400 });
//         }
//         return NextResponse.json(
//             { message: 'Internal server error', error: error.message || 'An unexpected error occurred' },
//             { status: 500 }
//         );
//     }
// }