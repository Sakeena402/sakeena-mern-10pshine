"use client"

import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import Button from "./Button"
import { FileText, Star, Archive, Trash2, Tag, Settings, LogOut, User } from "lucide-react"

interface SidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

export default function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const handleCreateNote = () => {
    navigate("/notes/new")
  }

  const handleProfileClick = () => {
    navigate("/profile")
  }

  const sections = [
    { id: "all", label: "All Notes", icon: FileText },
    { id: "pinned", label: "Pinned", icon: Star },
    { id: "archive", label: "Archive", icon: Archive },
    { id: "trash", label: "Trash", icon: Trash2 },
  ]

  const tags = ["Work", "Personal"]
  const defaultAvatar =
    "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
  return (
    <aside className="w-72 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-serif font-bold text-amber-900 mb-4">Notes</h1>
        <Button
          onClick={handleCreateNote}
          className="w-full bg-amber-700 hover:bg-amber-800 text-white font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <span className="text-lg">+</span> New Note
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {sections.map((section) => {
          const Icon = section.icon
          return (
            <button
              key={section.id}
              onClick={() => onSectionChange(section.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeSection === section.id ? "bg-amber-50 text-amber-900" : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{section.label}</span>
            </button>
          )
        })}
      </nav>

      {/* Tags Section */}
      <div className="px-4 py-4 border-t border-gray-200">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Tags</h3>
        <div className="space-y-2">
          {tags.map((tag) => (
            <button
              key={tag}
              className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-sm"
            >
              <Tag size={16} />
              <span>{tag}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 space-y-2">
  <button
    onClick={handleProfileClick}
    className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-sm"
  >
    <User size={18} />
    <span>Profile</span>
  </button>

  <button className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-sm">
    <Settings size={18} />
    <span>Settings</span>
  </button>

  <button
    onClick={handleLogout}
    className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors text-sm"
  >
    <LogOut size={18} />
    <span>Logout</span>
  </button>

  {/* User Info Card */}
  <div className="flex items-center gap-3 px-4 py-3 bg-amber-50 rounded-lg mt-2 shadow-sm">
    <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-amber-600 flex-shrink-0">
      <img
        src={user?.name || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
        alt="User avatar"
        className="w-full h-full object-cover"
      />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-gray-900 truncate">
        {user?.name || "Guest User"}
      </p>
      <p className="text-xs text-gray-500 truncate">
        {user?.email || "No email"}
      </p>
    </div>
  </div>
</div>

    </aside>
  )
}
