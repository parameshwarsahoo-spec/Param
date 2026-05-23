import { Router } from "express";
import rateLimit from "express-rate-limit";
import { asyncHandler } from "../../middleware/async-handler.js";
import { validateBody } from "../../middleware/validate.js";
import { authService } from "./auth.service.js";
import { loginSchema, refreshSchema, signupSchema } from "./auth.schemas.js";

export const authRouter = Router();
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 20 });

authRouter.post("/signup", limiter, validateBody(signupSchema), asyncHandler(async (req, res) => {
  res.status(201).json(await authService.signup(req.body));
}));

authRouter.post("/login", limiter, validateBody(loginSchema), asyncHandler(async (req, res) => {
  res.json(await authService.login(req.body));
}));

authRouter.post("/refresh", validateBody(refreshSchema), asyncHandler(async (req, res) => {
  res.json(await authService.refresh(req.body));
}));
