import { pgTable, serial, varchar, text, integer, timestamp } from "drizzle-orm/pg-core";

export const AptitudeTest = pgTable("aptitudetest", {
  id: serial("id").primaryKey(),
  mockId: varchar("mockid", { length: 255 }).notNull(),
  category: varchar("category", { length: 255 }).notNull(),
  score: integer("score").default(0),
  totalQuestions: integer("totalquestions").default(0),
  aiFeedback: text("aifeedback"),
  createdBy: varchar("createdby", { length: 255 }).notNull(),
  createdAt: timestamp("createdat").defaultNow(),
});

export const AptitudeAnswer = pgTable("aptitudeanswer", {
  id: serial("id").primaryKey(),
  testIdRef: varchar("testidref", { length: 255 }).notNull(),
  questionText: text("questiontext").notNull(),
  correctAnswer: text("correctanswer").notNull(),
  userAnswer: text("useranswer"),
  isCorrect: varchar("iscorrect", { length: 10 }), // 'true' or 'false'
  createdAt: timestamp("createdat").defaultNow(),
});
