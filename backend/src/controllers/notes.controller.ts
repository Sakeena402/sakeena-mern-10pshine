

import type { Response } from "express"
import notesService from "../services/notes.service"
import type { AuthRequest } from "../middlewares/auth.middleware"
import logger from "../utils/logger" 

// ✅ List all notes
export const listNotes = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user)
      return res.status(401).json({ success: false, message: "Not authenticated" })

    const filters = {
      q: req.query.q as string,
      tags: req.query.tags
        ? Array.isArray(req.query.tags)
          ? req.query.tags
          : (req.query.tags as string).split(",")
        : undefined,
      archived: req.query.archived ? req.query.archived === "true" : undefined,
      trashed: req.query.trashed ? req.query.trashed === "true" : undefined,
      pinned: req.query.pinned ? req.query.pinned === "true" : undefined,
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
    }

    const result = await notesService.listNotes(req.user.id, filters)
    return res.status(200).json({ success: true, ...result })
  } catch (error: any) {
    logger.error("List notes error:", error)
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch notes",
    })
  }
}

// ✅ Get single note by ID
export const getNote = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user)
      return res.status(401).json({ success: false, message: "Not authenticated" })

    const note = await notesService.getNote(req.params.id, req.user.id)
    if (!note)
      return res.status(404).json({ success: false, message: "Note not found" })

    return res.status(200).json({ success: true, note })
  } catch (error: any) {
    logger.error("Get note error:", error)
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch note",
    })
  }
}

// ✅ Create note (with plainText + all fields)
export const createNote = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user)
      return res.status(401).json({ success: false, message: "Not authenticated" })

    const body = req.body
    const noteData = {
      owner: req.user.id,
      title: body.title || "Untitled Note",
      content: body.content || "",
      plainText: body.plainText || body.content?.replace(/<[^>]+>/g, "") || "",
      bgColor: body.bgColor || "#fef5e7",
      tags: body.tags || [],
      pinned: body.pinned || false,
    }

    const note = await notesService.createNote(req.user.id, noteData)
    return res.status(201).json({ success: true, note })
  } catch (error: any) {
    logger.error("Create note error:", error)
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create note",
    })
  }
}

// ✅ Update note
// export const updateNote = async (req: AuthRequest, res: Response) => {
//   try {
//     if (!req.user)
//       return res.status(401).json({ success: false, message: "Not authenticated" })

//     const note = await notesService.updateNote(req.params.id, req.user.id, req.body)
//     return res.status(200).json({ success: true, note })
//   } catch (error: any) {
//     logger.error("Update note error:", error)
//     return res.status(500).json({
//       success: false,
//       message: error.message || "Failed to update note",
//     })
//   }
// }

// PUT /api/notes/:id
export const updateNote = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }
    
    const { title, content } = req.body;
    const note = await notesService.findOne({ _id: req.params.id, owner: req.user.id });

    if (!note) return res.status(404).json({ message: "Note not found" });

    note.title = title || note.title;
    note.content = content || note.content;

    await note.save();

    return res.status(200).json({ message: "Note updated successfully", note });
  } catch (error) {
    console.error("Error updating note:", error);
    res.status(500).json({ message: "Failed to update note", error });
  }
};

export const archiveNote = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Not authenticated" })
    }

    const note = await notesService.archiveNote(req.params.id, req.user.id, req.body.archived)
    res.status(200).json({ success: true, note })
  } catch (error: any) {
    logger.error("Archive note error:", error)
    res.status(error.status || 500).json({
      success: false,
      message: error.message || "Failed to archive note",
    })
  }
}

export const deleteNote = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Not authenticated" })
    }

    await notesService.deleteNote(req.params.id, req.user.id)
    res.status(200).json({ success: true, message: "Note deleted" })
  } catch (error: any) {
    logger.error("Delete note error:", error)
    res.status(error.status || 500).json({
      success: false,
      message: error.message || "Failed to delete note",
    })
  }
}

export const restoreNote = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Not authenticated" })
    }

    const note = await notesService.restoreNote(req.params.id, req.user.id)
    res.status(200).json({ success: true, note })
  } catch (error: any) {
    logger.error("Restore note error:", error)
    res.status(error.status || 500).json({
      success: false,
      message: error.message || "Failed to restore note",
    })
  }
}

// ... existing handlers (listNotes, getNote, createNote) remain

// Toggle pinned state
export const togglePin = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: "Not authenticated" });

    const note = await notesService.findByIdAndOwner(req.params.id, req.user.id);
    note.pinned = !note.pinned;
    await note.save();
    res.status(200).json({ success: true, note });
  } catch (err: any) {
    logger.error("Toggle pin error:", err);
    res.status(err.status || 500).json({ success: false, message: err.message || "Failed to toggle pin" });
  }
};

// Set or remove PIN (lock/unlock note)
export const setNoteLock = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: "Not authenticated" });

    const { enable, pinCode } = req.body;
    const note = await notesService.findByIdAndOwner(req.params.id, req.user.id);

    if (enable) {
      if (!pinCode || typeof pinCode !== "string" || pinCode.length !== 4) {
        return res.status(400).json({ success: false, message: "PIN must be a 4-digit string" });
      }
      await notesService.setNoteLock(req.params.id, req.user.id, pinCode, true);
      const updated = await notesService.findByIdAndOwner(req.params.id, req.user.id); // re-fetch
      return res.status(200).json({ success: true, note: updated });
    } else {
      await notesService.setNoteLock(req.params.id, req.user.id, undefined, false);
      const updated = await notesService.findByIdAndOwner(req.params.id, req.user.id);
      return res.status(200).json({ success: true, note: updated });
    }
  } catch (err: any) {
    logger.error("Set lock error:", err);
    res.status(err.status || 500).json({ success: false, message: err.message || "Failed to set lock" });
  }
};

// Unlock note — verify PIN and return note if PIN correct
export const unlockNote = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: "Not authenticated" });

    const { pinCode } = req.body;
    const note = await notesService.verifyNotePin(req.params.id, req.user.id, pinCode);
    return res.status(200).json({ success: true, note });
  } catch (err: any) {
    logger.error("Unlock note error:", err);
    res.status(err.status || 500).json({ success: false, message: err.message || "Incorrect PIN" });
  }
};

// Permanent delete
export const deleteNotePermanent = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: "Not authenticated" });

    await notesService.deleteNotePermanent(req.params.id, req.user.id);
    res.status(200).json({ success: true, message: "Note permanently deleted" });
  } catch (err: any) {
    logger.error("Permanent delete error:", err);
    res.status(err.status || 500).json({ success: false, message: err.message || "Failed to delete note permanently" });
  }
};
