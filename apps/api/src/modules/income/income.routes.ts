import { Router } from "express";
import { z } from "zod";
import { asyncHandler } from "../../middleware/async-handler.js";
import { requireAuth } from "../../middleware/auth.js";
import { validateBody } from "../../middleware/validate.js";
import { prisma } from "../../lib/prisma.js";
import { getPagination } from "../../utils/pagination.js";

const incomeSchema = z.object({
  amount: z.number().positive(),
  categoryId: z.string().uuid().optional(),
  receivedAt: z.coerce.date(),
  source: z.string().min(1).max(120),
  notes: z.string().max(1000).optional(),
  isRecurring: z.boolean().default(false),
  recurrenceRule: z.string().max(120).optional()
});

export const incomeRouter = Router();
incomeRouter.use(requireAuth);

incomeRouter.get("/", asyncHandler(async (req, res) => {
  const { page, pageSize, skip, take } = getPagination(req.query);
  const [items, total] = await Promise.all([
    prisma.income.findMany({ where: { userId: req.user!.id }, skip, take, orderBy: { receivedAt: "desc" } }),
    prisma.income.count({ where: { userId: req.user!.id } })
  ]);
  res.json({ items, page, pageSize, total });
}));

incomeRouter.post("/", validateBody(incomeSchema), asyncHandler(async (req, res) => {
  res.status(201).json(await prisma.income.create({ data: { ...req.body, userId: req.user!.id } }));
}));
