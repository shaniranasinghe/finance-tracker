import express from "express";
import { authenticate, authorizeRole } from "../middleware/authMiddleware.js";
import { getAdminDashboard, getUserDashboard } from "../controller/dashboardController.js";

const router = express.Router();

// Admin dashboard
router.get("/admin", authenticate, authorizeRole(["admin"]), getAdminDashboard);

// User dashboard
router.get("/user", authenticate, authorizeRole(["regular_user"]), getUserDashboard);

export default router;
