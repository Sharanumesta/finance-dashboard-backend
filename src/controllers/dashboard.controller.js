import * as dashboardService from "../services/dashboard.service.js";
import { sendSuccess, sendError } from "../utils/response.js";

export const getSummary = async (req, res) => {
  try {
    const data = await dashboardService.getSummary(req.user);
    return sendSuccess(res, data);
  } catch (err) {
    return sendError(res, err.message);
  }
};

export const getCategoryBreakdown = async (req, res) => {
  try {
    const data = await dashboardService.getCategoryBreakdown(req.user);
    return sendSuccess(res, data);
  } catch (err) {
    return sendError(res, err.message);
  }
};

export const getMonthlyTrends = async (req, res) => {
  try {
    const months = parseInt(req.query.months) || 6;
    const data = await dashboardService.getMonthlyTrends(req.user, months);
    return sendSuccess(res, data);
  } catch (err) {
    return sendError(res, err.message);
  }
};

export const getWeeklyTrends = async (req, res) => {
  try {
    const weeks = parseInt(req.query.weeks) || 8;
    const data = await dashboardService.getWeeklyTrends(req.user, weeks);
    return sendSuccess(res, data);
  } catch (err) {
    return sendError(res, err.message);
  }
};

export const getRecentActivity = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const data = await dashboardService.getRecentActivity(req.user, limit);
    return sendSuccess(res, data);
  } catch (err) {
    return sendError(res, err.message);
  }
};