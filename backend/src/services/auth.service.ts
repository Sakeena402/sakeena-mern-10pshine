import User from "../models/User"
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/jwt"
import { sanitizeUser } from "../utils/sanitizer"

export class AuthService {
  async register(username: string, email: string, password: string) {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] })
    if (existingUser) {
      throw { status: 409, message: "User already exists" }
    }

    const user = new User({ username, email, password })
    await user.save()

    const accessToken = signAccessToken(user.id.toString())
    const refreshToken = signRefreshToken(user.id.toString())

    user.refreshToken = refreshToken
    await user.save()

    return {
      user: sanitizeUser(user),
      accessToken,
      refreshToken,
    }
  }

  async login(email: string, password: string) {
    const user = await User.findOne({ email }).select("+password")
    if (!user) {
      throw { status: 401, message: "Invalid email or password" }
    }

    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      throw { status: 401, message: "Invalid email or password" }
    }

    const accessToken = signAccessToken(user.id.toString())
    const refreshToken = signRefreshToken(user.id.toString())

    user.refreshToken = refreshToken
    await user.save()

    return {
      user: sanitizeUser(user),
      accessToken,
      refreshToken,
    }
  }

  async refresh(refreshToken: string) {
    try {
      const decoded = verifyRefreshToken(refreshToken)
      const user = await User.findById(decoded.id).select("+refreshToken")

      if (!user || user.refreshToken !== refreshToken) {
        throw { status: 401, message: "Invalid refresh token" }
      }

      const newAccessToken = signAccessToken(user.id.toString())
      return { accessToken: newAccessToken }
    } catch (error) {
      throw { status: 401, message: "Invalid or expired refresh token" }
    }
  }

  async logout(userId: string) {
    await User.findByIdAndUpdate(userId, { refreshToken: null })
    return { success: true }
  }
}

export default new AuthService()
