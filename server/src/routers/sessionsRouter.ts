import { Hono } from "hono";
import { SessionsController } from "../controllers/sessionsController";

export const createSessionsRouter = () => {
  const router = new Hono();
  const sessionsController = new SessionsController();

  // Active sessions
  router.get("/");
  router.delete("/:id"); // Revoke specific session
  router.delete("/"); // Revoke all sessions except current

  return router;
};
