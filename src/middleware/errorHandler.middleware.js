import { sendError } from "../utils/response.js";

/**
 * Global Express error handler.
 * Must be registered last — after all routes.
 */
const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${req.method} ${req.path}:`, err);

  // Prisma specific errors
  if (err.code === "P2002") {
    return sendError(res, "A record with this value already exists", 409);
  }
  if (err.code === "P2025") {
    return sendError(res, "Record not found", 404);
  }
  if (err.code === "P2003") {
    return sendError(res, "Related record not found", 400);
  }

  const statusCode = err.statusCode || 500;
  const message =
    process.env.NODE_ENV === "production" && statusCode === 500
      ? "Internal server error"
      : err.message || "Internal server error";

  sendError(res, message, statusCode);
};

export default errorHandler;
