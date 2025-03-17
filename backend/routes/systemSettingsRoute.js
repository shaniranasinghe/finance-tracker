import express from "express";
import { configureSystemSettings, getSystemSettings } from "../controller/systemSettingsController.js";
import { authenticate, authorizeRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin-only: Configure categories and limits
router.post("/", authenticate, authorizeRole(["admin"]), configureSystemSettings);

// Retrieve system settings (accessible by all roles)
router.get("/", authenticate, getSystemSettings);

export default router;
