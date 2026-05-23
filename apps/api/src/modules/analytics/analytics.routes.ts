import { Router } from "express";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";
import { asyncHandler } from "../../middleware/async-handler.js";
import { requireAuth } from "../../middleware/auth.js";
import { prisma } from "../../lib/prisma.js";

export const analyticsRouter = Router();
analyticsRouter.use(requireAuth);

analyticsRouter.get("/summary", asyncHandler(async (req, res) => {
  const month = req.query.month ? new Date(String(req.query.month)) : new Date();
  const start = startOfMonth(month);
  const end = endOfMonth(month);
  const [expenses, income, categories] = await Promise.all([
    prisma.expense.aggregate({ where: { userId: req.user!.id, spentAt: { gte: start, lte: end } }, _sum: { amount: true } }),
    prisma.income.aggregate({ where: { userId: req.user!.id, receivedAt: { gte: start, lte: end } }, _sum: { amount: true } }),
    prisma.expense.groupBy({ by: ["categoryId"], where: { userId: req.user!.id, spentAt: { gte: start, lte: end } }, _sum: { amount: true } })
  ]);
  const totalIncome = Number(income._sum.amount ?? 0);
  const totalExpense = Number(expenses._sum.amount ?? 0);
  res.json({
    totalIncome,
    totalExpense,
    remainingBalance: totalIncome - totalExpense,
    savingsPercentage: totalIncome ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) : 0,
    categoryDistribution: categories.map((item) => ({ categoryId: item.categoryId, amount: Number(item._sum.amount ?? 0) }))
  });
}));

analyticsRouter.get("/insights", asyncHandler(async (req, res) => {
  const currentStart = startOfMonth(new Date());
  const previousStart = startOfMonth(subMonths(new Date(), 1));
  const previousEnd = endOfMonth(subMonths(new Date(), 1));
  const [current, previous, recurringCount] = await Promise.all([
    prisma.expense.aggregate({ where: { userId: req.user!.id, spentAt: { gte: currentStart } }, _sum: { amount: true } }),
    prisma.expense.aggregate({ where: { userId: req.user!.id, spentAt: { gte: previousStart, lte: previousEnd } }, _sum: { amount: true } }),
    prisma.expense.count({ where: { userId: req.user!.id, isRecurring: true } })
  ]);
  const currentTotal = Number(current._sum.amount ?? 0);
  const previousTotal = Number(previous._sum.amount ?? 0);
  const insights = [
    ...(previousTotal && currentTotal > previousTotal * 1.15
      ? [{ type: "overspending", severity: "warning", message: `You spent ${Math.round(((currentTotal - previousTotal) / previousTotal) * 100)}% more than last month.` }]
      : []),
    ...(recurringCount ? [{ type: "recurring_review", severity: "info", message: `Review ${recurringCount} recurring payments for savings opportunities.` }] : [])
  ];
  res.json({ insights, predictedNextMonthSpend: Math.round(currentTotal * 1.05) });
}));
