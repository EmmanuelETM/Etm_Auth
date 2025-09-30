import { Context } from "hono";
import { HTTPResponseError } from "hono/types";
import { AppError } from "./errors";

export const errorHandler = (err: Error | HTTPResponseError, c: Context) => {
  if (err instanceof AppError) {
    // Only log if it's not an operational error
    if (!err.isOperational) {
      console.error("Non-operational AppError:", {
        message: err.message,
        statusCode: err.statusCode,
        stack: err.stack,
      });
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
  console.error("Unexpected error:", {
    message: err.message,
    stack: err.stack,
  });

  return c.json(
    {
      success: false,
      message: "Internal server error",
    },
    500
  );
};
