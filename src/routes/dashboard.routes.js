import express from "express";
import * as dashboardController from "../controllers/dashboard.controller.js";
import { authenticate, anyRole } from "../middleware/auth.middleware.js";

const router = express.Router();


router.get("/summary", authenticate, anyRole, dashboardController.getSummary);
router.get("/categories", authenticate, anyRole, dashboardController.getCategoryBreakdown);
router.get("/monthly", authenticate, anyRole, dashboardController.getMonthlyTrends);
router.get("/weekly", authenticate, anyRole, dashboardController.getWeeklyTrends);
router.get("/recent", authenticate, anyRole, dashboardController.getRecentActivity);

export default router;