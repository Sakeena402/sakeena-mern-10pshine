// "use client"

// import { useState } from "react"
// import { useQuery } from "@tanstack/react-query"
// import { useNavigate } from "react-router-dom"
// import Sidebar from "../components/Sidebar"
// import TopBar from "../components/TopBar"
// import NoteCard from "../components/NoteCard"
// import HelpNoteCard from "../components/HelpNoteCard"
// import { useApi } from "../hooks/useApi"

// import type { INote } from "../types"
// import { HELP_NOTES } from "../utils/help-notes"

// export default function NotesPage() {
//   const { request } = useApi()
//   const navigate = useNavigate()
//   const [searchTerm, setSearchTerm] = useState("")
//   const [activeSection, setActiveSection] = useState("all")

//   const { data: notes = [], isLoading } = useQuery({
//     queryKey: ["notes"],
//     queryFn: () => request("/notes"),
//   })

//   const filteredNotes = notes.filter(
//     (note: INote) =>
//       note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       note.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
//   )

//   return (
//     <div className="flex h-screen bg-gray-50">
//       <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col overflow-hidden">
//         <TopBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

//         {/* Content Area */}
//         <main className="flex-1 overflow-y-auto">
//           <div className="px-8 py-8">
//             {isLoading ? (
//               <div className="text-center py-12">
//                 <p className="text-gray-500">Loading notes...</p>
//               </div>
//             ) : filteredNotes.length === 0 && activeSection === "all" ? (
//               <div className="text-center py-16">
//                 <div className="mb-4">
//                   <svg
//                     className="mx-auto h-12 w-12 text-gray-400"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//                     />
//                   </svg>
//                 </div>
//                 <p className="text-gray-600 font-medium mb-2">No notes yet</p>
//                 <p className="text-gray-500 text-sm">Create your first note to get started</p>
//               </div>
//             ) : filteredNotes.length === 0 ? (
//               <div className="text-center py-16">
//                 <p className="text-gray-600 font-medium">No notes found</p>
//               </div>
//             ) : (
//               <div>
//                 <div className="mb-6">
//                   <h2 className="text-gray-900 font-serif text-lg font-semibold">
//                     {activeSection === "all" && "All Notes"}
//                     {activeSection === "pinned" && "Pinned Notes"}
//                     {activeSection === "archive" && "Archived Notes"}
//                     {activeSection === "trash" && "Trash"}
//                   </h2>
//                   <p className="text-gray-500 text-sm mt-1">{filteredNotes.length} notes</p>
//                 </div>

//                 {activeSection === "all" && filteredNotes.length > 0 && (
//                   <div className="mb-12">
//                     <h3 className="text-gray-900 font-serif text-sm font-semibold uppercase tracking-wide mb-4">
//                       Help & Tips
//                     </h3>
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
//                       {HELP_NOTES.map((helpNote, index) => (
//                         <HelpNoteCard
//                           key={index}
//                           type={helpNote.type}
//                           title={helpNote.title}
//                           description={helpNote.description}
//                         />
//                       ))}
//                     </div>
//                     <hr className="border-gray-200 my-8" />
//                   </div>
//                 )}

//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                   {filteredNotes.map((note: INote) => (
//                     <NoteCard key={note._id} note={note} />
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         </main>
//       </div>
//     </div>
//   )
// }
"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import TopBar from "../components/TopBar"
import NoteCard from "../components/NoteCard"
import HelpNoteCard from "../components/HelpNoteCard"
import { useApi } from "../hooks/useApi"
import type { INote } from "../types"
import { HELP_NOTES } from "../utils/help-notes"

export default function NotesPage() {
  const { request } = useApi()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("")
  const [activeSection, setActiveSection] = useState("all")
 
 // const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // const { data: notes = [], isLoading } = useQuery({
  //   queryKey: ["notes"],
  //  queryFn: async () => {
  //   const res = await request("/notes")
  //   console.log("🧩 Notes API response:", res)
  //   return res
  // },
  // })
const { data: notes = [], isLoading, error } = useQuery({
  queryKey: ["notes", activeSection], // 👈 add activeSection to refetch when tag changes
  queryFn: async () => {
    // 🧩 Build URL dynamically based on active section
    let url = "/notes";

    if (activeSection.startsWith("tag:")) {
      const tag = activeSection.replace("tag:", "");
      url += `?tags=${tag}`;
    } else if (activeSection === "pinned") {
      url += "?pinned=true";
    } else if (activeSection === "archive") {
      url += "?archived=true";
    } else if (activeSection === "trash") {
      url += "?trashed=true";
    }

    // ✅ Fetch from API
    const res = await request(url);
    console.log("🧩 Notes API response:", res);

    return res.notes; // return array of notes
  },
});

const filteredNotes = Array.isArray(notes)
  ? notes.filter(
    (note: INote) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  )
  : []

  

  const handleTogglePin = async (noteId: string) => {
  const pin = prompt("Enter 4-digit PIN")
  if (pin) {
    await request(`/notes/${noteId}/pin`, {
      method: "PATCH",
      body: JSON.stringify({ pinCode: pin, enable: true }),
    })
    alert("PIN applied successfully!")
  }
}



  return (
    <div className="flex h-screen bg-gradient-to-br from-amber-50 via-white to-gray-50">
      {/* Sidebar */}
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        // collapsed={sidebarCollapsed}
       // onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

        <main className="flex-1 overflow-y-auto px-6 md:px-10 py-10 relative">
          <div className="max-w-6xl mx-auto">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-[70vh]">
                <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-gray-500 text-lg">Loading your notes...</p>
              </div>
            ) : filteredNotes.length === 0 && activeSection === "all" ? (
              <div className="text-center py-20">
                <div className="bg-amber-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                  <svg
                    className="h-10 w-10 text-amber-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">No Notes Yet</h2>
                <p className="text-gray-500">
                  Create your first note and start organizing your thoughts beautifully.
                </p>
              </div>
            ) : filteredNotes.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-xl font-medium text-gray-700">No notes found</p>
                <p className="text-gray-500 mt-1 text-sm">
                  Try searching for a different keyword or tag.
                </p>
              </div>
            ) : (
              <div className="animate-fade-in">
                <header className="mb-10">
                  <h1 className="text-3xl font-serif font-bold text-gray-900">
                    {activeSection === "all" && "All Notes"}
                    {activeSection === "pinned" && "Pinned Notes"}
                    {activeSection === "archive" && "Archived Notes"}
                    {activeSection === "trash" && "Trash"}
                  </h1>
                  <p className="text-gray-500 text-sm mt-1">
                    {filteredNotes.length} {filteredNotes.length === 1 ? "note" : "notes"}
                  </p>
                </header>

                {activeSection === "all" && (
                  <section className="mb-12">
                    <h3 className="text-gray-800 font-serif font-semibold mb-3">Helpful Tips</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
                      {HELP_NOTES.map((helpNote, index) => (
                        <HelpNoteCard
                          key={index}
                          type={helpNote.type}
                          title={helpNote.title}
                          description={helpNote.description}
                        />
                      ))}
                    </div>
                    <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-8" />
                  </section>
                )}

                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredNotes.map((note: INote) => (
                  <NoteCard key={note._id} note={note} onTogglePin={handleTogglePin} />

                  ))}
                </section>
              </div>
            )}
          </div>

          {/* Floating New Note Button */}
          <button
            onClick={() => navigate("/notes/new")}
            className="fixed bottom-8 right-8 bg-amber-600 hover:bg-amber-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-105"
          >
            +
          </button>
        </main>
      </div>
    </div>
  )
}
