import { body } from "express-validator";

export const registerValidator = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Must be a valid email")
    .normalizeEmail(),

  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number"),

  body("name")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),

  body("role")
    .optional()
    .isIn(["VIEWER", "ANALYST", "ADMIN"])
    .withMessage("Role must be VIEWER, ANALYST, or ADMIN"),
];

export const loginValidator = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Must be a valid email")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required"),
];