import { eq } from "drizzle-orm";
import { db } from "../db";
import { users, type NewUser } from "../db/schema";
import * as bcrypt from "bcryptjs";

export class UsersService {
  static async create({
    name,
    email,
    password,
    birthDate,
    orgId,
    role,
  }: NewUser) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const result = await db
        .insert(users)
        .values({
          name,
          email,
          password: hashedPassword,
          birthDate,
          orgId,
          role,
        })
        .returning({ insertedId: users.id });

      if (!result) return null;
      return result[0].insertedId;
    } catch (err) {
      //handle error
      return null;
    }
  }

  static async getById({ id }: { id: string }) {
    try {
      const result = await db.query.users.findFirst({
        where: eq(users.id, id),
      });

      return result || null;
    } catch (error) {
      console.error("Failed to get user by id:", { id, error });
      throw new Error(
        `Failed to retrieve user: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  static async getAll() {
    try {
      const result = await db.query.users.findMany();
      return result;
    } catch (error) {
      console.log(error);
      return "Something went wrong";
    }
  }
}

// static async getById({ id }) {
//   try {
//     const result = await pool.query({
//       text: "select * from movie where id = $1",
//       values: [id],
//     });

//     if (result.rows.length === 0) return null;

//     return result.rows[0];
//   } catch (err) {
//     throw new Error(
//       `Error selecting movie by id: ${err.message} \n stack-trace: ${err.stack}`
//     );
//   }
// }
