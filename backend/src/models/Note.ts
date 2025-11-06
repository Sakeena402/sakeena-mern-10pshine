// import mongoose, { Schema, type Document, type Types } from "mongoose"

// interface INote extends Document {
//   owner: Types.ObjectId
//   title: string
//   content: string
//   plainText: string
//   bgColor: string
//   tags: string[]
//   pinned: boolean
//   pinEnabled: boolean
//   pinCode: string
//   archived: boolean
//   trashed: boolean
//   collaborators: Types.ObjectId[]
//   attachments: string[]
//   lastEditedAt: Date
//   version: number
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
//     attachments: [{ type: String }], // Jodit image/file attachments
//     lastEditedAt: { type: Date, default: Date.now },
//     version: { type: Number, default: 1 },
//   },
//   { timestamps: true }
// )

// noteSchema.index({ owner: 1, trashed: 1, archived: 1, pinned: 1 })
// noteSchema.index({ title: "text", plainText: "text", tags: 1 })
// noteSchema.virtual("tagsString").get(function () {
//   return this.tags.join(" ");
// });

// noteSchema.index({ title: "text", content: "text", tagsString: "text" });


// export default mongoose.model<INote>("Note", noteSchema)
import mongoose, { Schema, type Document, type Types } from "mongoose";

interface INote extends Document {
  owner: Types.ObjectId;
  title: string;
  content: string;
  plainText: string;
  bgColor: string;
  tags: string[];
  pinned: boolean;
  pinEnabled: boolean;
  pinCode?: string;
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
    pinned: { type: Boolean, default: false },
    pinEnabled: { type: Boolean, default: false },
    pinCode: { type: String, select: false },
    archived: { type: Boolean, default: false },
    trashed: { type: Boolean, default: false },
    collaborators: [{ type: Schema.Types.ObjectId, ref: "User" }],
    attachments: [{ type: String }],
    lastEditedAt: { type: Date, default: Date.now },
    version: { type: Number, default: 1 },
  },
  { timestamps: true }
);

// ✅ Basic filters for performance
noteSchema.index({ owner: 1, trashed: 1, archived: 1, pinned: 1 });

// ✅ Safe text index — exclude 'tags' array
noteSchema.index({
  title: "text",
  content: "text",
  plainText: "text"
});

export default mongoose.model<INote>("Note", noteSchema);
