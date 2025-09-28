import { Hono } from "hono";
import { UsersController } from "../controllers/usersController";
import { schemaMiddleware } from "../middleware/schemaMiddleware";
import { UserInsertSchema } from "../schema/users";

export const createUsersRouter = () => {
  const router = new Hono();
  const usersController = new UsersController();

  // Profile management
  router.get("/profile");
  router.patch("/profile");
  router.delete("/profile");

  // Admin's Maintenance
  router.get("/", usersController.getAll);
  router.post(
    "/",
    schemaMiddleware({ schema: UserInsertSchema }),
    usersController.create
  );
  router.get("/:id", usersController.getById);
  router.patch("/:id");
  router.delete("/:id");
  router.post("/:id/activate");
  router.patch("/:id/role"); //change role

  // Users Invitations
  router.post("/invite");
  router.get("/invitations");
  router.delete("/invitation/:id");

  return router;
};
