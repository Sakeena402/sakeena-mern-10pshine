"use client"

import { useAuth } from "../context/AuthContext"

export const useApi = () => {
  const { accessToken } = useAuth()

  const request = async (url: string, options: RequestInit = {}) => {
    const headers = new Headers(options.headers as HeadersInit)
    headers.set("Content-Type", "application/json")

    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`)
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL}${url}`, {
      ...options,
      headers,
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`)
    }

    return response.json()
  }

  return { request }
}
