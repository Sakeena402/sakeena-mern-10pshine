import type { Response } from "express"
import authService from "../services/auth.service"
import type { AuthRequest } from "../middlewares/auth.middleware"
import logger from "../utils/logger"

export const register = async (req: AuthRequest, res: Response) => {
  try {
    const { username, email, password } = req.body;

    // Basic validation before calling service
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Username, email, and password are required.",
      });
    }

    const result = await authService.register(username, email, password);

    // Set refresh token cookie
    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/api/auth/refresh",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: result.user,
      accessToken: result.accessToken,
    });
  } catch (error: any) {
    logger.error("Register error:", error.message || error);

    const status = error.status || 500;
    const message =
      error.message || "Something went wrong during registration.";

    return res.status(status).json({
      success: false,
      message,
    });
  }
};

export const login = async (req: AuthRequest, res: Response) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const result = await authService.login(email, password);

    // Set refresh token in cookie
    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/api/auth/refresh",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: result.user,
      accessToken: result.accessToken,
    });
  } catch (error: any) {
    logger.error("Login error:", error.message || error);

    const status = error.status || 500;
    const message = error.message || "Login failed";

    return res.status(status).json({
      success: false,
      message,
    });
  }
};

export const refresh = async (req: AuthRequest, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res
        .status(401)
        .json({ success: false, message: "Refresh token not found" });
    }

    const result = await authService.refresh(refreshToken);

    // 🔁 Set new refresh token in cookies again
    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/api/auth/refresh",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
      success: true,
      accessToken: result.accessToken,
    });
  } catch (error: any) {
    logger.error("Refresh error:", error.message || error);
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || "Token refresh failed",
    });
  }
};

export const logout = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "Not authenticated" });
    }

    await authService.logout(req.user.id);

    // 🔐 Clear the refresh cookie
    res.clearCookie("refreshToken", { path: "/api/auth/refresh" });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error: any) {
    logger.error("Logout error:", error.message || error);
    return res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
}; 
