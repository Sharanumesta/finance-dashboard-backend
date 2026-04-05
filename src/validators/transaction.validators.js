import { body, query, param } from "express-validator";

const createTransactionValidator = [
  body("amount")
    .isFloat({ gt: 0 })
    .withMessage("Amount must be a positive number"),
  body("type")
    .isIn(["INCOME", "EXPENSE"])
    .withMessage("Type must be INCOME or EXPENSE"),
  body("category")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Category is required (max 100 chars)"),
  body("date").isISO8601().withMessage("Date must be a valid ISO 8601 date"),
  body("notes")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Notes must be under 500 characters"),
];

const updateTransactionValidator = [
  param("id").isUUID().withMessage("Invalid transaction ID"),
  body("amount")
    .optional()
    .isFloat({ gt: 0 })
    .withMessage("Amount must be a positive number"),
  body("type")
    .optional()
    .isIn(["INCOME", "EXPENSE"])
    .withMessage("Type must be INCOME or EXPENSE"),
  body("category")
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Category must be 1–100 characters"),
  body("date")
    .optional()
    .isISO8601()
    .withMessage("Date must be a valid ISO 8601 date"),
  body("notes")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Notes must be under 500 characters"),
];

const listTransactionValidator = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be 1–100"),
  query("type")
    .optional()
    .isIn(["INCOME", "EXPENSE"])
    .withMessage("Type must be INCOME or EXPENSE"),
  query("category").optional().trim(),
  query("startDate")
    .optional()
    .isISO8601()
    .withMessage("startDate must be ISO 8601"),
  query("endDate")
    .optional()
    .isISO8601()
    .withMessage("endDate must be ISO 8601"),
  query("sortBy")
    .optional()
    .isIn(["date", "amount", "createdAt"])
    .withMessage("sortBy must be date, amount, or createdAt"),
  query("sortOrder")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("sortOrder must be asc or desc"),
];

export {
  createTransactionValidator,
  updateTransactionValidator,
  listTransactionValidator,
};
