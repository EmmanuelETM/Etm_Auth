import { pino } from "pino";
import { config } from "../config";

export const logger = pino({
  level: config.LOG_LEVEL || "info",
  transport:
    config.NODE_ENV === "development"
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "SYS:standard",
            ignore: "pid,hostname",
          },
        }
      : undefined,
  base: {
    env: config.NODE_ENV || "development",
  },
});
