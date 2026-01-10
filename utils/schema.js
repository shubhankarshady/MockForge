 import { pgTable, serial, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";

export const MockInterview = pgTable("mockInterview", {
  id: serial("id").primaryKey(),

  jsonMockResp: text("jsonMockResp").notNull(),

  jobPosition: varchar("jobPosition", { length: 255 }).notNull(),

  jobDesc: text("jobDesc").notNull(),

  jobExperiance: text("jobExperiance").notNull(),

  createdBy: varchar("createdBy", { length: 255 }).notNull(),

  createdAt: timestamp("createdAt").defaultNow(),

  mockId: varchar("mockId", { length: 255 }).notNull(),
});