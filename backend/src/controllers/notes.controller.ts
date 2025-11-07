               

// export const listNotes = async (req: AuthRequest, res: Response) => {
//   try {
//     if (!req.user) {
//       return res.status(401).json({ success: false, message: "Not authenticated" });
//     }

//     const filters = {
//       q: req.query.q as string,
//       tags: req.query.tags
//         ? (Array.isArray(req.query.tags)
//             ? req.query.tags
//             : (req.query.tags as string).split(","))
//         : undefined,
//       archived: req.query.archived ? req.query.archived === "true" : undefined,
//       trashed: req.query.trashed ? req.query.trashed === "true" : undefined,
//       pinned: req.query.pinned ? req.query.pinned === "true" : undefined,
//       page: req.query.page ? Number.parseInt(req.query.page as string) : 1,
//       limit: req.query.limit ? Number.parseInt(req.query.limit as string) : 10,
//     };

//     // ✅ pass tags and q (search text) to your service
//     const result = await notesService.listNotes(req.user.id, filters);
//     res.status(200).json({ success: true, ...result });
//   } catch (error: any) {
//     logger.error("List notes error:", error);
//     res.status(error.status || 500).json({
//       success: false,
//       message: error.message || "Failed to fetch notes",
//     });
//   }
// };

// export const getNote = async (req: AuthRequest, res: Response) => {
//   try {
//     if (!req.user) {
//       return res.status(401).json({ success: false, message: "Not authenticated" })
//     }

//     const note = await notesService.getNote(req.params.id, req.user.id)
//     res.status(200).json({ success: true, note })
//   } catch (error: any) {
//     logger.error("Get note error:", error)
//     res.status(error.status || 500).json({
//       success: false,
//       message: error.message || "Failed to fetch note",
//     })
//   }
// }

// export const createNote = async (req: AuthRequest, res: Response) => {
//   try {
//     if (!req.user) {
//       return res.status(401).json({ success: false, message: "Not authenticated" })
//     }

//     const note = await notesService.createNote(req.user.id, req.body)
//     res.status(201).json({ success: true, note })
//   } catch (error: any) {
//     logger.error("Create note error:", error)
//     res.status(error.status || 500).json({
//       success: false,
//       message: error.message || "Failed to create note",
//     })
//   }
// }

// export const updateNote = async (req: AuthRequest, res: Response) => {
//   try {
//     if (!req.user) {
//       return res.status(401).json({ success: false, message: "Not authenticated" })
//     }

//     const note = await notesService.updateNote(req.params.id, req.user.id, req.body)
//     res.status(200).json({ success: true, note })
//   } catch (error: any) {
//     logger.error("Update note error:", error)
//     res.status(error.status || 500).json({
//       success: false,
//       message: error.message || "Failed to update note",
//     })
//   }
// }


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

export const setNotePin = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }
    const note = await notesService.getNote(req.params.id, req.user.id);
    if (!note) return res.status(404).json({ message: "Note not found" });

    const { enable, pinCode } = req.body;
 
    if (enable) {
      if (!pinCode || pinCode.length !== 4)
        return res.status(400).json({ message: "Invalid PIN" });
      note.pinCode = pinCode;
      note.pinEnabled = true;
    } else {
      note.pinCode = undefined;
      note.pinEnabled = false;
    }

    await note.save();
    res.json(note);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


export const unlockNote = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: "Not authenticated" })

    const { pinCode } = req.body
    const note = await notesService.unlockNote(req.params.id, req.user.id, pinCode)

    res.status(200).json({ success: true, note })
  } catch (error: any) {
    res.status(error.status || 500).json({
      success: false,
      message: error.message || "Incorrect PIN",
    })
  }
}

export const togglePin = async (req: AuthRequest, res: Response) => {
  const note = await notesService.findById(req.params.id);
  if (!note) return res.status(404).json({ message: "Note not found" });
  note.pinned = !note.pinned;
  await note.save();
  res.json(note);
};