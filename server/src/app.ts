import { Hono } from "hono";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";

// Routers
import { createAdminRouter } from "./routers/adminRouter";
import { createApiKeyRouter } from "./routers/apiKeyRouter";
import { createAuthRouter } from "./routers/authRouter";
import { createHealthRouter } from "./routers/healthRouter";
import { createOrgsRouter } from "./routers/organizationsRouter";
import { createPublicRouter } from "./routers/publicRouter";
import { createSessionsRouter } from "./routers/sessionsRouter";
import { createUsersRouter } from "./routers/usersRouter";
import { createWsRouter } from "./routers/wsRouter";

// Types

export const createApp = () => {
  const app = new Hono();

  // ========= Middlewares =========
  app.use(logger());
  app.use(secureHeaders());

  // =========== Routes ============

  // Create Routers
  const adminRouter = createAdminRouter();
  const apiKeyRouter = createApiKeyRouter();
  const authRouter = createAuthRouter();
  const healthRouter = createHealthRouter();
  const orgsRouter = createOrgsRouter();
  const publicRouter = createPublicRouter();
  const sessionsRouter = createSessionsRouter();
  const usersRouter = createUsersRouter();
  const wsRouter = createWsRouter();

  // Use Routers
  app.route("/admin", adminRouter);
  app.route("/api-key", apiKeyRouter);
  app.route("/auth", authRouter);
  app.route("/health", healthRouter);
  app.route("/organizations", orgsRouter);
  app.route("/api/v1", publicRouter);
  app.route("/sessions", sessionsRouter);
  app.route("/users", usersRouter);
  app.route("/ws", wsRouter);

  // ======== Other stuff ==========

  app.notFound((c) => {
    return c.json({ message: "Not Found" }, 404);
  });

  return app;
};
