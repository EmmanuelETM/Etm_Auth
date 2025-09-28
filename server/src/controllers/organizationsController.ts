import { type Context } from "hono";
import { OrgsService } from "../services/organizationsService";
import { getValidatedData } from "../middleware/schemaMiddleware";

export class OrgsController {
  constructor() {}

  getAll = async (c: Context) => {
    const orgs = await OrgsService.getAll();

    if (!orgs) {
      c.status(500);
      return c.json({ message: "something went wrong" });
    }

    return c.json(orgs);
  };

  getById = async (c: Context) => {
    const { id } = c.req.param();

    const user = await OrgsService.getById({ id });

    if (!user) {
      return c.json({ message: "User not found!" }, 404);
    }

    return c.json(user);
  };

  create = async (c: Context) => {
    const data = getValidatedData(c);

    const result = await OrgsService.create({ ...data });

    if (!result) return c.json({ message: "something went wrong" }, 500);

    return c.json({ message: "Organization created!", id: result });
  };

  update = async (c: Context) => {};
  delete = async (c: Context) => {};
}
