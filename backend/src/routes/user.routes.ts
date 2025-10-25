import { Router } from "express"
import * as usersController from "../controllers/users.controller"
import { authMiddleware } from "../middlewares/auth.middleware"

const router = Router()

router.get("/me", authMiddleware, usersController.getMe)
router.patch("/me", authMiddleware, usersController.updateMe)

export default router
