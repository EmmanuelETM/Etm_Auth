import { Hono } from "hono";
import { OrgsController } from "../controllers/organizationsController";
import { schemaMiddleware } from "../middleware/schemaMiddleware";
import { OrgInsertSchema } from "../schema/organizations";

export const createOrgsRouter = (): Hono => {
  const router = new Hono();
  const orgsController = new OrgsController();

  // Org operations
  router.get("/current"); // Get current user's organization
  router.patch("/current");
  router.get("/stats"); // Org statistics and metrics

  // Org members
  router.get("/members"); // List all org members
  router.get("/activity"); // Org Activity feed

  // Admin Operations
  router.get("/", orgsController.getAll);
  router.get("/:id", orgsController.getById);
  router.post(
    "/",
    schemaMiddleware({ schema: OrgInsertSchema }),
    orgsController.create
  );
  router.patch("/:id");
  router.delete("/:id");

  return router;
};
