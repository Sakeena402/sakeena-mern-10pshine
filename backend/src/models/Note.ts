
// import mongoose, { Schema, type Document, type Types } from "mongoose";

// interface INote extends Document {
//   owner: Types.ObjectId;
//   title: string;
//   content: string;
//   plainText: string;
//   bgColor: string;
//   tags: string[];
//   pinned: boolean;
//   pinEnabled: boolean;
//   pinCode?: string;
//   archived: boolean;
//   trashed: boolean;
//   collaborators: Types.ObjectId[];
//   attachments: string[];
//   lastEditedAt: Date;
//   version: number;
// }

// const noteSchema = new Schema<INote>(
//   {
//     owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
//     title: { type: String, default: "Untitled Note" },
//     content: { type: String, default: "" },
//     plainText: { type: String, default: "" },
//     bgColor: { type: String, default: "#fef5e7" },
//     tags: { type: [String], default: [] },
//     pinned: { type: Boolean, default: false },
//     pinEnabled: { type: Boolean, default: false },
//     pinCode: { type: String, select: false },
//     archived: { type: Boolean, default: false },
//     trashed: { type: Boolean, default: false },
//     collaborators: [{ type: Schema.Types.ObjectId, ref: "User" }],
//     attachments: [{ type: String }],
//     lastEditedAt: { type: Date, default: Date.now },
//     version: { type: Number, default: 1 },
//   },
//   { timestamps: true }
// );

// // ✅ Basic filters for performance
// noteSchema.index({ owner: 1, trashed: 1, archived: 1, pinned: 1 });

// // ✅ Safe text index — exclude 'tags' array
// noteSchema.index({
//   title: "text",
//   content: "text",
//   plainText: "text"
// });

// export default mongoose.model<INote>("Note", noteSchema);

import mongoose, { Schema, Document, Types } from "mongoose";

export interface INote extends Document {
  owner: Types.ObjectId;
  title: string;
  content: string;
  plainText: string;
  bgColor: string;
  tags: string[];
  pinned: boolean;
  pinEnabled: boolean;
  pinCode?: string | null;
  archived: boolean;
  trashed: boolean;
  collaborators: Types.ObjectId[];
  attachments: string[];
  lastEditedAt: Date;
  version: number;
}

const noteSchema = new Schema<INote>(
  {
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, default: "Untitled Note" },
    content: { type: String, default: "" },
    plainText: { type: String, default: "" },
    bgColor: { type: String, default: "#fef5e7" },
    tags: { type: [String], default: [] },

    // 📌 Pinned notes
    pinned: { type: Boolean, default: false },

    // 🔐 PIN-protected notes
    pinEnabled: { type: Boolean, default: false },
    pinCode: { type: String, select: false, default: null },

    // 🗃️ Organization flags
    archived: { type: Boolean, default: false },
    trashed: { type: Boolean, default: false },

    // 👥 Collaboration and files
    collaborators: [{ type: Schema.Types.ObjectId, ref: "User" }],
    attachments: [{ type: String }],

    // 🕒 Metadata
    lastEditedAt: { type: Date, default: Date.now },
    version: { type: Number, default: 1 },
  },
  { timestamps: true }
);

// ⚙️ Indexes for better query performance
noteSchema.index({ owner: 1, trashed: 1, archived: 1, pinned: 1 });

// 🔍 Text search (title + content + plaintext)
noteSchema.index({
  title: "text",
  content: "text",
  plainText: "text",
});

// 🧠 Auto-update "lastEditedAt" on content change
noteSchema.pre<INote>("save", function (next) {
  if (this.isModified("content") || this.isModified("title")) {
    this.lastEditedAt = new Date();
  }
  next();
});

export default mongoose.model<INote>("Note", noteSchema);
