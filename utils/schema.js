 import { pgTable, serial, varchar, text, timestamp } from "drizzle-orm/pg-core";


export const MockInterview = pgTable("mockinterview", {
  id: serial("id").primaryKey(),

  jsonMockResp: text("jsonmockresp").notNull(),

  jobPosition: varchar("jobposition", { length: 255 }).notNull(),

  jobDesc: text("jobdesc").notNull(),

  jobExperiance: text("jobexperiance").notNull(),

  createdBy: varchar("createdby", { length: 255 }).notNull(),

  createdAt: timestamp("createdat").defaultNow(),

  mockId: varchar("mockid", { length: 255 }).notNull(),
});

export const UserAnswer=pgTable('useranswer',{
    id: serial("id").primaryKey(),
    mockIdRef: varchar("mockid").notNull(),
    questions: varchar("question").notNull(),
    correctAns: text("correctans"),
    userAns: text("userans"),
    feedback:text("feedback"),
    rating: varchar("rating"),
    userEmail:varchar("useremail"),
    createdAt: timestamp("createdat").defaultNow(),

})