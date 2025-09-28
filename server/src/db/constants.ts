export const TOKEN_TYPE = [
  "email_verification",
  "password_reset",
  "email_change",
] as const;

export const USER_ROLE = ["user", "admin"] as const;

export const ACTIVITY_ACTION = [
  "login",
  "logout",
  "user_created",
  "user_updated",
  "user_deleted",
  "password_changed",
  "email_verified",
  "api_key_created",
  "api_key_revoked",
  "organization_updated",
] as const;

export const RESOURCE_TYPE = [
  "user",
  "organization",
  "api_key",
  "webhook",
  "session",
] as const;

export const SUBSCRIPTION_TIER = ["free", "pro", "enterprise"] as const;
