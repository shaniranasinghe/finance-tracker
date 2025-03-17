import express from "express";
import { notifyMissedRecurringTransactions } from "../controller/notificationController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// Notify about missed recurring transactions
router.get("/missed-recurring", authenticate, notifyMissedRecurringTransactions);

export default router;
