import { z } from "zod";
import { organizations } from "../db/schema";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";

const baseInsertSchema = createInsertSchema(organizations);

export const OrgInsertSchema = baseInsertSchema.extend({
  domain: z.url(),
});

export const OrgSelectSchema = createSelectSchema(organizations);
export const OrgUpdateSchema = createUpdateSchema(organizations).partial();
