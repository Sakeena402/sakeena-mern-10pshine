import type { Response } from "express"
import authService from "../services/auth.service"
import type { AuthRequest } from "../middlewares/auth.middleware"
import logger from "../utils/logger"

export const register = async (req: AuthRequest, res: Response) => {
  try {
    const { username, email, password } = req.body
    const result = await authService.register(username, email, password)

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/api/auth/refresh",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })

    res.status(201).json({
      success: true,
      user: result.user,
      accessToken: result.accessToken,
    })
  } catch (error: any) {
    logger.error("Register error:", error)
    res.status(error.status || 500).json({
      success: false,
      message: error.message || "Registration failed",
    })
  }
}

export const login = async (req: AuthRequest, res: Response) => {
  try {
    const { email, password } = req.body
    const result = await authService.login(email, password)

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/api/auth/refresh",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    }) 

    res.status(200).json({
      success: true,
      user: result.user,
      accessToken: result.accessToken,
    })
  } catch (error: any) {
    logger.error("Login error:", error)
    res.status(error.status || 500).json({
      success: false,
      message: error.message || "Login failed",
    })
  }
}

export const refresh = async (req: AuthRequest, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) {
      return res.status(401).json({ success: false, message: "Refresh token not found" })
    }

    const result = await authService.refresh(refreshToken)
    res.status(200).json({
      success: true,
      accessToken: result.accessToken,
    })
  } catch (error: any) {
    logger.error("Refresh error:", error)
    res.status(error.status || 500).json({
      success: false,
      message: error.message || "Token refresh failed",
    })
  }
}

export const logout = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Not authenticated" })
    }

    await authService.logout(req.user.id)

    res.clearCookie("refreshToken", { path: "/api/auth/refresh" })
    res.status(200).json({ success: true, message: "Logged out successfully" })
  } catch (error: any) {
    logger.error("Logout error:", error)
    res.status(500).json({ success: false, message: "Logout failed" })
  }
}
