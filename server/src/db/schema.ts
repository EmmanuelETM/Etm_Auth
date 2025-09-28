import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  varchar,
  boolean,
  json,
  integer,
  unique,
  pgEnum,
} from "drizzle-orm/pg-core";

import {
  TOKEN_TYPE,
  USER_ROLE,
  ACTIVITY_ACTION,
  RESOURCE_TYPE,
  SUBSCRIPTION_TIER,
} from "./constants";

// Recurrent columns on tables

const id = varchar("id", { length: 255 })
  .notNull()
  .primaryKey()
  .$defaultFn(() => crypto.randomUUID());

const userId = varchar("user_id", { length: 255 })
  .notNull()
  .references(() => users.id, {
    onDelete: "cascade",
  });
const orgId = varchar("org_id", { length: 255 })
  .notNull()
  .references(() => organizations.id, {
    onDelete: "cascade",
  });

const createdAt = timestamp("createdAt").notNull().defaultNow();
const updatedAt = timestamp("updatedAt")
  .notNull()
  .defaultNow()
  .$onUpdate(() => new Date());
const expiresAt = timestamp("expires_at", { mode: "date" }).notNull();
const isActive = boolean("is_active").default(true);

//enums

export const TokenType = pgEnum("token_type", TOKEN_TYPE);
export const UserRole = pgEnum("user_role", USER_ROLE);
export const ActivityAction = pgEnum("activity_action", ACTIVITY_ACTION);
export const ResourceType = pgEnum("resource_type", RESOURCE_TYPE);
export const SubscriptionTier = pgEnum("subscription_tier", SUBSCRIPTION_TIER);

export const organizations = pgTable("organizations", {
  id,
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  domain: varchar("domain", { length: 255 }),
  logo_url: text("logo_url"),
  settings: json("settings").$type<Record<string, any>>().default({}),
  subscriptionTier: SubscriptionTier("subscription_tier")
    .default("free")
    .notNull(),
  domainVerifiedAt: timestamp("domain_verified_at"),
  createdAt,
  updatedAt,
  isActive,
});

export const organizationsRelations = relations(organizations, ({ many }) => ({
  users: many(users),
  apiKeys: many(apiKeys),
  activityLogs: many(activityLogs),
  userInvitations: many(userInvitations),
  webhooks: many(webhooks),
}));

export const users = pgTable(
  "users",
  {
    id,
    orgId,
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: varchar("password", { length: 255 }).notNull(),
    birthDate: timestamp("birth_date").notNull(),
    role: UserRole("role").default("user"),
    emailVerified: boolean("email_verified").$default(() => false),
    emailVerifiedAt: timestamp("email_verified_at"),
    lastLoginAt: timestamp("last_login_at"),
    loginCount: integer("loginCount").default(0).notNull(),
    isActive,
    createdAt,
    updatedAt,
  },
  (t) => ({
    UniqueOrgEmail: unique("unique_org_email").on(t.orgId, t.email),
  })
);

export const usersRelations = relations(users, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [users.orgId],
    references: [organizations.id],
  }),
  refreshTokens: many(refreshTokens),
  emailVerificationTokens: many(emailVerificationTokens),
  activityLogs: many(activityLogs),
  createdApiKeys: many(apiKeys, {
    relationName: "createdApiKeys",
  }),
  sentInvitations: many(userInvitations, {
    relationName: "sentInvitations",
  }),
  createdWebhooks: many(webhooks, {
    relationName: "createdWebhooks",
  }),
}));

export const apiKeys = pgTable("api_keys", {
  id,
  orgId,
  createdByUserId: varchar("created_by_user_id", { length: 255 })
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),
  name: varchar({ length: 255 }).notNull(),
  key: text("key").notNull(),
  permissions: json("permissions").$type<string[]>().default([]),
  lastUsedAt: timestamp("last_used_at"),
  usageCount: integer("usage_count").default(0).notNull(),
  expiresAt: timestamp("expires_at", { mode: "date" }).notNull(),
  isActive,
  createdAt,
});

export const apiKeysRelations = relations(apiKeys, ({ one }) => ({
  organization: one(organizations, {
    fields: [apiKeys.orgId],
    references: [organizations.id],
  }),
  createdByUser: one(users, {
    fields: [apiKeys.createdByUserId],
    references: [users.id],
    relationName: "createdApiKeys",
  }),
}));

export const activityLogs = pgTable("activity_logs", {
  id,
  userId,
  orgId,
  action: ActivityAction("activity_action").notNull(),
  resourceType: ResourceType("resource_type").notNull(),
  ipAddress: varchar("ip_address", { length: 255 }).notNull(),
  metadata: json("metadata").$type<Record<string, any>>().default({}),
  createdAt,
});

export const activityLogsRelations = relations(activityLogs, ({ one }) => ({
  users: one(users),
}));

export const refreshTokens = pgTable("refresh_tokens", {
  id,
  userId,
  token: text("token").notNull(),
  deviceInfo: varchar("device_info", { length: 255 }).default(""),
  userAgent: varchar("user_agent", { length: 512 }).default(""),
  ipAddress: varchar("ip_address", { length: 512 }),
  lastUsedAt: timestamp("last_used_at"),
  expiresAt,
  createdAt,
  isActive,
});

export const refreshTokensRelations = relations(refreshTokens, ({ one }) => ({
  user: one(users, {
    fields: [refreshTokens.userId],
    references: [users.id],
  }),
}));

export const emailVerificationTokens = pgTable("email_verification_tokens", {
  id,
  userId,
  token: varchar("token", { length: 255 }).notNull(),
  tokenType: TokenType("token_type").default("email_verification"),
  expiresAt,
  createdAt,
});

export const emailVerificationTokensRelations = relations(
  emailVerificationTokens,
  ({ one }) => ({
    user: one(users, {
      fields: [emailVerificationTokens.userId],
      references: [users.id],
    }),
  })
);

export const userInvitations = pgTable("user_invitations", {
  id,
  orgId,
  invitedByUserId: varchar("invited_by_user_id", { length: 255 })
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),
  email: varchar("email", { length: 255 }).notNull(),
  role: UserRole("role").default("user"),
  token: text("token").notNull(),
  acceptedAt: timestamp("accepted_at"),
  expiresAt,
  createdAt,
});

export const userInvitationsRelations = relations(
  userInvitations,
  ({ one }) => ({
    organization: one(organizations, {
      fields: [userInvitations.orgId],
      references: [organizations.id],
    }),
    invitedByUser: one(users, {
      fields: [userInvitations.invitedByUserId],
      references: [users.id],
      relationName: "sentInvitations",
    }),
  })
);

export const webhooks = pgTable("webhooks", {
  id,
  orgId,
  createdByUserId: varchar("created_by_user_id", { length: 255 })
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),
  name: varchar("name", { length: 255 }).notNull(),
  url: text("url").notNull(),
  events: json("events").$type<string[]>().notNull().default([]),
  secret: text("secret").notNull(),
  lastTriggeredAt: timestamp("last_triggered_at"),
  failureCount: integer("failure_count").default(0).notNull(),
  createdAt,
  updatedAt,
  isActive,
});

export const webhooksRelations = relations(webhooks, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [webhooks.orgId],
    references: [organizations.id],
  }),
  createdByUser: one(users, {
    fields: [webhooks.createdByUserId],
    references: [users.id],
    relationName: "createdWebhooks",
  }),
  deliveries: many(webhookDeliveries),
}));

export const webhookDeliveries = pgTable("webhook_deliveries", {
  id,
  webhookId: varchar("webhook_id", { length: 255 })
    .notNull()
    .references(() => webhooks.id, {
      onDelete: "cascade",
    }),
  eventType: varchar("event_type", { length: 100 }).notNull(),
  payload: json("payload").$type<Record<string, any>>().notNull(),
  responseStatus: integer("response_status"),
  responseBody: text("response_body"),
  deliveredAt: timestamp("delivered_at"),
  createdAt,
});

export const webhookDeliveriesRelations = relations(
  webhookDeliveries,
  ({ one }) => ({
    webhook: one(webhooks, {
      fields: [webhookDeliveries.webhookId],
      references: [webhooks.id],
    }),
  })
);

// ========================== Types =============================

export type Organization = typeof organizations.$inferSelect;
export type NewOrganization = typeof organizations.$inferInsert;

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type RefreshToken = typeof refreshTokens.$inferSelect;
export type NewRefreshToken = typeof refreshTokens.$inferInsert;

export type EmailVerificationToken =
  typeof emailVerificationTokens.$inferSelect;
export type NewEmailVerificationToken =
  typeof emailVerificationTokens.$inferInsert;

export type UserInvitation = typeof userInvitations.$inferSelect;
export type NewUserInvitation = typeof userInvitations.$inferInsert;

export type ApiKey = typeof apiKeys.$inferSelect;
export type NewApiKey = typeof apiKeys.$inferInsert;

export type ActivityLog = typeof activityLogs.$inferSelect;
export type NewActivityLog = typeof activityLogs.$inferInsert;

export type Webhook = typeof webhooks.$inferSelect;
export type NewWebhook = typeof webhooks.$inferInsert;

export type WebhookDelivery = typeof webhookDeliveries.$inferSelect;
export type NewWebhookDelivery = typeof webhookDeliveries.$inferInsert;
