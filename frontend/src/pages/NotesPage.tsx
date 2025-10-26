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

  const { data: notes = [], isLoading } = useQuery({
    queryKey: ["notes"],
    queryFn: () => request("/notes"),
  })

  const filteredNotes = notes.filter(
    (note: INote) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="px-8 py-8">
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Loading notes...</p>
              </div>
            ) : filteredNotes.length === 0 && activeSection === "all" ? (
              <div className="text-center py-16">
                <div className="mb-4">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <p className="text-gray-600 font-medium mb-2">No notes yet</p>
                <p className="text-gray-500 text-sm">Create your first note to get started</p>
              </div>
            ) : filteredNotes.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-600 font-medium">No notes found</p>
              </div>
            ) : (
              <div>
                <div className="mb-6">
                  <h2 className="text-gray-900 font-serif text-lg font-semibold">
                    {activeSection === "all" && "All Notes"}
                    {activeSection === "pinned" && "Pinned Notes"}
                    {activeSection === "archive" && "Archived Notes"}
                    {activeSection === "trash" && "Trash"}
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">{filteredNotes.length} notes</p>
                </div>

                {activeSection === "all" && filteredNotes.length > 0 && (
                  <div className="mb-12">
                    <h3 className="text-gray-900 font-serif text-sm font-semibold uppercase tracking-wide mb-4">
                      Help & Tips
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                      {HELP_NOTES.map((helpNote, index) => (
                        <HelpNoteCard
                          key={index}
                          type={helpNote.type}
                          title={helpNote.title}
                          description={helpNote.description}
                        />
                      ))}
                    </div>
                    <hr className="border-gray-200 my-8" />
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredNotes.map((note: INote) => (
                    <NoteCard key={note._id} note={note} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
