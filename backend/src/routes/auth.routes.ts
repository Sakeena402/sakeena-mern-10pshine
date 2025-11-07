import { Router } from "express"
import * as authController from "../controllers/auth.controller"
import { validateRequest } from "../middlewares/validate.middleware"
import { authMiddleware } from "../middlewares/auth.middleware"
import Joi from "joi"

const router = Router()

const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
})

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
})

router.post("/register", validateRequest(registerSchema), authController.register)
router.post("/login", validateRequest(loginSchema), authController.login)
router.post("/refresh", authController.refresh)
router.post("/logout", authMiddleware, authController.logout)

export default router
