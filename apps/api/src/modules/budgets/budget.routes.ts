import { Router } from "express";
import { z } from "zod";
import { startOfMonth } from "date-fns";
import { asyncHandler } from "../../middleware/async-handler.js";
import { requireAuth } from "../../middleware/auth.js";
import { validateBody } from "../../middleware/validate.js";
import { prisma } from "../../lib/prisma.js";

const budgetSchema = z.object({
  categoryId: z.string().uuid().optional(),
  month: z.coerce.date(),
  amount: z.number().positive(),
  alertThreshold: z.number().min(0.1).max(1).default(0.8)
});

export const budgetRouter = Router();
budgetRouter.use(requireAuth);

budgetRouter.get("/", asyncHandler(async (req, res) => {
  res.json({ items: await prisma.budget.findMany({ where: { userId: req.user!.id }, include: { category: true } }) });
}));

budgetRouter.post("/", validateBody(budgetSchema), asyncHandler(async (req, res) => {
  res.status(201).json(await prisma.budget.create({
    data: { ...req.body, userId: req.user!.id, month: startOfMonth(req.body.month) }
  }));
}));
