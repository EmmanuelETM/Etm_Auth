import { createApp } from "./app";
import { config } from "./config";
import "dotenv/config";

const app = createApp();

const port = config.PORT || 3000;

Bun.serve({
  fetch: app.fetch,
  port,
});

console.clear();
console.log(`🚀 Server running on http://localhost:${port}`);
