import { pgTable, serial, varchar, timestamp } from "drizzle-orm/pg-core";

// Define users schema if needed, otherwise empty for now
export const Users = pgTable("users", {
    id: serial("id").primaryKey(),
    // Add other user-related fields here
    createdAt: timestamp("createdat").defaultNow(),
});
