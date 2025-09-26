import { Hono } from "hono";
import { ApiKeyController } from "../controllers/apiKeyController";

export const createApiKeyRouter = () => {
  const router = new Hono();
  const apiKeyController = new ApiKeyController();

  // Key operations
  router.get("/");
  router.post("/");
  router.patch("/:id");
  router.delete("/:id");
  router.post("/:id/regen");

  // Key analytics
  router.get("/:id/usage");
  router.get("/:id/logs");

  return router;
};
