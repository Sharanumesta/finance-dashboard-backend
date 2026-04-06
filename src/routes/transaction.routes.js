import express from "express";
import {
  listTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../controllers/transaction.controller.js";

import {
  authenticate,
  analystOrAdmin,
  adminOnly,
} from "../middleware/auth.middleware.js";

import {
  createTransactionValidator,
  updateTransactionValidator,
  listTransactionValidator,
  idParamValidator
} from "../validators/transaction.validators.js";

import { validate } from "../middleware/validate.middleware.js";

const router = express.Router();

/**
 * GET all transactions
 * - Analyst & Admin only
 * - Supports filters, pagination, sorting
 */
router.get(
  "/",
  authenticate,
  analystOrAdmin,
  listTransactionValidator,
  validate,
  listTransactions
);

/**
 * GET single transaction
 * - Analyst & Admin only
 */
router.get(
  "/:id",
  authenticate,
  analystOrAdmin,
  idParamValidator,
  validate,
  getTransactionById
);

/**
 * CREATE transaction
 * - Admin only
 * - Validates amount, type, category, date, notes
 */
router.post(
  "/",
  authenticate,
  adminOnly,
  createTransactionValidator,
  validate,
  createTransaction
);

/**
 * UPDATE transaction
 * - Admin only
 * - Supports partial updates
 */
router.patch(
  "/:id",
  authenticate,
  adminOnly,
  updateTransactionValidator,
  validate,
  updateTransaction
);

/**
 * DELETE transaction
 * - Admin only
 * - Soft delete (isDeleted = true)
 */
router.delete(
  "/:id",
  authenticate,
  adminOnly,
  idParamValidator,
  validate,
  deleteTransaction
);

export default router;