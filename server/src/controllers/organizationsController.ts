import { type Context } from "hono";
import { OrgsService } from "../services/organizationsService";
import { getValidatedData } from "../middleware/schemaMiddleware";

export class OrgsController {
  constructor() {}

  getAll = async (c: Context) => {
    const orgs = await OrgsService.getAll();

    if (!orgs) {
      c.status(500);
      return c.json({ success: false, message: "something went wrong" });
    }

    return c.json({ success: true, data: orgs });
  };

  getById = async (c: Context) => {
    const { id } = c.req.param();

    const user = await OrgsService.getById({ id });

    if (!user) {
      return c.json({ success: false, message: "User not found!" }, 404);
    }

    return c.json({ success: true, data: user });
  };

  create = async (c: Context) => {
    const data = getValidatedData(c);

    const result = await OrgsService.create({ ...data });

    if (!result)
      return c.json({ success: false, message: "something went wrong" }, 500);

    return c.json({
      success: true,
      message: "Organization created!",
      data: result,
    });
  };

  update = async (c: Context) => {
    const { id } = c.req.param();
    const data = getValidatedData(c);

    const result = await OrgsService.update({ id, data });

    if (!result)
      return c.json({ success: false, message: "something went wrong" }, 500);

    return c.json({
      success: true,
      message: "Organization Updated!",
      data: result,
    });
  };

  delete = async (c: Context) => {
    const { id } = c.req.param();

    const result = await OrgsService.delete({ id });

    if (!result)
      return c.json({ success: false, message: "something went wrong" }, 500);

    return c.json({
      success: true,
      message: "Organization Updated!",
      data: result,
    });
  };
}
