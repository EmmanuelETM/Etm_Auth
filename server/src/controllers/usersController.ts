import { type Context } from "hono";
import { UsersService } from "../services/usersService";
import { getValidatedData } from "../middleware/schemaMiddleware";

export class UsersController {
  constructor() {}

  getAll = async (c: Context) => {
    const users = await UsersService.getAll();

    if (!users) {
      return c.json({ message: "something went wrong" }, 500);
    }

    return c.json(users);
  };

  getById = async (c: Context) => {
    const { id } = c.req.param();

    const user = await UsersService.getById({ id });

    if (!user) {
      return c.json(
        {
          message: "User not found",
        },
        404
      );
    }

    return c.json(user);
  };

  create = async (c: Context) => {
    const data = getValidatedData(c);
    const password = data.password;

    const result = await UsersService.create({ ...data });

    if (!result) {
      return c.json({ message: "something went wrong" }, 500);
    }

    return c.json({ message: "User created!", id: result });
  };

  update = async (c: Context) => {};
  delete = async (c: Context) => {};
}
