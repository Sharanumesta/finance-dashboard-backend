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

const router = express.Router();

/**
 * GET all transactions
 * - Viewer & Analyst → only their own
 * - Admin → all or filter by userId
 */
router.get("/", authenticate, listTransactions);

/**
 * GET single transaction
 */
router.get("/:id", authenticate, getTransactionById);

/**
 * CREATE transaction
 * - All authenticated users can create
 */
router.post("/", authenticate, createTransaction);

/**
 * UPDATE transaction
 * - Owner or Admin
 */
router.patch("/:id", authenticate, updateTransaction);

/**
 * DELETE transaction (soft delete)
 * - Owner or Admin
 */
router.delete("/:id", authenticate, deleteTransaction);

export default router;