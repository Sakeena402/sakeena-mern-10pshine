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

// Archive / Unarchive a note
router.patch("/:id/archive", authMiddleware, notesController.archiveNote);

// Delete a note
router.delete("/:id", authMiddleware, notesController.deleteNote);

// Restore a deleted note
router.post("/:id/restore", authMiddleware, notesController.restoreNote);

// Set or remove a note PIN
router.patch("/:id/pin", authMiddleware, notesController.setNotePin);

// Unlock a note
router.post("/:id/unlock", authMiddleware, notesController.unlockNote);

router.patch("/:id/pin", authMiddleware, notesController.togglePin)

export default router;
