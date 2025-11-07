// "use client"

// import type React from "react"
// import { useState } from "react"
// import { useNavigate, Link } from "react-router-dom"
// import { useAuth } from "../context/AuthContext"
// import Button from "../components/Button"
// import Input from "../components/Input"

// export default function LoginPage() {
//   const [email, setEmail] = useState("")
//   const [password, setPassword] = useState("")
//   const [error, setError] = useState("")
//   const [isLoading, setIsLoading] = useState(false)
//   const { login } = useAuth()
//   const navigate = useNavigate()

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setError("")
//     setIsLoading(true)

//     try {
//       await login(email, password)
//       navigate("/notes")
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Login failed")
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-amber-50 to-white flex items-center justify-center px-4">
//       <div className="w-full max-w-md">
//         <div className="text-center mb-8">
//           <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-700 rounded-full mb-4">
//             <span className="text-2xl font-serif font-bold text-white">N</span>
//           </div>
//           <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">Notes</h1>
//           <p className="text-gray-600">Sign in to your account</p>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           {error && (
//             <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
//           )}

//           <Input
//             label="Email"
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             placeholder="you@example.com"
//             required
//           />

//           <Input
//             label="Password"
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             placeholder="••••••••"
//             required
//           />

//           <Button type="submit" variant="primary" size="lg" isLoading={isLoading} className="w-full">
//             Sign In
//           </Button>
//         </form>

//         <p className="text-center text-gray-600 text-sm mt-6">
//           Don't have an account?{" "}
//           <Link to="/signup" className="text-amber-700 hover:text-amber-800 font-semibold">
//             Sign up
//           </Link>
//         </p>
//       </div>
//     </div>
//   )
// }
"use client"

import React, { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import Button from "../components/Button"
import Input from "../components/Input"
import { LockKeyhole } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)
    try {
      await login(email, password)
      navigate("/notes")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-100 flex items-center justify-center px-4">
      <div className="relative w-full max-w-md bg-white/70 backdrop-blur-md rounded-3xl border border-amber-100 shadow-xl p-8 md:p-10">
        {/* Decorative Glow */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-200/40 rounded-full blur-3xl"></div>

        {/* Header */}
        <div className="relative text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-600 to-amber-700 rounded-2xl shadow-md mb-4">
            <LockKeyhole className="text-white" size={28} />
          </div>
          <h1 className="text-4xl font-serif font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-600 mt-1">Sign in to continue your notes journey ✍️</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm shadow-sm">
              {error}
            </div>
          )}

          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="rounded-xl border-gray-200 focus:ring-amber-500"
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="rounded-xl border-gray-200 focus:ring-amber-500"
          />

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-gray-600">
              <input type="checkbox" className="accent-amber-600 rounded" />
              Remember me
            </label>
            <Link
              to="/forgot-password"
              className="text-amber-700 hover:text-amber-800 font-medium transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all"
          >
            Sign In
          </Button>
        </form>

        {/* Footer */}
        <p className="text-center text-gray-600 text-sm mt-6">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-amber-700 hover:text-amber-800 font-semibold transition-colors"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}
