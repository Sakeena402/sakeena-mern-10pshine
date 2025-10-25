import mongoose from "mongoose"
import app from "./app"
import logger from "./utils/logger"

import dotenv from "dotenv"
dotenv.config()

const PORT = process.env.PORT || 4000
const MONGO_URI = process.env.MONGO_URI || ""

// Start server
const startServer = async () => {
  try {
    if (!MONGO_URI) {
      throw new Error("MONGO_URI is missing in environment variables.")
    }

    await mongoose.connect(MONGO_URI)
    logger.info("✅ Connected to MongoDB")

    app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`)
    })
  } catch (error) {
    console.error("❌ Failed to start server:", error)
    logger.error({ err: error }, "Auth middleware error")

    process.exit(1)
  }
}

startServer()
