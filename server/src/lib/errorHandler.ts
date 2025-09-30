import { Context } from "hono";
import { AppError } from "./errors"; // Adjust path as needed
import { logger } from "./logger"; // Import the base logger

export function errorHandler(err: Error, c: Context) {
  const log = c.get("logger") ?? logger;

  if (err instanceof AppError) {
    if (!err.isOperational) {
      log.error(
        {
          err,
          statusCode: err.statusCode,
          path: c.req.path,
          method: c.req.method,
        },
        "Non-operational AppError"
      );
    }

    return c.json(
      {
        success: false,
        message: err.message,
      },
      err.statusCode as any
    );
  }

  // Log all unexpected errors
  log.error(
    {
      err,
      path: c.req.path,
      method: c.req.method,
    },
    "Unexpected error"
  );

  return c.json(
    {
      success: false,
      message: "Internal server error",
    },
    500
  );
}
