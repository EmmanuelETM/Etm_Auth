import * as dotenv from "dotenv";
import { resolve } from "path";

// Determine NODE_ENV
const NODE_ENV = process.env.NODE_ENV ?? "development";
dotenv.config({ path: resolve(process.cwd(), `.env.${NODE_ENV}`) });

export const config = {
  NODE_ENV,
  PORT: process.env.PORT,
  DATABASE_URL: process.env.DATABASE_URL,
};

export type Config = typeof config;
