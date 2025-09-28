import { eq } from "drizzle-orm";
import { db } from "../db";
import { organizations, type NewOrganization } from "../db/schema";

export class OrgsService {
  static async getAll() {
    try {
      const result = await db.query.organizations.findMany();
      return result;
    } catch (err) {
      return;
    }
  }

  static async getById({ id }: { id: string }) {
    try {
      const result = await db.query.organizations.findFirst({
        where: eq(organizations.id, id),
      });

      if (!result) {
        return null;
      }

      return result;
    } catch (err) {
      //handle errr
      return null;
    }
  }

  static async create({
    name,
    slug,
    domain,
    logo_url,
    settings,
    subscriptionTier,
  }: NewOrganization) {
    try {
      const result = await db
        .insert(organizations)
        .values({ name, slug, domain, logo_url, settings, subscriptionTier })
        .returning({ insertedId: organizations.id });

      if (!result) return null;
      return result[0].insertedId;
    } catch (err) {
      //handle error
      return null;
    }
  }
}
