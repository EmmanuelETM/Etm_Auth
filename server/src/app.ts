import { Hono } from "hono";
import { Logger } from "pino";

// Middlewares
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";
import { requestId } from "hono/request-id";
import { pinoLoggerMiddleware } from "./middleware/pinoLogger";

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

import { errorHandler } from "./lib/errorHandler";

declare module "hono" {
  interface ContextVariableMap {
    logger: Logger;
    requestId: string;
  }
}

export const createApp = () => {
  const app = new Hono();

  // ========= Middlewares =========
  app.use(logger());
  app.use(secureHeaders());
  app.use(requestId());
  app.use(pinoLoggerMiddleware);

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

  app.onError(errorHandler);

  app.get("/test-error", (c) => {
    c.var.logger.info("Testing error handling");
    throw new Error("Test error");
  });

  app.notFound((c) => {
    return c.json({ message: "Not Found" }, 404);
  });

  return app;
};
