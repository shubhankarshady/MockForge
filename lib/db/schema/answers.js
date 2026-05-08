import { pgTable, serial, varchar, text, timestamp } from "drizzle-orm/pg-core";

export const UserAnswer = pgTable('useranswer', {
  id: serial("id").primaryKey(),
  mockIdRef: varchar("mockid").notNull(),
  questions: text("question").notNull(),
  correctness: text("correctness"),
  userAns: text("userans"),
  feedback: text("feedback"),
  rating: varchar("rating"),
  userEmail: varchar("useremail"),
  createdAt: timestamp("createdat").defaultNow(),
});
