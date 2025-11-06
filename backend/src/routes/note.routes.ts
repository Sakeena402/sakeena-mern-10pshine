import { Router } from "express"
import * as notesController from "../controllers/notes.controller"
import { authMiddleware } from "../middlewares/auth.middleware"

const router = Router()

router.get("/", authMiddleware, notesController.listNotes)
router.post("/", authMiddleware, notesController.createNote)
router.get("/:id", authMiddleware, notesController.getNote)
router.put("/:id", authMiddleware, notesController.updateNote)
router.patch("/:id/archive", authMiddleware, notesController.archiveNote)
router.delete("/:id", authMiddleware, notesController.deleteNote)
router.post("/:id/restore", authMiddleware, notesController.restoreNote)
router.patch("/:id/pin", authMiddleware, notesController.setNotePin)
router.post("/:id/unlock", authMiddleware, notesController.unlockNote)

export default router
