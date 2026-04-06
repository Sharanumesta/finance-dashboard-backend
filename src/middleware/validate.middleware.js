import { validationResult } from "express-validator";
import { sendBadRequest } from "../utils/response.js";

export const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return sendBadRequest(res, "Validation failed", errors.array());
  }

  next();
};