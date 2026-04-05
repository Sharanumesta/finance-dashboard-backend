import * as transactionService from "../services/transaction.service.js";
import { sendSuccess, sendCreated, sendError } from "../utils/response.js";

/**
 * VIEWER and ANALYST can only see their own transactions.
 * ADMIN can see all (or filter by userId via query param).
 */
const resolveUserFilter = (req) => {
  if (req.user.role === "ADMIN") {
    return req.query.userId || undefined; // admin can optionally filter by userId
  }
  return req.user.id; // non-admins always see only their own
};

const listTransactions = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, type, category, startDate, endDate, sortBy, sortOrder } = req.query;
    const userId = resolveUserFilter(req);

    const result = await transactionService.listTransactions({
      page: parseInt(page),
      limit: parseInt(limit),
      type,
      category,
      startDate,
      endDate,
      sortBy,
      sortOrder,
      userId,
    });

    sendSuccess(res, result.transactions, "Transactions retrieved", 200, {
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    });
  } catch (err) {
    next(err);
  }
};

const getTransactionById = async (req, res, next) => {
  try {
    const transaction = await transactionService.getTransactionById(req.params.id);

    // Non-admins cannot view another user's transaction
    if (req.user.role !== "ADMIN" && transaction.userId !== req.user.id) {
      return sendError(res, "Access denied", 403);
    }

    sendSuccess(res, transaction);
  } catch (err) {
    next(err);
  }
};

const createTransaction = async (req, res, next) => {
  try {
    // Admins can create on behalf of another user; others always own it
    const userId = req.user.role === "ADMIN" && req.body.userId ? req.body.userId : req.user.id;
    const transaction = await transactionService.createTransaction(req.body, userId);
    sendCreated(res, transaction, "Transaction created");
  } catch (err) {
    next(err);
  }
};

const updateTransaction = async (req, res, next) => {
  try {
    const existing = await transactionService.getTransactionById(req.params.id);

    if (req.user.role !== "ADMIN" && existing.userId !== req.user.id) {
      return sendError(res, "Access denied", 403);
    }

    const transaction = await transactionService.updateTransaction(req.params.id, req.body);
    sendSuccess(res, transaction, "Transaction updated");
  } catch (err) {
    next(err);
  }
};

const deleteTransaction = async (req, res, next) => {
  try {
    const existing = await transactionService.getTransactionById(req.params.id);

    if (req.user.role !== "ADMIN" && existing.userId !== req.user.id) {
      return sendError(res, "Access denied", 403);
    }

    await transactionService.deleteTransaction(req.params.id);
    sendSuccess(res, null, "Transaction deleted");
  } catch (err) {
    next(err);
  }
};

export {
  listTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};