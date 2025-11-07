"use client"

import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import Sidebar from "../components/Sidebar"
import TopBar from "../components/TopBar"
import Button from "../components/Button"
import { ArrowLeft, Mail, User, Calendar, Shield } from "lucide-react"

export default function ProfilePage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = React.useState("")

  const joinDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
    const defaultAvatar =
    "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"

  return (
    <div className="flex h-screen bg-gray-50  ">
      <Sidebar activeSection="profile" onSectionChange={() => {}} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="px-8 py-8 max-w-2xl">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <button onClick={() => navigate("/notes")} className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                <ArrowLeft size={24} className="text-gray-700" />
              </button>
              <h1 className="text-3xl font-serif font-bold text-gray-900">Profile</h1>
            </div>

             {/* Profile Card */}
            <div className="bg-white/80  backdrop-blur-sm rounded-2xl shadow-lg border border-amber-100 p-8 mb-10">
              {/* Avatar */}
              <div className="flex justify-center mb-8">
                <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-amber-400 shadow-md">
                  <img
                    src={defaultAvatar}
                    alt="Profile Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* User Info */}
              <div className="space-y-6">
                {/* Name */}
                <div className="border-b border-gray-200 pb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <User size={20} className="text-amber-700" />
                    <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                      Full Name
                    </label>
                  </div>
                  <p className="text-lg text-gray-900 font-medium ml-8">
                    {user?.name || "No name available"}
                  </p>
                </div>

                {/* Email */}
                <div className="border-b border-gray-200 pb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Mail size={20} className="text-amber-700" />
                    <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                      Email Address
                    </label>
                  </div>
                  <p className="text-lg text-gray-900 font-medium ml-8">
                    {user?.email || "No email available"}
                  </p>
                </div>

                {/* User ID */}
                <div className="border-b border-gray-200 pb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Shield size={20} className="text-amber-700" />
                    <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                      User ID
                    </label>
                  </div>
                  <p className="text-sm font-mono text-gray-700 ml-8">
                    {user?.id || "N/A"}
                  </p>
                </div>

                {/* Join Date */}
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar size={20} className="text-amber-700" />
                    <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                      Member Since
                    </label>
                  </div>
                  <p className="text-lg text-gray-900 font-medium ml-8">
                    {joinDate}
                  </p>
                </div>
              </div>
            </div>

            {/* Account Settings */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-8">
              <h2 className="text-xl font-serif font-bold text-gray-900 mb-6">
                Account Settings
              </h2>
              <div className="space-y-4">
                <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium py-2.5 rounded-lg transition-colors shadow-md">
                  Change Password
                </Button>
                <Button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2.5 rounded-lg transition-colors shadow-md">
                  Notification Preferences
                </Button>
                <Button className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2.5 rounded-lg transition-colors shadow-md">
                  Delete Account
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
import React from "react"
