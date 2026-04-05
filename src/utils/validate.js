import { validationResult } from "express-validator";
import { sendBadRequest }from "../utils/response";

/**
 * Reads express-validator results and returns a 400 with all field errors.
 * Place this after your validator chains in a route definition.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formatted = errors.array().map((e) => ({
      field: e.path,
      message: e.msg,
    }));
    return sendBadRequest(res, "Validation failed", formatted);
  }
  next();
};

export default validate;