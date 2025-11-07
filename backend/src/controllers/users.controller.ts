import type { Response } from "express"

import type { AuthRequest } from "../middlewares/auth.middleware"
import logger from "../utils/logger"
import usersService from "../services/users.service"

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Not authenticated" })
    }

    const user = await usersService.getMe(req.user.id)
    res.status(200).json({ success: true, user })
  } catch (error: any) {
    logger.error("Get user error:", error)
    res.status(error.status || 500).json({
      success: false,
      message: error.message || "Failed to fetch user",
    })
  }
}

export const updateMe = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Not authenticated" })
    }

    const user = await usersService.updateMe(req.user.id, req.body)
    res.status(200).json({ success: true, user })
  } catch (error: any) {
    logger.error("Update user error:", error)
    res.status(error.status || 500).json({
      success: false,
      message: error.message || "Failed to update user",
    })
  }
}
