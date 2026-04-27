import { pgTable, serial, varchar, text, timestamp } from "drizzle-orm/pg-core";

export const MockInterview = pgTable("mockinterview", {
  id: serial("id").primaryKey(),
  jsonMockResp: text("jsonmockresp").notNull(),
  jobPosition: varchar("jobposition", { length: 255 }).notNull(),
  jobDesc: text("jobdesc").notNull(),
  jobExperience: text("jobexperience").notNull(),
  createdBy: varchar("createdby", { length: 255 }).notNull(),
  createdAt: timestamp("createdat").defaultNow(),
  mockId: varchar("mockid", { length: 255 }).notNull(),
  resumeUrl: text("resumeurl"),
});
