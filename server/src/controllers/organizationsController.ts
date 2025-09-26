import { type Context } from "hono";
import { OrgsService } from "../services/organizationsService";

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
  getById = async (c: Context) => {};
  update = async (c: Context) => {};
  delete = async (c: Context) => {};
}
