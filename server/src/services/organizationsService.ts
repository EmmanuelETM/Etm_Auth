import { db } from "../db";

export class OrgsService {
  static async create() {}
  static async getAll() {
    try {
      const result = await db.query.organizations.findMany();
      return result;
    } catch (err) {
      return;
    }
  }
}
