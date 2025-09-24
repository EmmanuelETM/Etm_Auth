import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { config } from "../config";
import * as schema from "./schema";
import "dotenv/config";

const sql = neon(config.DATABASE_URL!);
export const db = drizzle(sql, { schema });

// import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
// import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
// import { neon } from "@neondatabase/serverless";
// import { Pool } from "pg";
// import { config } from "../config";
// import * as schema from "./schema";
// import "dotenv/config";
//let db;
// if (config.NODE_ENV === "production") {
//   const sql = neon(config.DATABASE_URL!);
//   db = drizzleNeon(sql, { schema });
// } else {
//   const pool = new Pool({
//     connectionString: config.DATABASE_URL!,
//   });
//   db = drizzlePg(pool, { schema });
// }
//export {db}
