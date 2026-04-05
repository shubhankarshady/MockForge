import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema/index';

const connectionString = process.env.NEXT_PUBLIC_DRIZZLE_DB_URL || process.env.DATABASE_URL;

if (!connectionString) {
    console.warn("WARNING: Database connection string is not defined in environment variables.");
}

const sql = neon(connectionString || "");
export const db = drizzle(sql, { schema });
