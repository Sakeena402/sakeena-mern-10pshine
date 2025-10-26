import User from "../models/User"
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/jwt"
import { sanitizeUser } from "../utils/sanitizer"

export class AuthService {
  // async register(username: string, email: string, password: string) {
  //   const existingUser = await User.findOne({ $or: [{ email }, { username }] })
  //   if (existingUser) {
  //     throw { status: 409, message: "User already exists" }
  //   }

  //   const user = new User({ username, email, password })
  //   await user.save()

  //   const accessToken = signAccessToken(user.id.toString())
  //   const refreshToken = signRefreshToken(user.id.toString())

  //   user.refreshToken = refreshToken
  //   await user.save()

  //   return {
  //     user: sanitizeUser(user),
  //     accessToken,
  //     refreshToken,
  //   }
  // }


  async register(username: string, email: string, password: string) {
    // Check if username or email already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      throw { status: 409, message: "User already exists" };
    }

    // Create new user
    const user = new User({
      username,
      email,
      password,
    });

    await user.save();

    // Generate JWT tokens
    const accessToken = signAccessToken(user.id.toString());
    const refreshToken = signRefreshToken(user.id.toString());

    // Save refresh token to DB
    user.refreshToken = refreshToken;
    await user.save();

    return {
      user: sanitizeUser(user),
      accessToken,
      refreshToken,
    };
  }

  async login(email: string, password: string) {
    // 1️⃣ Check if user exists
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      throw { status: 401, message: "Invalid email or password" };
    }

    // 2️⃣ Validate password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw { status: 401, message: "Invalid email or password" };
    }

    // 3️⃣ Generate new tokens
    const accessToken = signAccessToken(user.id.toString());
    const refreshToken = signRefreshToken(user.id.toString());

    // 4️⃣ Save refresh token in DB
    user.refreshToken = refreshToken;
    await user.save();

    // 5️⃣ Return sanitized user + tokens
    return {
      user: sanitizeUser(user),
      accessToken,
      refreshToken,
    };
  }
 async refresh(refreshToken: string) {
    try {
      // 1️⃣ Verify refresh token
      const decoded = verifyRefreshToken(refreshToken);

      // 2️⃣ Find user and validate stored refresh token
      const user = await User.findById(decoded.id).select("+refreshToken");
      if (!user || user.refreshToken !== refreshToken) {
        throw { status: 401, message: "Invalid or mismatched refresh token" };
      }

      // 3️⃣ Generate new tokens
      const newAccessToken = signAccessToken(user.id.toString());
      const newRefreshToken = signRefreshToken(user.id.toString());

      // 4️⃣ Save new refresh token (to rotate old one)
      user.refreshToken = newRefreshToken;
      await user.save();

      // 5️⃣ Return new tokens
      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        user: sanitizeUser(user),
      };
    } catch (error) {
      throw { status: 401, message: "Invalid or expired refresh token" };
    }
  }

 
  async logout(userId: string) {
    await User.findByIdAndUpdate(userId, { refreshToken: null });
    return { success: true, message: "Logged out successfully" };
  }

}

export default new AuthService()
