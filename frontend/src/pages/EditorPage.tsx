


// "use client"

// import React, { useRef, useState, useEffect, useCallback } from "react"
// import { useParams, useNavigate } from "react-router-dom"
// import { useQuery, useMutation } from "@tanstack/react-query"
// import { ArrowLeft, Trash2, Save } from "lucide-react"
// import JoditEditor from "jodit-react"
// import Button from "../components/Button"
// import { useApi } from "../hooks/useApi"
// import type { INote } from "../types"
// import "jodit/es5/jodit.min.css"

// export default function EditorPage() {
//   const { id } = useParams<{ id: string }>()
//   const navigate = useNavigate()
//   const { request } = useApi()
// const editorRef = useRef<any>(null);


//   const [title, setTitle] = useState("")
//   const [tags, setTags] = useState<string[]>([])
//   const [tagInput, setTagInput] = useState("")
//   const [content, setContent] = useState("")
//   const [bgColor, setBgColor] = useState("#fef5e7")
//   const [isSaving, setIsSaving] = useState(false)

//   const isNew = !id || id === "new"

//   // ✅ Fetch note details if editing
//   const { data, isLoading } = useQuery({
//     queryKey: ["note", id],
//     queryFn: async () => {
//       const res = await request(`/notes/${id}`)
//       return res.note
//     },
//     enabled: !isNew,
//   })

//   // ✅ Populate form only once when data arrives (⚡ added safe check)
//   useEffect(() => {
//     if (data) {
//       setTitle(data.title || "")
//       setContent(data.content || "")
//       setTags(Array.isArray(data.tags) ? data.tags : [])
//       setBgColor(data.bgColor || "#fef5e7")
//     }
//   }, [data])

//   // ✅ Create / Update mutations
//   const createNoteMutation = useMutation({
//     mutationFn: (payload: Partial<INote>) =>
//       request("/notes", {
//         method: "POST",
//         body: JSON.stringify(payload),
//       }),
//   })

//   const updateNoteMutation = useMutation({
//     mutationFn: (payload: Partial<INote>) =>
//       request(`/notes/${id}`, {
//         method: "PUT",
//         body: JSON.stringify(payload),
//       }),
//   })


// // const handleSave = useCallback(async () => {
// //   if (!title && !content) return;
// //   setIsSaving(true);

// //   try {
// //     const currentContent = content || "";

// //     const payload = {
// //       title: title.trim() || "Untitled Note",
// //       content: currentContent,
// //       plainText: currentContent.replace(/<[^>]+>/g, ""),
// //       bgColor,
// //       tags,
// //     };

// //     if (isNew) {
// //       const res = await createNoteMutation.mutateAsync(payload);
// //       const newNote = res.note || res;
// //       if (newNote?._id) navigate(`/notes/${newNote._id}`);
// //     } else {
// //       // ✅ Capture response
// //       const res = await updateNoteMutation.mutateAsync(payload);
// //       const updatedNote = res.note || res;

// //       // ✅ Sync latest backend content
// //       if (updatedNote?.content) setContent(updatedNote.content);
// //       if (updatedNote?.title) setTitle(updatedNote.title);
// //     }

// //     alert("✅ Note updated successfully!");
// //   } catch (err) {
// //     console.error("❌ Failed to save note:", err);
// //     alert("Save failed. Try again.");
// //   } finally {
// //     setIsSaving(false);
// //   }
// // }, [title, content, bgColor, tags, isNew, id]);


// // ✅ Debounced auto-save only when editing (⚡ fixed stale updates)
// const handleSave = async () => {
//   try {
//     const updatedNote = {
//       title,
//       content,
//     };

//     const res = await fetch(`/api/notes/${id}`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(updatedNote),
//     });

//     if (!res.ok) {
//       const err = await res.json();
//       alert(`❌ Failed to save note: ${err.message}`);
//       return;
//     }

//     const data = await res.json();
//     alert("✅ Note updated successfully!");
//     setContent(data.note.content);
//   } catch (err) {
//     alert(`❌ Failed to save note: ${err}`);
//   }
// };



//   useEffect(() => {
//     if (!isNew) {
//       const timer = setTimeout(() => {
//         if (!isSaving) handleSave()
//       }, 4000)
//       return () => clearTimeout(timer)
//     }
//   }, [title, content, tags, bgColor, isSaving, handleSave])

//   // ✅ Delete note
//   const handleDelete = async () => {
//     if (confirm("Delete this note?")) {
//       await request(`/notes/${id}`, { method: "DELETE" })
//       navigate("/notes")
//     }
//   }

//   // ✅ Jodit Config (⚡ added `saveModeInCookies: false`)
//   const config = {
//     readonly: false,
//     height: 400,
//     toolbarSticky: false,
//     saveModeInCookies: false,
//     placeholder: "Start writing your note here...",
//   }

//   if (isLoading) return <p className="text-center p-8">Loading note...</p>

//   return (
//     <div className="min-h-screen" style={{ backgroundColor: bgColor }}>
//       {/* Header */}
//       <div className="bg-white border-b sticky top-0 z-10 px-8 py-4 flex items-center justify-between">
//         <button
//           onClick={() => navigate("/notes")}
//           className="flex items-center gap-2 text-gray-600"
//         >
//           <ArrowLeft size={18} /> Back
//         </button>

//         <div className="flex gap-3">
//           {!isNew && (
//             <Button variant="outline" size="sm" onClick={handleDelete}>
//               <Trash2 size={16} /> Delete
//             </Button>
//           )}
//           <Button
//             variant="primary"
//             size="sm"
//             isLoading={isSaving}
//             onClick={handleSave}
//           >
//             <Save size={16} /> Save
//           </Button>
//         </div>
//       </div>

//       {/* Main Content */}
//       <main className="max-w-5xl mx-auto px-8 py-8">
//         <div className="bg-white rounded-lg border p-8 space-y-6">
//           {/* Title */}
//           <input
//             type="text"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             placeholder="Untitled Note"
//             className="w-full text-3xl font-bold border-none outline-none bg-transparent"
//           />

//           {/* Tags */}
//           <div className="border-t pt-4">
//             <label className="text-sm font-semibold">Tags</label>
//             <div className="flex flex-wrap gap-2 my-2">
//               {tags.map((tag) => (
//                 <span
//                   key={tag}
//                   className="bg-amber-100 px-3 py-1 rounded-full text-sm flex items-center gap-2"
//                 >
//                   {tag}
//                   <button onClick={() => setTags(tags.filter((t) => t !== tag))}>
//                     ×
//                   </button>
//                 </span>
//               ))}
//             </div>
//             <div className="flex gap-2">
//               <input
//                 type="text"
//                 value={tagInput}
//                 onChange={(e) => setTagInput(e.target.value)}
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter") {
//                     e.preventDefault()
//                     if (tagInput.trim()) {
//                       setTags([...tags, tagInput.trim()])
//                       setTagInput("")
//                     }
//                   }
//                 }}
//                 placeholder="Add tag..."
//                 className="flex-1 border rounded-lg px-3 py-2"
//               />
//             </div>
//           </div>

//           {/* Editor */}
//           <div className="border-t pt-4">
           
//            <JoditEditor
//             key={id || "new"}
//               ref={editorRef}
//               value={content}
//               config={{
//     readonly: false,
//     height: 400,
//     saveModeInStorage: false, // disable local storage
//     toolbarAdaptive: false,
//     buttons: ['bold', 'italic', 'underline', '|', 'ul', 'ol', '|', 'link', '|', 'source'],
//     askBeforePasteHTML: false,
//     askBeforePasteFromWord: false,
//   }}
              // onBlur={(newContent) => setContent(newContent)} // this is perfect
//             />


//           </div>
//         </div>
//       </main>
//     </div>
//   )
// }

"use client"

import React, { useRef, useState, useEffect, useCallback } from "react"
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
  const editorRef = useRef<any>(null)

  const [title, setTitle] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [content, setContent] = useState("")
  const [bgColor, setBgColor] = useState("#fef5e7")
  const [isSaving, setIsSaving] = useState(false)

  const isNew = !id || id === "new"

  // Fetch note details if editing
  const { data, isLoading } = useQuery({
    queryKey: ["note", id],
    queryFn: async () => {
      const res = await request(`/notes/${id}`)
      return res.note
    },
    enabled: !isNew,
    // keep previous data false to simplify – we'll set state on data change
    keepPreviousData: false,
  })

  // Populate form when data arrives
  useEffect(() => {
    if (data) {
      setTitle(data.title || "")
      setContent(data.content || "")
      setTags(Array.isArray(data.tags) ? data.tags : [])
      setBgColor(data.bgColor || "#fef5e7")
    }
  }, [data])

  // Create / Update mutations using your request hook
  const createNoteMutation = useMutation({
    mutationFn: (payload: Partial<INote>) =>
      request("/notes", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
  })

  const updateNoteMutation = useMutation({
    mutationFn: (payload: Partial<INote>) =>
      request(`/notes/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      }),
  })

  // Manual Save handler (no autosave)
  const handleSave = useCallback(async () => {
    // if both empty, don't save
    if (!title.trim() && !content.trim()) {
      alert("Please add a title or content before saving.")
      return
    }

    setIsSaving(true)
    try {
      const payload = {
        title: title.trim() || "Untitled Note",
        content,
        plainText: content.replace(/<[^>]+>/g, ""),
        bgColor,
        tags,
      }

      if (isNew) {
        const res = await createNoteMutation.mutateAsync(payload)
        const newNote = res.note || res
        if (newNote?._id) {
          // sync local state with saved note and navigate to its page
          setContent(newNote.content || "")
          setTitle(newNote.title || "")
          navigate(`/notes/${newNote._id}`)
        } else {
          alert("Save succeeded but server returned unexpected response.")
        }
      } else {
        const res = await updateNoteMutation.mutateAsync(payload)
        const updatedNote = res.note || res

        // Sync local UI with backend response (very important)
        if (updatedNote?.content !== undefined) setContent(updatedNote.content)
        if (updatedNote?.title !== undefined) setTitle(updatedNote.title)
        if (updatedNote?.bgColor !== undefined) setBgColor(updatedNote.bgColor)

        alert("✅ Note updated successfully!")
      }
    } catch (err: any) {
      console.error("❌ Failed to save note:", err)
      // try to show server message if present
      const msg = err?.message || (err?.data && err.data.message) || "Save failed. Try again."
      alert(`❌ Failed to save note: ${msg}`)
    } finally {
      setIsSaving(false)
    }
  }, [title, content, bgColor, tags, isNew, id, createNoteMutation, updateNoteMutation, navigate])

  // Remove autosave: DO NOT use an effect that triggers handleSave periodically
  // (If you had one earlier, it's removed.)

  // Delete note
  const handleDelete = async () => {
    if (!confirm("Delete this note?")) return
    try {
      await request(`/notes/${id}`, { method: "DELETE" })
      navigate("/notes")
    } catch (err) {
      console.error("Delete failed:", err)
      alert("Failed to delete note.")
    }
  }

  const config = {
    readonly: false,
    height: 400,
    toolbarSticky: false,
    saveModeInStorage: false, // disable local storage
    toolbarAdaptive: false,
    // buttons: ["bold", "italic", "underline", "|", "ul", "ol", "|", "link", "|", "source"],
    askBeforePasteHTML: false,
    askBeforePasteFromWord: false,
    placeholder: "Start writing your note here...",
  }

  if (isLoading) return <p className="text-center p-8">Loading note...</p>

  return (
    <div className="min-h-screen" style={{ backgroundColor: bgColor }}>
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10 px-8 py-4 flex items-center justify-between">
        <button onClick={() => navigate("/notes")} className="flex items-center gap-2 text-gray-600">
          <ArrowLeft size={18} /> Back
        </button>

        <div className="flex gap-3">
          {!isNew && (
            <Button variant="outline" size="sm" onClick={handleDelete}>
              <Trash2 size={16} /> Delete
            </Button>
          )}
          <Button variant="primary" size="sm" isLoading={isSaving} onClick={handleSave}>
            <Save size={16} /> Save
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-8 py-8">
        <div className="bg-white rounded-lg border p-8 space-y-6">
          {/* Title */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Untitled Note"
            className="w-full text-3xl font-bold border-none outline-none bg-transparent"
          />

          {/* Tags */}
          <div className="border-t pt-4">
            <label className="text-sm font-semibold">Tags</label>
            <div className="flex flex-wrap gap-2 my-2">
              {tags.map((tag) => (
                <span key={tag} className="bg-amber-100 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  {tag}
                  <button onClick={() => setTags(tags.filter((t) => t !== tag))}>×</button>
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
                    e.preventDefault()
                    if (tagInput.trim()) {
                      setTags((s) => [...s, tagInput.trim()])
                      setTagInput("")
                    }
                  }
                }}
                placeholder="Add tag..."
                className="flex-1 border rounded-lg px-3 py-2"
              />
            </div>
          </div>

          {/* Editor */}
          <div className="border-t pt-4">
            <JoditEditor
              key={id || "new"} // force remount when note id changes
              ref={editorRef}
              value={content}
              config={config}
             onBlur={(newContent) => setContent(newContent)} // this is perfect
            />
          </div>
        </div>
      </main>
    </div>
  )
}
