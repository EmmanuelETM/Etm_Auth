import { Hono } from "hono";
import { PublicController } from "../controllers/publicController";

export const createPublicRouter = () => {
  const router = new Hono();
  const publicController = new PublicController();

  // Token verification for external apps
  router.post("/verify-token"); // Verify access token
  router.get("/user"); // Get user info with valid token
  router.post("/authenticate"); // Api key auth

  // Webhooks
  router.post("/webhooks");
  router.get("/webhooks");
  router.delete("/webhooks/:id");

  return router;
};
