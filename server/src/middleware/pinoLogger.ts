import { pinoHttp } from "pino-http";
import { logger } from "../lib/logger";
import { MiddlewareHandler } from "hono";
import { type Context, type Next } from "hono";

const pinoLogger = pinoHttp({
  logger,
  customLogLevel: (_, res, err) => {
    if (res.statusCode >= 500 || err) return "error";
    if (res.statusCode >= 400) return "warn";
    return "info";
  },
  customSuccessMessage: (req, res) => {
    return `${req.method} ${req.url} ${res.statusCode}`;
  },
  customErrorMessage: (req, res, err) => {
    return `${req.method} ${req.url} ${res.statusCode} - ${err.message}`;
  },
});

export const pinoLoggerMiddleware: MiddlewareHandler = async (
  c: Context,
  next: Next
) => {
  c.env.incoming.id = c.var.requestId;

  await new Promise((resolve) =>
    pinoLogger(c.env.incoming, c.env.outgoing, () => resolve(undefined))
  );

  c.set("logger", c.env.incoming.log);

  await next();
};
