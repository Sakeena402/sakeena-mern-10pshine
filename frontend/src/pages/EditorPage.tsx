"use client"

import { useEffect, useRef, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useQuery, useMutation } from "@tanstack/react-query"
import Quill from "quill"
import "quill/dist/quill.snow.css"
import { ArrowLeft, Trash2, Save } from "lucide-react"
import Button from "../components/Button"
import { useApi } from "../hooks/useApi"
import type { INote } from "../types"

export default function EditorPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { request } = useApi()
  const editorRef = useRef<HTMLDivElement>(null)
  const quillRef = useRef<Quill | null>(null)
  const [title, setTitle] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  const { data: note, isLoading } = useQuery({
    queryKey: ["note", id],
    queryFn: () => request(`/notes/${id}`),
    enabled: !!id,
  })

  // Initialize Quill editor
  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        placeholder: "Start typing...",
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline", "strike"],
            ["blockquote", "code-block"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image"],
            ["clean"],
          ],
        },
      })
    }
  }, [])

  // Load note content
  useEffect(() => {
    if (note && quillRef.current) {
      setTitle(note.title)
      setTags(note.tags)
      quillRef.current.root.innerHTML = note.content
    }
  }, [note])

  const updateNoteMutation = useMutation({
    mutationFn: (data: Partial<INote>) =>
      request(`/notes/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
  })

  const handleSave = async () => {
    if (!quillRef.current) return

    setIsSaving(true)
    try {
      await updateNoteMutation.mutateAsync({
        title: title || "Untitled Note",
        content: quillRef.current.root.innerHTML,
        tags,
      })
    } catch (error) {
      console.error("Failed to save note:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this note?")) {
      try {
        await request(`/notes/${id}`, { method: "DELETE" })
        navigate("/notes")
      } catch (error) {
        console.error("Failed to delete note:", error)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading note...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
            >
              <Trash2 size={16} className="mr-1" />
              Delete
            </Button>
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

      <main className="max-w-5xl mx-auto px-8 py-8">
        <div className="bg-white rounded-lg border border-gray-200 p-8 space-y-6">
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Untitled Note"
              className="w-full text-3xl font-serif font-bold text-gray-900 bg-transparent border-none outline-none placeholder-gray-400"
            />
          </div>

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
                    onClick={() => handleRemoveTag(tag)}
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
                onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                placeholder="Add a tag..."
                className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-colors"
              />
              <Button variant="secondary" size="sm" onClick={handleAddTag}>
                Add
              </Button>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Content</label>
            <div ref={editorRef} className="bg-white rounded-lg border border-gray-200" />
          </div>
        </div>
      </main>

      <style>{`
        .ql-toolbar {
          background-color: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem 0.5rem 0 0;
          border-bottom: 1px solid #e5e7eb;
        }
        .ql-container {
          background-color: white;
          border: none;
          border-radius: 0 0 0.5rem 0.5rem;
          font-family: inherit;
        }
        .ql-editor {
          min-height: 400px;
          padding: 1.5rem;
          font-size: 1rem;
          line-height: 1.6;
        }
        .ql-editor.ql-blank::before {
          color: #d1d5db;
          font-style: normal;
        }
        .ql-toolbar.ql-snow .ql-stroke {
          stroke: #6b7280;
        }
        .ql-toolbar.ql-snow .ql-fill {
          fill: #6b7280;
        }
        .ql-toolbar.ql-snow button:hover .ql-stroke,
        .ql-toolbar.ql-snow button.ql-active .ql-stroke {
          stroke: #b45309;
        }
        .ql-toolbar.ql-snow button:hover .ql-fill,
        .ql-toolbar.ql-snow button.ql-active .ql-fill {
          fill: #b45309;
        }
      `}</style>
    </div>
  )
}
