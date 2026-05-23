import { Router } from "express";
import { z } from "zod";
import { stringify } from "csv-stringify/sync";
import { asyncHandler } from "../../middleware/async-handler.js";
import { requireAuth } from "../../middleware/auth.js";
import { validateBody } from "../../middleware/validate.js";
import { prisma } from "../../lib/prisma.js";

const schema = z.object({
  type: z.enum(["monthly", "yearly", "tax"]),
  format: z.enum(["json", "csv", "xlsx"]),
  periodStart: z.coerce.date(),
  periodEnd: z.coerce.date()
});

export const reportRouter = Router();
reportRouter.use(requireAuth);

reportRouter.post("/", validateBody(schema), asyncHandler(async (req, res) => {
  const expenses = await prisma.expense.findMany({
    where: { userId: req.user!.id, spentAt: { gte: req.body.periodStart, lte: req.body.periodEnd } },
    include: { category: true },
    orderBy: { spentAt: "asc" }
  });
  if (req.body.format === "json") return res.json({ expenses });
  const csv = stringify(expenses.map((expense) => ({
    date: expense.spentAt.toISOString(),
    category: expense.category.name,
    amount: expense.amount.toString(),
    paymentMethod: expense.paymentMethod,
    merchant: expense.merchant ?? "",
    notes: expense.notes ?? ""
  })), { header: true });
  res.setHeader("Content-Type", req.body.format === "csv" ? "text/csv" : "application/vnd.ms-excel");
  res.send(csv);
}));
