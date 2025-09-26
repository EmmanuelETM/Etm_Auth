import { Hono } from "hono";
import { WSController } from "../controllers/wsController";

export const createWsRouter = () => {
  const router = new Hono();
  const wsController = new WSController();

  return router;
};
