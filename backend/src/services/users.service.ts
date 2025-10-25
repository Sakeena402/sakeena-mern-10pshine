import User from "../models/User"
import { sanitizeUser } from "../utils/sanitizer"

export class UsersService {
  async getMe(userId: string) {
    const user = await User.findById(userId)
    if (!user) {
      throw { status: 404, message: "User not found" }
    }
    return sanitizeUser(user)
  }

  async updateMe(userId: string, updates: { username?: string; profileImage?: string; preferences?: any }) {
    const user = await User.findByIdAndUpdate(userId, updates, { new: true, runValidators: true })
    if (!user) {
      throw { status: 404, message: "User not found" }
    }
    return sanitizeUser(user)
  }
}

export default new UsersService()
