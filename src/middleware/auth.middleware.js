import jwt from "jsonwebtoken";
import { prisma } from "../config/db.js";
import {
  sendUnauthorized,
  sendForbidden,
} from "../utils/response.js";

/**
 * Verifies the JWT token and attaches the user to req.user.
 * Also ensures the user is still ACTIVE in the database.
 */
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return sendUnauthorized(res, "No token provided");
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
      },
    });

    if (!user) {
      return sendUnauthorized(res, "User no longer exists");
    }

    if (user.status === "INACTIVE") {
      return sendForbidden(res, "Account is inactive");
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return sendUnauthorized(res, "Token has expired");
    }

    if (error.name === "JsonWebTokenError") {
      return sendUnauthorized(res, "Invalid token");
    }

    next(error);
  }
};

/**
 * Role-based access guard factory.
 * Usage: authorize("ADMIN") or authorize("ADMIN", "ANALYST")
 */
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) return sendUnauthorized(res);

    if (!allowedRoles.includes(req.user.role)) {
      return sendForbidden(
        res,
        `Role '${req.user.role}' cannot perform this action`
      );
    }

    next();
  };
};

// Convenience guards
export const adminOnly = authorize("ADMIN");
export const analystOrAdmin = authorize("ANALYST", "ADMIN");
export const anyRole = authorize("VIEWER", "ANALYST", "ADMIN");