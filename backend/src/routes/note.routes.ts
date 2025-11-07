import { Router } from "express";
import * as notesController from "../controllers/notes.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// List all notes
router.get("/", authMiddleware, notesController.listNotes);

// Create new note
router.post("/", authMiddleware, notesController.createNote);

// Get a single note by ID
router.get("/:id", authMiddleware, notesController.getNote);

// Update a note
router.put("/:id", authMiddleware, notesController.updateNote);

// pin toggle (pinned/unpinned)
router.patch("/:id/pin", authMiddleware, notesController.togglePin);

// lock/unlock (set or remove PIN)
router.patch("/:id/lock", authMiddleware, notesController.setNoteLock);
router.post("/:id/unlock", authMiddleware, notesController.unlockNote);

// archive, trash, restore
router.patch("/:id/archive", authMiddleware, notesController.archiveNote);
router.delete("/:id", authMiddleware, notesController.deleteNote); // soft delete (trash)
router.delete("/:id/permanent", authMiddleware, notesController.deleteNotePermanent); // permanent delete
router.post("/:id/restore", authMiddleware, notesController.restoreNote);

export default router;
