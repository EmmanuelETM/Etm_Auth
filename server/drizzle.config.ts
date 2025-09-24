import { defineConfig } from "drizzle-kit";
import { config } from "./src/config";
import { resolve } from "path";

if (!config.DATABASE_URL) {
  throw new Error(
    `DATABASE_URL is not defined. Make sure .env.${config.NODE_ENV} contains it`
  );
}

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: config.DATABASE_URL!,
  },
});
