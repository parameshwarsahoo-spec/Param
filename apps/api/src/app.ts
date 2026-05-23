import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import { corsOrigins } from "./config/env.js";
import { openApiDocument } from "./config/openapi.js";
import { errorHandler } from "./middleware/error-handler.js";
import { router } from "./routes.js";

export function createApp() {
  const app = express();
  app.use(helmet());
  app.use(cors({ origin: corsOrigins, credentials: true }));
  app.use(express.json({ limit: "2mb" }));
  app.use(morgan("combined"));
  app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 500 }));
  app.get("/health", (_req, res) => res.json({ ok: true }));
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));
  app.use("/api/v1", router);
  app.use(errorHandler);
  return app;
}
