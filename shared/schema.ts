import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, timestamp, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  profilePhoto: text("profile_photo"),
  preferredBroker: text("preferred_broker"),
  experience: text("experience"),
  bio: text("bio"),
  defaultRisk: decimal("default_risk", { precision: 5, scale: 2 }).default("2.00"),
  riskRewardRatio: text("risk_reward_ratio").default("1:2"),
  currency: text("currency").default("USD"),
  emailNotifications: boolean("email_notifications").default(true),
  aiInsights: boolean("ai_insights").default(true),
  weeklyReports: boolean("weekly_reports").default(false),
  pushNotifications: boolean("push_notifications").default(true),
  twoFactorEnabled: boolean("two_factor_enabled").default(false),
  subscription: text("subscription").default("Free"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const trades = pgTable("trades", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  symbol: text("symbol").notNull(),
  type: text("type").notNull(), // Long, Short
  entryPrice: decimal("entry_price", { precision: 10, scale: 2 }).notNull(),
  exitPrice: decimal("exit_price", { precision: 10, scale: 2 }),
  quantity: integer("quantity").notNull(),
  pnl: decimal("pnl", { precision: 10, scale: 2 }),
  returnPercent: decimal("return_percent", { precision: 5, scale: 2 }),
  riskReward: text("risk_reward"),
  mood: integer("mood"), // 1-5 scale
  tags: jsonb("tags").default([]),
  notes: text("notes"),
  screenshots: jsonb("screenshots").default([]),
  strategy: text("strategy"),
  marketCondition: text("market_condition"),
  sessionType: text("session_type"), // London, New York, etc.
  entryTime: timestamp("entry_time").notNull(),
  exitTime: timestamp("exit_time"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateUserSchema = createInsertSchema(users).omit({
  id: true,
  password: true,
  createdAt: true,
  updatedAt: true,
}).partial();

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = insertUserSchema.extend({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const insertTradeSchema = createInsertSchema(trades).omit({
  id: true,
  userId: true,
  pnl: true,
  returnPercent: true,
  riskReward: true,
  createdAt: true,
  updatedAt: true,
});

export const quickTradeSchema = z.object({
  symbol: z.string().min(1, "Symbol is required"),
  type: z.enum(["Long", "Short"]),
  entryPrice: z.string().min(1, "Entry price is required"),
  exitPrice: z.string().optional(),
  quantity: z.string().min(1, "Quantity is required"),
  mood: z.number().min(1).max(5),
  notes: z.string().optional(),
  tags: z.array(z.string()).default([]),
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
export type LoginRequest = z.infer<typeof loginSchema>;
export type RegisterRequest = z.infer<typeof registerSchema>;
export type Trade = typeof trades.$inferSelect;
export type InsertTrade = z.infer<typeof insertTradeSchema>;
export type QuickTradeRequest = z.infer<typeof quickTradeSchema>;
