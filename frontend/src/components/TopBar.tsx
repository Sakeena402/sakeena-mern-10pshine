// "use client"

// import { Search, Settings } from "lucide-react"

// interface TopBarProps {
//   searchTerm: string
//   onSearchChange: (term: string) => void
// }

// export default function TopBar({ searchTerm, onSearchChange }: TopBarProps) {
//   return (
//     <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
//       <div className="px-8 py-4 flex items-center justify-between gap-4">
//         <div className="flex-1 max-w-md">
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
//             <input
//               type="text"
//               placeholder="Search notes... ⌘K"
//               value={searchTerm}
//               onChange={(e) => onSearchChange(e.target.value)}
//               className="w-full bg-gray-100 border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-colors"
//             />
//           </div>
//         </div>
//         <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600">
//           <Settings size={20} />
//         </button>
//       </div>
//     </div>
//   )
// }
"use client"

import { useState, useRef, useEffect } from "react"
import { Search, Settings, LogOut, User } from "lucide-react"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"

interface TopBarProps {
  searchTerm: string
  onSearchChange: (term: string) => void
}

export default function TopBar({ searchTerm, onSearchChange }: TopBarProps) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)

  const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const handleProfile = () => {
    navigate("/profile")
  }

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-amber-100 sticky top-0 z-20 shadow-sm">
      <div className="px-6 py-3 flex items-center justify-between gap-4">
        {/* 🔍 Search Bar */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search notes... ⌘K"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-amber-50 border border-amber-100 rounded-lg pl-10 pr-4 py-2.5 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* ⚙️ Settings + Profile */}
        <div className="flex items-center gap-3 relative" ref={menuRef}>
          <button className="p-2 hover:bg-amber-100 rounded-lg transition-colors text-amber-700">
            <Settings size={20} />
          </button>

          {/* Avatar Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="relative flex items-center gap-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-full px-2.5 py-1 transition-all shadow-sm"
          >
            <img
              src={user?.avatar || defaultAvatar}
              alt="User avatar"
              className="w-8 h-8 rounded-full object-cover border-2 border-amber-500"
            />
            <span className="font-medium text-gray-800 hidden sm:block">
              {user?.name || "Guest"}
            </span>
          </button>

          {/* Dropdown Menu */}
          {menuOpen && (
            <div className="absolute right-0 top-12 w-48 bg-white shadow-lg rounded-xl border border-amber-100 py-2 animate-fadeIn z-30">
              <button
                onClick={handleProfile}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-amber-50 transition-all"
              >
                <User size={16} />
                <span>Profile</span>
              </button>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-all"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Animation Keyframes */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </header>
  )
}
