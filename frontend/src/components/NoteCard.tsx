// // "use client"

// // import { useNavigate } from "react-router-dom"
// // import { Trash2, Pin } from "lucide-react"
// // import type { INote } from "../types"

// // interface NoteCardProps {
// //   note: INote
// // }

// // export default function NoteCard({ note }: NoteCardProps) {
// //   const navigate = useNavigate()

// //   const handleClick = () => {
// //     navigate(`/notes/${note._id}`)
// //   }

// //   const preview = note.content.replace(/<[^>]*>/g, "").substring(0, 100)

// //   return (
// //     <div
// //       onClick={handleClick}
// //       className="bg-white rounded-lg border border-gray-200 p-6 cursor-pointer hover:shadow-md hover:border-amber-200 transition-all duration-200 group"
// //     >
// //       <div className="flex items-start justify-between mb-3">
// //         <h3 className="text-lg font-serif font-bold text-gray-900 flex-1 group-hover:text-amber-900 transition-colors">
// //           {note.title}
// //         </h3>
// //         <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
// //           <button className="p-1.5 hover:bg-gray-100 rounded transition-colors text-gray-400 hover:text-amber-700">
// //             <Pin size={16} />
// //           </button>
// //           <button className="p-1.5 hover:bg-gray-100 rounded transition-colors text-gray-400 hover:text-red-600">
// //             <Trash2 size={16} />
// //           </button>
// //         </div>
// //       </div>

// //       <p className="text-gray-600 text-sm mb-4 line-clamp-2">{preview || "No content yet..."}</p>

// //       <div className="flex items-center justify-between">
// //         <div className="flex gap-2 flex-wrap">
// //           {note.tags.slice(0, 2).map((tag) => (
// //             <span key={tag} className="text-xs bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full font-medium">
// //               {tag}
// //             </span>
// //           ))}
// //           {note.tags.length > 2 && <span className="text-xs text-gray-500 px-2.5 py-1">+{note.tags.length - 2}</span>}
// //         </div>
// //         <span className="text-xs text-gray-400">{new Date(note.updatedAt).toLocaleDateString()}</span>
// //       </div>
// //     </div>
// //   )
// // }

// "use client"

// import { useNavigate } from "react-router-dom"
// import { Trash2, Pin } from "lucide-react"
// import type { INote } from "../types"

// interface NoteCardProps {
//   note: INote
// }

// export default function NoteCard({ note }: NoteCardProps) {
//   const navigate = useNavigate()

//   const handleClick = () => {
//     navigate(`/notes/${note._id}`)
//   }

//   const preview = note.content.replace(/<[^>]*>/g, "").substring(0, 120)

//   return (
//     <div
//       onClick={handleClick}
//       className="relative group bg-gradient-to-br from-white to-amber-50 border border-gray-200 hover:border-amber-300 rounded-2xl p-5 cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300"
//     >
//       {/* Pin Button */}
//       <button
//         className={`absolute top-3 right-3 p-2 rounded-full bg-white shadow-sm text-gray-400 hover:text-amber-600 hover:shadow-md opacity-0 group-hover:opacity-100 transition-all`}
//         onClick={(e) => e.stopPropagation()}
//       >
//         <Pin size={16} />
//       </button>

//       {/* Title */}
//       <h3 className="text-lg font-semibold font-serif text-gray-900 mb-2 group-hover:text-amber-800 transition-colors leading-tight">
//         {note.title || "Untitled Note"}
//       </h3>

//       {/* Preview Text */}
//       <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
//         {preview || "No content yet..."}
//       </p>

//       {/* Tags and Date */}
//       <div className="flex items-center justify-between">
//         <div className="flex gap-2 flex-wrap">
//           {note.tags.slice(0, 2).map((tag) => (
//             <span
//               key={tag}
//               className="text-xs font-medium bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full"
//             >
//               {tag}
//             </span>
//           ))}
//           {note.tags.length > 2 && (
//             <span className="text-xs text-gray-500 px-2.5 py-1">
//               +{note.tags.length - 2}
//             </span>
//           )}
//         </div>

//         <div className="flex items-center gap-2 text-xs text-gray-400">
//           <span>{new Date(note.updatedAt).toLocaleDateString()}</span>

//           {/* Trash Button */}
//           <button
//             className="p-1.5 rounded-full hover:bg-red-50 hover:text-red-600 transition-all opacity-0 group-hover:opacity-100"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <Trash2 size={16} />
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }
"use client"

import { useNavigate } from "react-router-dom"
import { Trash2, Pin, Lock } from "lucide-react"
import type { INote } from "../types"

interface NoteCardProps {
  note: INote
  onTogglePin?: (noteId: string) => void // 👈 optional prop added
}

export default function NoteCard({ note }: NoteCardProps) {
  const navigate = useNavigate()

  const handleClick = () => {
    // if note has PIN enabled, ask for PIN before navigating
    if (note.pinEnabled) {
      const enteredPin = prompt("Enter PIN to unlock this note:")
      if (enteredPin !== note.pinCode) {
        alert("Incorrect PIN! Access denied.")
        return
      }
    }

    navigate(`/notes/${note._id}`)
  }

  const preview = note.content.replace(/<[^>]*>/g, "").substring(0, 120)

  return (
    <div
      onClick={handleClick}
      className="relative group bg-gradient-to-br from-white to-amber-50 border border-gray-200 hover:border-amber-300 rounded-2xl p-5 cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300"
    >
      {/* Lock overlay when PIN enabled */}
      {note.pinEnabled && (
        <div className="absolute inset-0 bg-gray-100/80 flex items-center justify-center rounded-2xl z-10">
          <Lock className="text-gray-500" size={28} />
        </div>
      )}

      {/* Pin Button */}
      <button
        className={`absolute top-3 right-3 p-2 rounded-full bg-white shadow-sm text-gray-400 hover:text-amber-600 hover:shadow-md opacity-0 group-hover:opacity-100 transition-all z-20`}
        onClick={(e) => e.stopPropagation()}
      >
        <Pin size={16} />
      </button>

      {/* Title */}
      <h3 className="text-lg font-semibold font-serif text-gray-900 mb-2 group-hover:text-amber-800 transition-colors leading-tight">
        {note.title || "Untitled Note"}
      </h3>

      {/* Preview Text */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
        {preview || "No content yet..."}
      </p>

      {/* Tags and Date */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {note.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="text-xs font-medium bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
          {note.tags.length > 2 && (
            <span className="text-xs text-gray-500 px-2.5 py-1">
              +{note.tags.length - 2}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span>{new Date(note.updatedAt).toLocaleDateString()}</span>

          {/* Trash Button */}
              <button
        onClick={(e) => {
          e.stopPropagation()
          onTogglePin?.(note._id)
        }}
        className="absolute top-3 right-3 p-2 rounded-full bg-white shadow-sm text-gray-400 hover:text-amber-600 hover:shadow-md opacity-0 group-hover:opacity-100 transition-all z-20"
      >
        <Pin size={16} />
      </button>

        </div>
      </div>
    </div>
  )
}
