import { Router } from "express";
import { analyticsRouter } from "./modules/analytics/analytics.routes.js";
import { authRouter } from "./modules/auth/auth.routes.js";
import { budgetRouter } from "./modules/budgets/budget.routes.js";
import { expenseRouter } from "./modules/expenses/expense.routes.js";
import { incomeRouter } from "./modules/income/income.routes.js";
import { reportRouter } from "./modules/reports/report.routes.js";

export const router = Router();

router.use("/auth", authRouter);
router.use("/expenses", expenseRouter);
router.use("/income", incomeRouter);
router.use("/budgets", budgetRouter);
router.use("/analytics", analyticsRouter);
router.use("/reports", reportRouter);
