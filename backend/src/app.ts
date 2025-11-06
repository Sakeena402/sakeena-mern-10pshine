import dotenv from "dotenv";
dotenv.config();

import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import authRoutes from "./routes/auth.routes"
import userRoutes from "./routes/user.routes"

import { errorMiddleware } from "./middlewares/error.middleware"
import noteRoutes from "./routes/note.routes";

const app = express()

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
)

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/notes", noteRoutes)


// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" })
})

// Error handling
app.use(errorMiddleware)

export default app
