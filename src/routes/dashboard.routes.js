import express from "express";
import * as dashboardController from "../controllers/dashboard.controller.js";
import { authenticate, analystOrAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/summary", authenticate, analystOrAdmin, dashboardController.getSummary);
router.get("/categories", authenticate, analystOrAdmin, dashboardController.getCategoryBreakdown);
router.get("/monthly", authenticate, analystOrAdmin, dashboardController.getMonthlyTrends);
router.get("/weekly", authenticate, analystOrAdmin, dashboardController.getWeeklyTrends);
router.get("/recent", authenticate, analystOrAdmin, dashboardController.getRecentActivity);

export default router;