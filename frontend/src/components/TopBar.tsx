"use client"

import { Search, Settings } from "lucide-react"

interface TopBarProps {
  searchTerm: string
  onSearchChange: (term: string) => void
}

export default function TopBar({ searchTerm, onSearchChange }: TopBarProps) {
  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="px-8 py-4 flex items-center justify-between gap-4">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search notes... ⌘K"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-gray-100 border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-colors"
            />
          </div>
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600">
          <Settings size={20} />
        </button>
      </div>
    </div>
  )
}
