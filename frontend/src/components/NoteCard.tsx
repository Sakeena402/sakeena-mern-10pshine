

"use client";

import { Pin, Lock, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { INote } from "../types";

interface NoteCardProps {
  note: INote;
  onDelete: (id: string) => void;
  onTogglePin: (id: string) => void;
  onLockOpen: (id: string, mode: "set" | "enter") => void;
}

export default function NoteCard({ note, onDelete, onTogglePin, onLockOpen }: NoteCardProps) {
  const navigate = useNavigate();

  // Safe plain-text preview from HTML
  const preview = note.plainText?.trim()
    ? note.plainText.slice(0, 100) + (note.plainText.length > 100 ? "..." : "")
    : "No content yet...";

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (note.pinEnabled) {
      // If locked → open enter-PIN modal
      onLockOpen(note._id, "enter");
      return;
    }

    // Navigate to note details page
    navigate(`/notes/${note._id}`);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Move this note to Trash?")) {
      onDelete(note._id);
    }
  };

  const handleLockToggle = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (note.pinEnabled) {
      // Ask before removing PIN
      if (confirm("Remove PIN protection?")) {
        onLockOpen(note._id, "set"); // Modal will handle removal (e.g. empty PIN)
      }
    } else {
      // Set a new PIN
      onLockOpen(note._id, "set");
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`relative group rounded-2xl shadow-sm border p-4 bg-white hover:shadow-md transition cursor-pointer overflow-hidden`}
    >
      {/* Lock overlay (disabled interaction) */}
      {note.pinEnabled && (
        <div className="absolute inset-0 bg-gray-100/70 flex items-center justify-center rounded-2xl z-10">
          <Lock size={24} className="text-gray-500" />
        </div>
      )}

      {/* Action buttons */}
      <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition">
        {/* Pin */}
        <button
          title="Toggle Pin"
          onClick={(e) => {
            e.stopPropagation();
            onTogglePin(note._id);
          }}
          className="p-1 rounded hover:bg-gray-200"
        >
          <Pin size={16} className={note.pinned ? "text-amber-600" : "text-gray-500"} />
        </button>

        {/* Lock/Unlock */}
        <button
          title={note.pinEnabled ? "Unlock / Remove PIN" : "Set PIN Lock"}
          onClick={handleLockToggle}
          className="p-1 rounded hover:bg-gray-200"
        >
          <Lock size={16} className={note.pinEnabled ? "text-amber-600" : "text-gray-500"} />
        </button>

        {/* Delete */}
        <button
          title="Move to Trash"
          onClick={handleDelete}
          className="p-1 rounded hover:bg-gray-200"
        >
          <Trash2 size={16} className="text-gray-500" />
        </button>
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {note.title || "Untitled Note"}
      </h3>

      {/* Content Preview */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{preview}</p>

      {/* Tags */}
      {note.tags && note.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 text-xs text-gray-500">
          {note.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
          {note.tags.length > 2 && <span>+{note.tags.length - 2}</span>}
        </div>
      )}
    </div>
  );
}
