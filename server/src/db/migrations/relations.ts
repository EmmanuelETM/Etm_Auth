import { relations } from "drizzle-orm/relations";
import { organizations, users, activityLogs, apiKeys, refreshTokens } from "./schema";

export const usersRelations = relations(users, ({one, many}) => ({
	organization: one(organizations, {
		fields: [users.orgId],
		references: [organizations.id]
	}),
	activityLogs: many(activityLogs),
	refreshTokens: many(refreshTokens),
}));

export const organizationsRelations = relations(organizations, ({many}) => ({
	users: many(users),
	apiKeys: many(apiKeys),
}));

export const activityLogsRelations = relations(activityLogs, ({one}) => ({
	user: one(users, {
		fields: [activityLogs.userId],
		references: [users.id]
	}),
}));

export const apiKeysRelations = relations(apiKeys, ({one}) => ({
	organization: one(organizations, {
		fields: [apiKeys.orgId],
		references: [organizations.id]
	}),
}));

export const refreshTokensRelations = relations(refreshTokens, ({one}) => ({
	user: one(users, {
		fields: [refreshTokens.userId],
		references: [users.id]
	}),
}));