import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../services/authService";
import type { AuthPayload } from "../services/authService";

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "No token provided" });
    }

    // Extract token from "Bearer <token>" format
    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({ error: "Invalid token format" });
    }

    const token = parts[1];

    if (!token) {
      return res.status(401).json({ error: "Token is missing" });
    }

    // Verify token
    const payload = verifyToken(token);
    req.user = payload;

    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
