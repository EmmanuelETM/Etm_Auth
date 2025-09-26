import { type Context, type Next } from "hono";
import { type ZodObject } from "zod";

interface SchemaMiddlewareProps {
  schema: ZodObject<any, any>;
}

export function schemaMiddleware({ schema }: SchemaMiddlewareProps) {
  return async (c: Context, next: Next) => {
    try {
      const data = await c.req.json();

      const result = schema.safeParse(data);

      if (!result.success) {
        return c.json(
          {
            error: "Validation failed",
            details: result.error.issues,
          },
          400
        );
      }

      c.set("validatedData", result.data);
      await next();
    } catch (error) {
      return c.json(
        {
          error: "Something went wrong with validation",
          details: error,
        },
        500
      );
    }
  };
}

export function getValidatedData(c: Context) {
  return c.get("validatedData");
}
