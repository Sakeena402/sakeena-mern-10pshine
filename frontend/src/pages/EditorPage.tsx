
"use client"

import React, { useRef, useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useQuery, useMutation } from "@tanstack/react-query"
import { ArrowLeft, Trash2, Save } from "lucide-react"
import JoditEditor from "jodit-react"
import Button from "../components/Button"
import { useApi } from "../hooks/useApi"
import type { INote } from "../types"
import "jodit/es5/jodit.min.css"

export default function EditorPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { request } = useApi()
  const editor = useRef(null)
  const [title, setTitle] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [content, setContent] = useState("")
  const [bgColor, setBgColor] = useState("#fef5e7")
  const [isSaving, setIsSaving] = useState(false)

  const isNew = !id || id === "new"

  // ✅ Fetch note details if editing
  const { data: note, isLoading } = useQuery({
    queryKey: ["note", id],
    queryFn: () => request(`/notes/${id}`),
    enabled: !isNew,
  })

  // ✅ Load fetched note into state when ready
  useEffect(() => {
    if (note) {
      setTitle(note.title || "")
      setContent(note.content || "")
      setTags(note.tags || [])
      setBgColor(note.bgColor || "#fef5e7")
    }
  }, [note])

  // ✅ Mutations for create / update
  const createNoteMutation = useMutation({
    mutationFn: (data: Partial<INote>) =>
      request("/notes", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  })

  const updateNoteMutation = useMutation({
    mutationFn: (data: Partial<INote>) =>
      request(`/notes/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
  })

  // // ✅ Save handler
  // const handleSave = async () => {
  //   if (!title && !content) return
  //   setIsSaving(true)

  //   try {
  //     if (isNew) {
  //       const newNote = await createNoteMutation.mutateAsync({
  //         title: title || "Untitled Note",
  //         content,
  //         bgColor,
  //         tags,
  //       })
  //       navigate(`/notes/${newNote._id}`)
  //     } else {
  //       await updateNoteMutation.mutateAsync({
  //         title: title || "Untitled Note",
  //         content,
  //         bgColor,
  //         tags,
  //       })
  //     }
  //   } catch (error) {
  //     console.error("❌ Failed to save note:", error)
  //     alert("Failed to save note. Please try again.")
  //   } finally {
  //     setIsSaving(false)
  //   }
  // }

  const handleSave = async () => {
  if (!title && !content) return;
  setIsSaving(true);

  try {
    if (isNew) {
      const response = await createNoteMutation.mutateAsync({
        title: title || "Untitled Note",
        content,
        bgColor,
        tags,
      });

      // ✅ Check where your note object is returned
      const newNote = response.note || response;

      if (newNote && newNote._id) {
        navigate(`/notes/${newNote._id}`);
      } else {
        console.error("❌ Note ID not found in response:", response);
        alert("Note saved but could not open it. Please refresh the page.");
      }
    } else {
      await updateNoteMutation.mutateAsync({
        title: title || "Untitled Note",
        content,
        bgColor,
        tags,
      });
    }
  } catch (error) {
    console.error("❌ Failed to save note:", error);
    alert("Failed to save note. Please try again.");
  } finally {
    setIsSaving(false);
  }
};

  // ✅ Auto-save every 5s
  useEffect(() => {
    if (!isNew) {
      const timer = setTimeout(() => handleSave(), 5000)
      return () => clearTimeout(timer)
    }
  }, [title, content, tags, bgColor])

  // ✅ Delete note
  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this note?")) {
      try {
        await request(`/notes/${id}`, { method: "DELETE" })
        navigate("/notes")
      } catch (error) {
        console.error("❌ Failed to delete note:", error)
      }
    }
  }

  // ✅ Jodit config
  const config = {
    readonly: false,
    height: 400,
    toolbarSticky: false,
    showWordsCounter: false,
    placeholder: "Start writing your note here...",
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading note...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: bgColor }}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-8 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/notes")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back</span>
          </button>

          <div className="flex gap-3">
            {!isNew && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
              >
                <Trash2 size={16} className="mr-1" />
                Delete
              </Button>
            )}

            <Button
              variant="primary"
              size="sm"
              isLoading={isSaving}
              onClick={handleSave}
              className="flex items-center gap-2"
            >
              <Save size={16} />
              Save
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-8 py-8">
        <div className="bg-white rounded-lg border border-gray-200 p-8 space-y-6">
          {/* Title */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Untitled Note"
            className="w-full text-3xl font-serif font-bold text-gray-900 bg-transparent border-none outline-none placeholder-gray-400"
          />

          {/* Tags */}
          <div className="border-t border-gray-200 pt-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Tags</label>
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full text-sm font-medium border border-amber-200"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => setTags(tags.filter((t) => t !== tag))}
                    className="hover:text-amber-900 font-bold text-lg leading-none"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          if (tagInput.trim()) {
                            setTags([...tags, tagInput.trim()]);
                            setTagInput("");
                          }
                        }
                      }}
                placeholder="Add a tag..."
                className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-colors"
              />
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  if (tagInput.trim()) {
                    setTags([...tags, tagInput.trim()])
                    setTagInput("")
                  }
                }}
              >
                Add
              </Button>
            </div>
          </div>

          {/* Editor */}
          <div className="border-t border-gray-200 pt-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Content</label>
            <JoditEditor ref={editor} value={content} config={config} onChange={setContent} />
          </div>
        </div>
      </main>
    </div>
  )
}
