import type { Request, Response, NextFunction } from "express"
import { verifyAccessToken } from "../utils/jwt"
import logger from "../utils/logger"

export interface AuthRequest extends Request {
  user?: { id: string }
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Missing or invalid authorization header" })
    }

    const token = authHeader.substring(7)
    const decoded = verifyAccessToken(token)
    req.user = { id: decoded.id }
    next()
  } catch (error) {
    logger.error({ err: error }, "Auth middleware error")
    res.status(401).json({ success: false, message: "Invalid or expired token" })
  }
}
