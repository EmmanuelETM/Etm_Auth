import { relations } from "drizzle-orm";
import {
  index,
  integer,
  pgTable,
  pgEnum,
  primaryKey,
  text,
  timestamp,
  varchar,
  boolean,
  time,
} from "drizzle-orm/pg-core";

// Recurrent columns on tables

const id = varchar("id", { length: 255 })
  .notNull()
  .primaryKey()
  .$defaultFn(() => crypto.randomUUID());
const createdAt = timestamp("createdAt").notNull().defaultNow();
const updatedAt = timestamp("updatedAt")
  .notNull()
  .defaultNow()
  .$onUpdate(() => new Date());
const isActive = boolean("is_active").default(true);
const deletedAt = timestamp("deletedAt");

export const organizations = pgTable("organizations", {
  id,
  name: varchar("name", { length: 255 }).notNull(),
  domain: text("domain").notNull(),
  logo_url: text("logo_url"),
  isActive,
  createdAt,
  updatedAt,
  deletedAt,
});

export const organizationsRelations = relations(organizations, ({ many }) => ({
  users: many(users),
  ApiKeys: many(apiKeys),
}));

export const users = pgTable("users", {
  id,
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  date_birth: timestamp("date_birth").notNull(),
  orgId: varchar("org_id", { length: 255 })
    .notNull()
    .references(() => organizations.id),
  isActive,
  createdAt,
  updatedAt,
  deletedAt,
});

export const usersRelations = relations(users, ({ many, one }) => ({
  organizations: one(organizations),
  activityLogs: many(activityLogs),
  refreshTokens: many(refreshTokens),
}));

export const apiKeys = pgTable("api_keys", {
  id,
  name: varchar({ length: 255 }).notNull(),
  key: text("key").notNull(),
  orgId: varchar("org_id", { length: 255 })
    .notNull()
    .references(() => organizations.id),
  isActive,
  createdAt,
  updatedAt,
  deletedAt,
});

export const apiKeysRelations = relations(apiKeys, ({ one }) => ({
  organizations: one(organizations),
}));

export const activityLogs = pgTable("activity_logs", {
  id,
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => users.id),
  action: varchar("action").notNull(),
  ipAddress: varchar("ip_address", { length: 255 }).notNull(),
  createdAt,
});

export const activityLogsRelations = relations(activityLogs, ({ one }) => ({
  users: one(users),
}));

export const refreshTokens = pgTable("refresh_tokens", {
  id,
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  tokenHash: text("token_hash").notNull(),
  deviceInfo: varchar("device_info", { length: 255 }).default(""),
  userAgent: varchar("user_agent", { length: 512 }).default(""),
  ipAddress: varchar("ip_address", { length: 512 }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
  isActive,
  createdAt,
  updatedAt,
  deletedAt,
});

export const refreshTokensRelations = relations(refreshTokens, ({ one }) => ({
  users: one(users),
}));
