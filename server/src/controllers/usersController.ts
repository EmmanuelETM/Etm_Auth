import { type Context } from "hono";
import { UsersService } from "../services/usersService";
import { getValidatedData } from "../middleware/schemaMiddleware";

export class UsersController {
  constructor() {}

  getAll = async (c: Context) => {
    const users = await UsersService.getAll();

    if (!users) {
      c.status(500);
      return c.json({ message: "something went wrong" });
    }

    return c.json(users);
  };

  getById = async (c: Context) => {};

  create = async (c: Context) => {
    const data = getValidatedData(c);

    return c.json(data);
  };
  update = async (c: Context) => {};
  delete = async (c: Context) => {};
}
