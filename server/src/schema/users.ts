import { z } from "zod";
import { users } from "../db/schema";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";

const baseInsertSchema = createInsertSchema(users);
export const UserInsertSchema = baseInsertSchema.extend({
  birthDate: z.coerce.date(),
  password: z
    .string()
    .min(8, { message: "Must contain at least 8 characters" }),
});

// const passwordSchema = z
//   .string()
//   .min(8, { message: "min 8" })
//   .max(20, { message: "max 20" })
//   .refine((password) => /[A-Z]/.test(password), { message: "Must contain uppercase" })
//   .refine((password) => /[a-z]/.test(password), { message: "Must contain lowercase" })
//   .refine((password) => /[0-9]/.test(password), { message: "Must contain number" })
//   .refine((password) => /[!@#$%^&*]/.test(password), { message: "Must contain special character" });

export const UserSelectSchema = createSelectSchema(users);
export const UserUpdateSchema = createUpdateSchema(users);
