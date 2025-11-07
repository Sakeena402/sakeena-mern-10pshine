"use client"

import { Lightbulb, BookOpen, Keyboard } from "lucide-react"

interface HelpNoteCardProps {
  type: "tip" | "tutorial" | "shortcut"
  title: string
  description: string
}

export default function HelpNoteCard({ type, title, description }: HelpNoteCardProps) {
  const getIcon = () => {
    switch (type) {
      case "tip":
        return <Lightbulb size={24} className="text-amber-600" />
      case "tutorial":
        return <BookOpen size={24} className="text-amber-600" />
      case "shortcut":
        return <Keyboard size={24} className="text-amber-600" />
    }
  }

  const getBgColor = () => {
    switch (type) {
      case "tip":
        return "bg-amber-50 border-amber-200"
      case "tutorial":
        return "bg-blue-50 border-blue-200"
      case "shortcut":
        return "bg-purple-50 border-purple-200"
    }
  }

  const getTextColor = () => {
    switch (type) {
      case "tip":
        return "text-amber-900"
      case "tutorial":
        return "text-blue-900"
      case "shortcut":
        return "text-purple-900"
    }
  }

  return (
    <div className={`rounded-xl border-2 p-6 ${getBgColor()} cursor-pointer hover:shadow-md transition-shadow`}>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 mt-1">{getIcon()}</div>
        <div className="flex-1 min-w-0">
          <h3 className={`font-serif font-bold text-lg ${getTextColor()} mb-2`}>{title}</h3>
          <p className={`text-sm ${getTextColor()} opacity-90 leading-relaxed`}>{description}</p>
        </div>
      </div>
    </div>
  )
}
