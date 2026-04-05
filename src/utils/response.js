/**
 * Standardised API response helpers.
 * All responses follow: { success, message, data?, meta?, errors? }
 */

export const sendSuccess = (
  res,
  data = null,
  message = "Success",
  statusCode = 200,
  meta = null,
) => {
  const payload = { success: true, message };
  if (data !== null) payload.data = data;
  if (meta !== null) payload.meta = meta;
  return res.status(statusCode).json(payload);
};

export const sendCreated = (res, data, message = "Created successfully") =>
  sendSuccess(res, data, message, 201);

export const sendError = (
  res,
  message = "An error occurred",
  statusCode = 500,
  errors = null,
) => {
  const payload = { success: false, message };
  if (errors) payload.errors = errors;
  return res.status(statusCode).json(payload);
};

export const sendNotFound = (res, message = "Resource not found") =>
  sendError(res, message, 404);

export const sendUnauthorized = (res, message = "Unauthorized") =>
  sendError(res, message, 401);

export const sendForbidden = (res, message = "Access denied") =>
  sendError(res, message, 403);

export const sendBadRequest = (res, message = "Bad request", errors = null) =>
  sendError(res, message, 400, errors);
