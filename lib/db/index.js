import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema/index';

const connectionString = process.env.NEXT_PUBLIC_DRIZZLE_DB_URL || process.env.DATABASE_URL;

if (!connectionString) {
    console.warn("WARNING: Database connection string is not defined in environment variables.");
}

// For query purposes
const client = postgres(connectionString || "", { prepare: false });
export const db = drizzle(client, { schema });
