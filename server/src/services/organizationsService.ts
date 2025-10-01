import { eq } from "drizzle-orm";
import { db } from "../db";
import { organizations, type NewOrganization } from "../db/schema";
import { NotFoundError } from "../lib/errors";

export class OrgsService {
  static async getAll() {
    const result = await db.query.organizations.findMany();

    return result;
  }

  static async getById({ id }: { id: string }) {
    const result = await db.query.organizations.findFirst({
      where: eq(organizations.id, id),
    });

    if (!result) {
      throw new NotFoundError("Organization not found");
    }

    return result;
  }

  static async create({
    name,
    slug,
    domain,
    logo_url,
    settings,
    subscriptionTier,
  }: NewOrganization) {
    //
    const [result] = await db
      .insert(organizations)
      .values({
        name,
        slug,
        domain,
        logo_url,
        settings,
        subscriptionTier,
      })
      .returning();

    if (!result) {
      throw new Error("Error while creating Organization");
    }

    return result;
  }

  static async update({
    id,
    data,
  }: {
    id: string;
    data: Partial<NewOrganization>;
  }) {
    await this.getById({ id });

    const [updated] = await db
      .update(organizations)
      .set({ ...data })
      .where(eq(organizations.id, id))
      .returning();

    if (!updated) {
      throw new Error("Error updating organization");
    }

    return updated;
  }

  static async delete({ id }: { id: string }) {
    await this.getById({ id });

    const [deleted] = await db
      .delete(organizations)
      .where(eq(organizations.id, id))
      .returning();

    if (!deleted) {
      throw new Error("Error deleting organization");
    }

    return deleted;
  }
}
