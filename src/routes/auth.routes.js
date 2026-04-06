import express from "express";
import * as authController from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

import {
  registerValidator,
  loginValidator,
} from "../validators/auth.validators.js";

import { validate } from "../middleware/validate.middleware.js";

const router = express.Router();

/**
 * Register → validate → then controller
 */
router.post("/register", registerValidator, validate, authController.register);

/**
 * Login → validate → then controller
 */
router.post("/login", loginValidator, validate, authController.login);

/**
 * Profile (no validation needed)
 */
router.get("/me", authenticate, authController.getProfile);

export default router;