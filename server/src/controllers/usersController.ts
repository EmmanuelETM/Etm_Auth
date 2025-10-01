// controllers/usersController.ts
import { type Context } from "hono";
import { UsersService } from "../services/usersService";
import { getValidatedData } from "../middleware/schemaMiddleware";

export class UsersController {
  constructor() {}

  getAll = async (c: Context) => {
    const users = await UsersService.getAll();

    return c.json({
      success: true,
      data: users,
    });
  };

  getById = async (c: Context) => {
    const { id } = c.req.param();

    const user = await UsersService.getById({ id });

    return c.json({
      success: true,
      data: user,
    });
  };

  create = async (c: Context) => {
    const data = getValidatedData(c);

    const user = await UsersService.create({ ...data });

    return c.json(
      {
        success: true,
        message: "User created successfully",
        data: user,
      },
      201
    );
  };

  update = async (c: Context) => {
    const { id } = c.req.param();
    const data = getValidatedData(c);

    const user = await UsersService.update({ id, data });

    return c.json({
      success: true,
      data: user,
    });
  };

  delete = async (c: Context) => {
    const { id } = c.req.param();

    await UsersService.delete({ id });
    return c.json({
      success: true,
      message: "User deleted",
    });
  };

  activate = async (c: Context) => {};
  updateRole = async (c: Context) => {};
}
