

// src/pages/NotesPage.tsx
"use client"

import { useState, useMemo } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import TopBar from "../components/TopBar"
import NoteCard from "../components/NoteCard"
import HelpNoteCard from "../components/HelpNoteCard"
import { useApi } from "../hooks/useApi"
import type { INote } from "../types"
import { HELP_NOTES } from "../utils/help-notes"
import PinModal from "../components/PinModal"

export default function NotesPage() {
  const { request } = useApi()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [searchTerm, setSearchTerm] = useState("")
  const [activeSection, setActiveSection] = useState("all")

  // modal states
  const [showSetPinModal, setShowSetPinModal] = useState(false)
  const [showEnterPinModal, setShowEnterPinModal] = useState(false)
  const [activeNoteForPin, setActiveNoteForPin] = useState<string | null>(null)
  const [pinMode, setPinMode] = useState<"set" | "enter">("enter")

  // --- Query: fetch notes depending on section/tag ---
  const { data: notesRaw = [], isLoading } = useQuery({
    queryKey: ["notes", activeSection],
    queryFn: async () => {
      let url = "/notes"
      if (activeSection === "pinned") url += "?pinned=true"
      else if (activeSection === "archive") url += "?archived=true"
      else if (activeSection === "trash") url += "?trashed=true"
      else if (activeSection?.startsWith("tag:")) {
        const tag = activeSection.split(":")[1]
        url += `?tags=${encodeURIComponent(tag)}`
      }
      const res = await request(url)
      return res.notes || []
    },
    keepPreviousData: true,
    staleTime: 1000 * 30, // 30s
  })

  // --- Mutations ---

  // toggle pinned with optimistic update
  const togglePin = useMutation({
    mutationFn: (id: string) => request(`/notes/${id}/pin`, { method: "PATCH" }),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ["notes", activeSection] })
      const previous = queryClient.getQueryData<INote[]>(["notes", activeSection])

      queryClient.setQueryData<INote[] | undefined>(["notes", activeSection], (old) =>
        old?.map((n) => (n._id === id ? { ...n, pinned: !n.pinned } : n))
      )

      return { previous }
    },
    onError: (err, _variables, context: any) => {
      if (context?.previous) queryClient.setQueryData(["notes", activeSection], context.previous)
      alert("Failed to toggle pin")
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notes", activeSection] })
    },
  })

  // set/remove lock (server stores hashed PIN)
  const lockNote = useMutation({
    mutationFn: ({ id, enable, pinCode }: { id: string; enable: boolean; pinCode?: string }) =>
      request(`/notes/${id}/lock`, {
        method: "PATCH",
        body: JSON.stringify({ enable, pinCode }),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes", activeSection] }),
    onError: () => alert("Failed to update lock"),
  })

  // unlock (verify PIN)
// unlock (verify PIN)
const unlockNote = useMutation({
  mutationFn: async ({ id, pinCode }: { id: string; pinCode: string }) => {
    const res = await request(`/notes/${id}/unlock`, {
      method: "POST",
      body: JSON.stringify({ pinCode }),
    });
    return res.note;
  },
  onMutate: async (vars) => {
    await queryClient.cancelQueries({ queryKey: ["notes", activeSection] });
    const previous = queryClient.getQueryData<INote[]>(["notes", activeSection]);

    // Optimistically mark note as unlocked
    queryClient.setQueryData<INote[] | undefined>(["notes", activeSection], (old) =>
      old?.map((n) =>
        n._id === vars.id ? { ...n, pinEnabled: false } : n
      )
    );

    return { previous };
  },
  onError: (err, _vars, context: any) => {
    if (context?.previous)
      queryClient.setQueryData(["notes", activeSection], context.previous);
    alert("Incorrect PIN");
  },
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ["notes", activeSection] });
  },
});


  // soft delete (move to trash)
  const deleteNote = useMutation({
    mutationFn: (id: string) => request(`/notes/${id}`, { method: "DELETE" }),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ["notes", activeSection] })
      const previous = queryClient.getQueryData<INote[]>(["notes", activeSection])
      queryClient.setQueryData<INote[] | undefined>(["notes", activeSection], (old) =>
        old?.filter((n) => n._id !== id)
      )
      return { previous }
    },
    onError: (err, _vars, context: any) => {
      if (context?.previous) queryClient.setQueryData(["notes", activeSection], context.previous)
      alert("Failed to delete note")
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["notes", activeSection] }),
  })

  // permanent delete (from trash)
  const permanentDelete = useMutation({
    mutationFn: (id: string) => request(`/notes/${id}/permanent`, { method: "DELETE" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes", activeSection] }),
    onError: () => alert("Failed to permanently delete"),
  })

  // restore from trash
  const restoreNote = useMutation({
    mutationFn: (id: string) => request(`/notes/${id}/restore`, { method: "POST" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes", activeSection] }),
    onError: () => alert("Failed to restore note"),
  })

  // --- Tag / search filtering on the client side (after server returns matching set) ---
  const filteredNotes = useMemo(() => {
    const normalized = Array.isArray(notesRaw) ? (notesRaw as INote[]) : []
    const bySearch = normalized.filter((note) => {
      const q = searchTerm.trim().toLowerCase()
      if (!q) return true
      const inTitle = (note.title || "").toLowerCase().includes(q)
      const inTags = (note.tags || []).some((t) => t.toLowerCase().includes(q))
      const inPlain = (note.plainText || "").toLowerCase().includes(q)
      return inTitle || inTags || inPlain
    })

    // pinned show first (stable)
    bySearch.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0))
    return bySearch
  }, [notesRaw, searchTerm])

  // --- Handlers to open modals (parent controls PinModal) ---
  const openSetPinModal = (noteId: string) => {
    setActiveNoteForPin(noteId)
    setPinMode("set")
    setShowSetPinModal(true)
  }

  const openEnterPinModal = (noteId: string) => {
    setActiveNoteForPin(noteId)
    setPinMode("enter")
    setShowEnterPinModal(true)
  }

  const handleSetPinSubmit = async (pin: string) => {
    if (!activeNoteForPin) return
    try {
      await lockNote.mutateAsync({ id: activeNoteForPin, enable: true, pinCode: pin })
    } catch (err) {
      // lockNote onError will show alert
    } finally {
      setShowSetPinModal(false)
      setActiveNoteForPin(null)
    }
  }



  const handleUnlockSubmit = async (pin: string) => {
  if (!activeNoteForPin) return;
  try {
    await unlockNote.mutateAsync({ id: activeNoteForPin, pinCode: pin });

    // Optional: navigate to note after successful unlock
    navigate(`/notes/${activeNoteForPin}`);
  } catch (err) {
    // Error handled in mutation onError
  } finally {
    setShowEnterPinModal(false);
    setActiveNoteForPin(null);
  }
};


  // --- Render ---
  return (
    <div className="flex h-screen bg-gradient-to-br from-amber-50 via-white to-gray-50">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

        <main className="flex-1 overflow-y-auto px-6 md:px-10 py-10 relative">
          <div className="max-w-6xl mx-auto">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-[70vh]">
                <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-gray-500 text-lg">Loading your notes...</p>
              </div>
            ) : filteredNotes.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-xl font-medium text-gray-700">No notes found</p>
                <p className="text-gray-500 mt-1 text-sm">Try searching for a different keyword or tag.</p>
              </div>
            ) : (
              <div className="animate-fade-in">
                <header className="mb-10">
                  <h1 className="text-3xl font-serif font-bold text-gray-900 capitalize">{activeSection} Notes</h1>
                  <p className="text-gray-500 text-sm mt-1">
                    {filteredNotes.length} {filteredNotes.length === 1 ? "note" : "notes"}
                  </p>
                </header>

                {activeSection === "all" && (
                  <section className="mb-12">
                    <h3 className="text-gray-800 font-serif font-semibold mb-3">Helpful Tips</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
                      {HELP_NOTES.map((helpNote, index) => (
                        <HelpNoteCard key={index} {...helpNote} />
                      ))}
                    </div>
                    <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-8" />
                  </section>
                )}

                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredNotes.map((note: INote) => (
                    <NoteCard
                      key={note._id}
                      note={note}
                      onTogglePin={(id) => togglePin.mutate(id)}
                      onDelete={(id) => deleteNote.mutate(id)}
                      onLockOpen={(id, mode) => {
                        // mode: "set" or "enter" (we only handle "set" and "enter")
                        if (mode === "set") openSetPinModal(id)
                        else openEnterPinModal(id)
                      }}
                      onRestore={(id) => restoreNote.mutate(id)}
                      onPermanentDelete={(id) => permanentDelete.mutate(id)}
                    />
                  ))}
                </section>
              </div>
            )}
          </div>

          {/* Floating Add Button */}
          <button
            onClick={() => navigate("/notes/new")}
            className="fixed bottom-8 right-8 bg-amber-600 hover:bg-amber-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-105"
            title="New note"
          >
            +
          </button>
        </main>

        {/* PIN Modals */}
        <PinModal
          open={showSetPinModal}
          mode="set"
          onClose={() => {
            setShowSetPinModal(false)
            setActiveNoteForPin(null)
          }}
          onSubmit={handleSetPinSubmit}
        />

        <PinModal
          open={showEnterPinModal}
          mode="enter"
          onClose={() => {
            setShowEnterPinModal(false)
            setActiveNoteForPin(null)
          }}
          onSubmit={handleUnlockSubmit}
        />
      </div>
    </div>
  )
}
