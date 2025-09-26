import { type Context } from "hono";

export class AuthController {
  constructor() {}

  register = async (c: Context) => {
    return c.json("espico");
  };

  login = async (c: Context) => {};
  refresh = async (c: Context) => {};
  logout = async (c: Context) => {};
  logout_all = async (c: Context) => {};
  verify = async (c: Context) => {};
  reset_password = async (c: Context) => {};
}

// getAll = async (req, res) => {
//   const { genre } = req.query;
//   const movies = await this.movieModel.getAll({ genre });

//   return res.json(movies);
// };
