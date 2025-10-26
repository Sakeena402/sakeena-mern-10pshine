"use client"

import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import Button from "./Button"

export default function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <header className="bg-color-surface border-b border-color-border">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-color-primary">Notes</h1>
          <p className="text-sm text-color-text-light">Welcome, {user?.name}</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </header>
  )
}
