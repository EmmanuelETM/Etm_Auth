import * as dotenv from "dotenv";
import { resolve } from "path";

// Determine NODE_ENV
const NODE_ENV = process.env.NODE_ENV ?? "development";
dotenv.config({ path: resolve(process.cwd(), `.env.${NODE_ENV}`) });

export const config = {
  NODE_ENV,
  PORT: process.env.PORT,
  DATABASE_URL: process.env.DATABASE_URL,
  LOG_LEVEL: process.env.LOG_LEVEL,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY,
  BCRYPT_ROUNDS: Number(process.env.BCRYPT_ROUNDS) ?? 10,
};

export type Config = typeof config;
