import { pgTable, foreignKey, unique, varchar, timestamp, boolean, text } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const users = pgTable("users", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	email: varchar({ length: 255 }).notNull(),
	password: varchar({ length: 255 }).notNull(),
	dateBirth: timestamp("date_birth", { mode: 'string' }).notNull(),
	orgId: varchar("org_id", { length: 255 }).notNull(),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
	deletedAt: timestamp({ mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.orgId],
			foreignColumns: [organizations.id],
			name: "users_org_id_organizations_id_fk"
		}),
	unique("users_email_unique").on(table.email),
]);

export const activityLogs = pgTable("activity_logs", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	userId: varchar("user_id", { length: 255 }).notNull(),
	action: varchar().notNull(),
	ipAddress: varchar("ip_address", { length: 255 }).notNull(),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "activity_logs_user_id_users_id_fk"
		}),
]);

export const organizations = pgTable("organizations", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	domain: text().notNull(),
	logoUrl: text("logo_url"),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
	deletedAt: timestamp({ mode: 'string' }),
});

export const apiKeys = pgTable("api_keys", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	key: text().notNull(),
	orgId: varchar("org_id", { length: 255 }).notNull(),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
	deletedAt: timestamp({ mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.orgId],
			foreignColumns: [organizations.id],
			name: "api_keys_org_id_organizations_id_fk"
		}),
]);

export const refreshTokens = pgTable("refresh_tokens", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	userId: varchar("user_id", { length: 255 }).notNull(),
	tokenHash: text("token_hash").notNull(),
	deviceInfo: varchar("device_info", { length: 255 }).default('),
	userAgent: varchar("user_agent", { length: 512 }).default('),
	ipAddress: varchar("ip_address", { length: 512 }),
	expires: timestamp({ mode: 'string' }).notNull(),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
	deletedAt: timestamp({ mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "refresh_tokens_user_id_users_id_fk"
		}).onDelete("cascade"),
]);
