import { Hono } from "hono";
import { AuthController } from "../controllers/authController";

export const createAuthRouter = () => {
  const router = new Hono();
  const authController = new AuthController();

  // Core Auth
  router.post("/register", authController.register);
  router.post("/login");
  router.post("/refresh"); // Get new access token using refresh token
  router.post("/logout");
  router.post("/logout-all"); //  Revoke all refresh tokens (all devices)

  // Email verification
  router.get("/verify-email/:token");
  router.post("/resend-verification");

  // Password management
  router.post("/forgot-password");
  router.post("/reset-password");
  router.post("/change-password"); // Authenticated Users

  return router;
};
