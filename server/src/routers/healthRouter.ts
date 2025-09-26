import { Hono } from "hono";
import { HealthController } from "../controllers/healthController";

export const createHealthRouter = () => {
  const router = new Hono();
  const healthController = new HealthController();

  router.get("/"); // Health check endpoint
  router.get("/db"); // Database connectivity check
  router.get("/redis"); // Redis connectivity check

  return router;
};
