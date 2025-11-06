"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  email: string
  name: string
}

interface AuthContextType {
  user: User | null
   accessToken: string | null
  setAccessToken: (token: string | null) => void
  refreshAccessToken: () => Promise<string | null>
  fetchWithAuth: (url: string, options?: RequestInit) => Promise<Response>
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (username: string,email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
    const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem("accessToken")
  )
  const [isLoading, setIsLoading] = useState(true)

  // Load from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken")
    const storedUser = localStorage.getItem("user")
    if (storedToken && storedUser) {
      setAccessToken(storedToken)
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

const login = async (email: string, password: string) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    setAccessToken(data.accessToken);
    setUser(data.user);
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("user", JSON.stringify(data.user));
  } catch (error: any) {
    console.error("Login error:", error.message);
    throw new Error(error.message || "Login failed");
  }
};

const signup = async (username: string, email: string, password: string) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Signup failed");
    }

    setAccessToken(data.accessToken);
    setUser(data.user);
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("user", JSON.stringify(data.user));
  } catch (error: any) {
    console.error("Signup error:", error.message);
    throw new Error(error.message || "Signup failed");
  }
};


  const logout = () => {
    setUser(null)
    setAccessToken(null)
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    localStorage.removeItem("user")
  }

 const refreshAccessToken = async (): Promise<string | null> => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include",
      })

      if (!res.ok) throw new Error("Failed to refresh token")

      const data = await res.json()
      localStorage.setItem("accessToken", data.accessToken)
      setAccessToken(data.accessToken)
      return data.accessToken
    } catch (err) {
      console.error("Token refresh failed:", err)
      setAccessToken(null)
      localStorage.removeItem("accessToken")
      return null
    }
  }

  // ✅ Auto refresh token every 14 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      refreshAccessToken()
    }, 14 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  // ✅ Fetch wrapper with auto refresh
  const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem("accessToken")

    let res = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: token ? `Bearer ${token}` : "",
      },
      credentials: "include",
    })

    if (res.status === 401) {
      const newToken = await refreshAccessToken()
      if (newToken) {
        res = await fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            Authorization: `Bearer ${newToken}`,
          },
          credentials: "include",
        })
      }
    }

    return res
  }

  return (
    <AuthContext.Provider value={{ user, accessToken, setAccessToken, refreshAccessToken, fetchWithAuth, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within AuthProvider")
  return context
}
