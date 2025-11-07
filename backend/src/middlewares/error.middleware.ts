import type { Request, Response, NextFunction } from "express"
import logger from "../utils/logger"

export interface ApiError extends Error {
  status?: number
  errors?: Record<string, string>
}

export const errorMiddleware = (err: ApiError, req: Request, res: Response, next: NextFunction) => {
  const status = err.status || 500
  const message = err.message || "Internal server error"

  logger.error({ status, message, error: err })

  res.status(status).json({
    success: false,
    message,
    ...(err.errors && { errors: err.errors }),
  })
}
