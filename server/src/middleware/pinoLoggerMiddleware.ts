import { logger } from "../lib/logger";
import { pinoLogger } from "hono-pino";

export const pinoLoggerMiddleware = pinoLogger({
  pino: logger,
  http: {
    reqId: () => crypto.randomUUID(),
  },
});
