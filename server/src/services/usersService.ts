// services/usersService.ts
import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { users, type NewUser } from "../db/schema";
import * as bcrypt from "bcryptjs";
import { NotFoundError, ConflictError } from "../lib/errors";
import { password } from "bun";

export class UsersService {
  static async getAll() {
    const result = await db.query.users.findMany({
      columns: {
        password: false,
      },
    });

    return result;
  }

  static async getById({ id }: { id: string }) {
    const user = await db.query.users.findFirst({
      where: eq(users.id, id),
      columns: {
        password: false,
      },
    });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    return user;
  }

  static async getByEmail({ email, orgId }: { email: string; orgId: string }) {
    const user = await db.query.users.findFirst({
      where: and(eq(users.email, email), eq(users.orgId, orgId)),
      columns: {
        password: false,
      },
    });

    return user ?? null;
  }

  static async create({
    name,
    email,
    password,
    birthDate,
    orgId,
    role,
  }: NewUser) {
    // Check if user exists
    const existing = await this.getByEmail({ email, orgId });
    if (existing) {
      throw new ConflictError("User with this email already exists");
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user
    const [newUser] = await db
      .insert(users)
      .values({
        name,
        email,
        password: hashedPassword,
        birthDate,
        orgId,
        role,
      })
      .returning();

    if (!newUser) {
      throw new Error("Failed to create user");
    }

    const { password: _, ...user } = newUser;
    return user;
  }

  static async update({ id, data }: { id: string; data: Partial<NewUser> }) {
    await this.getById({ id });
    let updatedData = { ...data };

    if (data.password) {
      const salt = await bcrypt.genSalt(10);
      updatedData.password = await bcrypt.hash(data.password, salt);
    }

    const [updated] = await db
      .update(users)
      .set(updatedData)
      .where(eq(users.id, id))
      .returning();

    if (!updated) {
      throw new Error("Failed to update User");
    }

    const { password: _, ...user } = updated;
    return user;
  }

  static async delete({ id }: { id: string }) {
    await this.getById({ id });

    const [deleted] = await db
      .delete(users)
      .where(eq(users.id, id))
      .returning();

    if (!deleted) {
      throw new Error("Failed to delete User");
    }

    const { password: _, ...user } = deleted;

    return user;
  }

  static async activate() {}
}
