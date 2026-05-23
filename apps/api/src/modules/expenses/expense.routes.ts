import { Router } from "express";
import { z } from "zod";
import type { Prisma } from "@prisma/client";
import { asyncHandler } from "../../middleware/async-handler.js";
import { requireAuth } from "../../middleware/auth.js";
import { validateBody, validateQuery } from "../../middleware/validate.js";
import { prisma } from "../../lib/prisma.js";
import { getPagination } from "../../utils/pagination.js";
import { HttpError } from "../../utils/http-error.js";

const expenseSchema = z.object({
  amount: z.number().positive(),
  categoryId: z.string().uuid(),
  spentAt: z.coerce.date(),
  paymentMethod: z.enum(["cash", "card", "upi", "bank_transfer", "wallet", "other"]),
  notes: z.string().max(1000).optional(),
  receiptUrl: z.string().url().optional(),
  merchant: z.string().max(160).optional(),
  isRecurring: z.boolean().default(false),
  recurrenceRule: z.string().max(120).optional()
});

const querySchema = z.object({
  page: z.coerce.number().optional(),
  pageSize: z.coerce.number().optional(),
  search: z.string().optional(),
  categoryId: z.string().uuid().optional(),
  paymentMethod: z.string().optional(),
  minAmount: z.coerce.number().optional(),
  maxAmount: z.coerce.number().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional()
});

export const expenseRouter = Router();
expenseRouter.use(requireAuth);

expenseRouter.get("/", validateQuery(querySchema), asyncHandler(async (req, res) => {
  const { page, pageSize, skip, take } = getPagination(req.query);
  const where: Prisma.ExpenseWhereInput = {
    userId: req.user!.id,
    ...(req.query.categoryId ? { categoryId: String(req.query.categoryId) } : {}),
    ...(req.query.paymentMethod ? { paymentMethod: String(req.query.paymentMethod) } : {}),
    ...(req.query.search ? { notes: { contains: String(req.query.search), mode: "insensitive" } } : {}),
    amount: {
      ...(req.query.minAmount ? { gte: Number(req.query.minAmount) } : {}),
      ...(req.query.maxAmount ? { lte: Number(req.query.maxAmount) } : {})
    },
    spentAt: {
      ...(req.query.startDate ? { gte: req.query.startDate as Date } : {}),
      ...(req.query.endDate ? { lte: req.query.endDate as Date } : {})
    }
  };
  const [items, total] = await Promise.all([
    prisma.expense.findMany({ where, skip, take, orderBy: { spentAt: "desc" }, include: { category: true } }),
    prisma.expense.count({ where })
  ]);
  res.json({ items, page, pageSize, total });
}));

expenseRouter.post("/", validateBody(expenseSchema), asyncHandler(async (req, res) => {
  res.status(201).json(await prisma.expense.create({ data: { ...req.body, userId: req.user!.id } }));
}));

expenseRouter.patch("/:id", validateBody(expenseSchema.partial()), asyncHandler(async (req, res) => {
  const existing = await prisma.expense.findFirst({ where: { id: req.params.id, userId: req.user!.id } });
  if (!existing) throw new HttpError(404, "Expense not found");
  res.json(await prisma.expense.update({ where: { id: req.params.id }, data: req.body }));
}));

expenseRouter.delete("/:id", asyncHandler(async (req, res) => {
  const existing = await prisma.expense.findFirst({ where: { id: req.params.id, userId: req.user!.id } });
  if (!existing) throw new HttpError(404, "Expense not found");
  await prisma.expense.delete({ where: { id: req.params.id } });
  res.json({ deleted: true });
}));
