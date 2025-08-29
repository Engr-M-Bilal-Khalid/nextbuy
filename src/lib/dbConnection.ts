import { Pool } from 'pg';

let pool: Pool | null = null;

export default function Database() {
    if (!pool) {
        pool = new Pool({ 
            host: process.env.DB_HOST,
            port: 6543,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DATABASE, 
        });
        console.log("✅ PostgreSQL pool created");
    }
    return pool;
};