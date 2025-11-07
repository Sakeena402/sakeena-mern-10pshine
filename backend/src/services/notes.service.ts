import Note from "../models/Note"
import bcrypt from "bcrypt";

class NotesService {
  async listNotes(userId: string, filters: any) {
    const query: any = { owner: userId };

    if (filters.q) {
      query.$text = { $search: filters.q };
    }

    if (filters.tags && filters.tags.length > 0) {
      query.tags = { $all: filters.tags }; // 🔍 filter by all given tags
    }

    if (filters.archived !== undefined) query.archived = filters.archived;
    if (filters.trashed !== undefined) query.trashed = filters.trashed;
    if (filters.pinned !== undefined) query.pinned = filters.pinned;

    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;

    const notes = await Note.find(query)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Note.countDocuments(query);
    return { notes, total, page, limit };
  }

  async getNote(noteId: string, userId: string) {
    const note = await Note.findOne({ _id: noteId, owner: userId });
    if (!note) throw { status: 404, message: "Note not found" };
    return note;
  }

  async createNote(userId: string, data: { title?: string; content?: string; bgColor?: string; tags?: string[] }) {
    const note = new Note({
      owner: userId,
      title: data.title || "Untitled Note",
      content: data.content || "",
      plainText: this.extractPlainText(data.content || ""),
      bgColor: data.bgColor || "#fef5e7",
      tags: data.tags || [],
    });

    await note.save();
    return note;
  }

  async updateNote(
    noteId: string,
    userId: string,
    data: { title?: string; content?: string; bgColor?: string; tags?: string[] },
  ) {
    const note = await Note.findOne({ _id: noteId, owner: userId });
    if (!note) throw { status: 404, message: "Note not found" };

    if (data.title !== undefined) note.title = data.title;
    if (data.content !== undefined) {
      note.content = data.content;
      note.plainText = this.extractPlainText(data.content);
    }
    if (data.bgColor !== undefined) note.bgColor = data.bgColor;
    if (data.tags !== undefined) note.tags = data.tags;

    note.lastEditedAt = new Date();
    note.version += 1;

    await note.save();
    return note;
  }

  async findOne(filter: any) {
  const note = await Note.findOne(filter);
  if (!note) {
    throw { status: 404, message: "Note not found" };
  }
  return note;
}

  async archiveNote(noteId: string, userId: string, archived: boolean) {
    const note = await Note.findOne({ _id: noteId, owner: userId });
    if (!note) throw { status: 404, message: "Note not found" };

    note.archived = archived;
    note.lastEditedAt = new Date();
    await note.save();
    return note;
  }

  async deleteNote(noteId: string, userId: string) {
    const note = await Note.findOne({ _id: noteId, owner: userId });
    if (!note) throw { status: 404, message: "Note not found" };

    note.trashed = true;
    note.lastEditedAt = new Date();
    await note.save();
    return { success: true };
  }

  async restoreNote(noteId: string, userId: string) {
    const note = await Note.findOne({ _id: noteId, owner: userId });
    if (!note) throw { status: 404, message: "Note not found" };

    note.trashed = false;
    note.lastEditedAt = new Date();
    await note.save();
    return note;
  }

  async findByIdAndOwner(noteId: string, userId: string) {
    const note = await Note.findOne({ _id: noteId, owner: userId }).select("+pinCode");
    if (!note) throw { status: 404, message: "Note not found" };
    return note;
  }

  // Set or remove PIN lock (stores hashed pinCode)
  async setNoteLock(noteId: string, userId: string, pinCode?: string, enable?: boolean) {
    const note = await Note.findOne({ _id: noteId, owner: userId }).select("+pinCode");
    if (!note) throw { status: 404, message: "Note not found" };

    if (enable) {
      // hash the PIN before storing
      const saltRounds = 10;
      const hash = await bcrypt.hash(pinCode!, saltRounds);
      note.pinCode = hash;
      note.pinEnabled = true;
    } else {
      note.pinCode = undefined;
      note.pinEnabled = false;
    }

    await note.save();
    return note;
  }

  // Verify PIN — throws if invalid
  async verifyNotePin(noteId: string, userId: string, pinCode: string) {
    const note = await Note.findOne({ _id: noteId, owner: userId }).select("+pinCode");
    if (!note) throw { status: 404, message: "Note not found" };
    if (!note.pinEnabled) throw { status: 400, message: "Note is not locked" };
    const match = await bcrypt.compare(pinCode, note.pinCode || "");
    if (!match) throw { status: 401, message: "Invalid PIN" };
    // return note without the pinCode field (select false on pinCode will omit by default)
    return await Note.findById(note._id);
  }

  // permanent delete
  async deleteNotePermanent(noteId: string, userId: string) {
    const note = await Note.findOne({ _id: noteId, owner: userId });
    if (!note) throw { status: 404, message: "Note not found" };
    await Note.deleteOne({ _id: noteId });
    return { success: true };
  }
  // ✅ New helper method for controllers
  async findById(noteId: string) {
    const note = await Note.findById(noteId);
    if (!note) {
      throw { status: 404, message: "Note not found" };
    }
    return note;
  }

  private extractPlainText(html: string): string {
    return html.replace(/<[^>]*>/g, "").trim();
  }
}



export default new NotesService()
