import Note from "../models/Note"

export class NotesService {
  // async listNotes(
  //   userId: string,
  //   filters: {
  //     q?: string
  //     tags?: string[]
  //     archived?: boolean
  //     trashed?: boolean
  //     pinned?: boolean
  //     page?: number
  //     limit?: number
  //   },
  // ) {
  //   const page = filters.page || 1
  //   const limit = filters.limit || 10
  //   const skip = (page - 1) * limit

  //   const query: any = { owner: userId }

  //   if (filters.q) {
  //     query.$or = [{ title: { $regex: filters.q, $options: "i" } }, { plainText: { $regex: filters.q, $options: "i" } }]
  //   }

  //   if (filters.tags && filters.tags.length > 0) {
  //     query.tags = { $in: filters.tags }
  //   }

  //   if (filters.archived !== undefined) {
  //     query.archived = filters.archived
  //   }

  //   if (filters.trashed !== undefined) {
  //     query.trashed = filters.trashed
  //   }

  //   if (filters.pinned !== undefined) {
  //     query.pinned = filters.pinned
  //   }

  //   const notes = await Note.find(query).sort({ pinned: -1, lastEditedAt: -1 }).skip(skip).limit(limit)

  //   const total = await Note.countDocuments(query)

  //   return {
  //     notes,
  //     meta: { page, limit, total },
  //   }
  // }

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
    const note = await Note.findOne({ _id: noteId, owner: userId })
    if (!note) {
      throw { status: 404, message: "Note not found" }
    }
    return note
  }

  async createNote(userId: string, data: { title?: string; content?: string; bgColor?: string; tags?: string[] }) {
    const note = new Note({
      owner: userId,
      title: data.title || "Untitled Note",
      content: data.content || "",
      plainText: this.extractPlainText(data.content || ""),
      bgColor: data.bgColor || "#fef5e7",
      tags: data.tags || [],
    })

    await note.save()
    return note
  }

  async updateNote(
    noteId: string,
    userId: string,
    data: { title?: string; content?: string; bgColor?: string; tags?: string[] },
  ) {
    const note = await Note.findOne({ _id: noteId, owner: userId })
    if (!note) {
      throw { status: 404, message: "Note not found" }
    }

    if (data.title !== undefined) note.title = data.title
    if (data.content !== undefined) {
      note.content = data.content
      note.plainText = this.extractPlainText(data.content)
    }
    if (data.bgColor !== undefined) note.bgColor = data.bgColor
    if (data.tags !== undefined) note.tags = data.tags

    note.lastEditedAt = new Date()
    note.version += 1

    await note.save()
    return note
  }

  async archiveNote(noteId: string, userId: string, archived: boolean) {
    const note = await Note.findOne({ _id: noteId, owner: userId })
    if (!note) {
      throw { status: 404, message: "Note not found" }
    }

    note.archived = archived
    note.lastEditedAt = new Date()
    await note.save()
    return note
  }

  async deleteNote(noteId: string, userId: string) {
    const note = await Note.findOne({ _id: noteId, owner: userId })
    if (!note) {
      throw { status: 404, message: "Note not found" }
    }

    note.trashed = true
    note.lastEditedAt = new Date()
    await note.save()
    return { success: true }
  }

  async restoreNote(noteId: string, userId: string) {
    const note = await Note.findOne({ _id: noteId, owner: userId })
    if (!note) {
      throw { status: 404, message: "Note not found" }
    }

    note.trashed = false
    note.lastEditedAt = new Date()
    await note.save()
    return note
  }

  async setNotePin(noteId: string, userId: string, pinCode?: string, enable?: boolean) {
  const note = await Note.findOne({ _id: noteId, owner: userId }).select("+pinCode")
  if (!note) throw { status: 404, message: "Note not found" }

  if (enable) {
    if (!pinCode || pinCode.length !== 4) {
      throw { status: 400, message: "PIN must be a 4-digit number" }
    }
    note.pinCode = pinCode
    note.pinEnabled = true
  } else {
    note.pinCode = undefined
    note.pinEnabled = false
  }

  await note.save()
  return note
}

async unlockNote(noteId: string, userId: string, pinCode: string) {
  const note = await Note.findOne({ _id: noteId, owner: userId }).select("+pinCode")
  if (!note) throw { status: 404, message: "Note not found" }
  if (!note.pinEnabled) throw { status: 400, message: "Note not locked" }

  if (note.pinCode !== pinCode) {
    throw { status: 401, message: "Invalid PIN" }
  }

  return note
}

  private extractPlainText(html: string): string {
    return html.replace(/<[^>]*>/g, "").trim()
  }
}


export default new NotesService()
