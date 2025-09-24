import { Hono } from "hono";
import { config } from "./config";

import "dotenv/config";

const app = new Hono();
const port = config.PORT || 4000;

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

export default {
  port,
  fetch: app.fetch,
};
