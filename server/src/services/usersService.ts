import { db } from "../db";

export class UsersService {
  static async create() {}

  static async getAll() {
    try {
      const result = await db.query.users.findMany();
      return result;
    } catch (error) {
      return error;
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
