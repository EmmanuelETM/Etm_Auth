import { Hono } from "hono";
import { AdminController } from "../controllers/adminController";

export const createAdminRouter = () => {
  const router = new Hono();
  const adminController = new AdminController();

  // System administration (system wide)
  router.get("/stats");
  router.get("/organizations");
  router.get("/users");
  router.get("/activity");

  // System management
  router.post("/organizations");
  router.patch("/organizations/:id");
  router.delete("/organizations/:id");

  return router;
};
