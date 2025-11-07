// "use client"

// import { useAuth } from "../context/AuthContext"

// export const useApi = () => {
//   const { accessToken } = useAuth() 

//   const request = async (url: string, options: RequestInit = {}) => {
//     const headers = new Headers(options.headers as HeadersInit)
//     headers.set("Content-Type", "application/json")

//     if (accessToken) {
//       headers.set("Authorization", `Bearer ${accessToken}`)
//     }

//     const response = await fetch(`${import.meta.env.VITE_API_URL}${url}`, {
//       ...options,
//       headers,
//     })

//     if (!response.ok) {
//   const errText = await response.text()
//   console.error("API Error:", errText)
//   throw new Error(`API error: ${response.status} ${response.statusText}`)
// }


//     return response.json()
//   }

//   return { request }
// }
"use client";
import { useAuth } from "../context/AuthContext";

export const useApi = () => {
  const { fetchWithAuth } = useAuth();

  const request = async (url: string, options: RequestInit = {}) => {
    const fullUrl = `${import.meta.env.VITE_API_URL}${url}`;
    const res = await fetchWithAuth(fullUrl, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`API error: ${res.status} - ${text}`);
    }

    return res.json();
  };

  return { request };
};
