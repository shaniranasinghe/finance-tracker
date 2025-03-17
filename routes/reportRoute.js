import express from "express";
import {
  getSpendingTrends,
  getIncomeExpenseSummary,
  getFilteredReports,
  getAllReports,
} from "../controller/reportController.js";
import { authenticate, authorizeRole} from "../middleware/authMiddleware.js";

const router = express.Router();

// Spending Trends
router.get("/trends", authenticate, getSpendingTrends);

// Income vs Expense Summary
router.get("/summary", authenticate, getIncomeExpenseSummary);

// Filtered Reports
router.get("/filtered", authenticate, getFilteredReports);

// Admin can view all reports
router.get("/admin/all", authenticate, authorizeRole(["admin"]), getAllReports);

export default router;
