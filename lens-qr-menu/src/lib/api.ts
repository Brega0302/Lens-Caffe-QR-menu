// API client - Centralized HTTP requests to backend
import { io, type Socket } from "socket.io-client"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api"
const SOCKET_URL = import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:3001"

// Socket.IO instance for real-time updates
let socket: Socket | null = null

export function getSocket(): Socket {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
    })
  }
  return socket
}

// Get auth token from localStorage
function getAuthToken(): string | null {
  return localStorage.getItem("auth_token")
}

// Helper function for API requests
async function apiRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
  const token = getAuthToken()

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Request failed" }))
    throw new Error(error.error || "Request failed")
  }

  return response.json()
}

// Auth API
export const authAPI = {
  login: (username: string, password: string) =>
    apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }),

  getCurrentUser: () => apiRequest("/auth/me"),
}

// Products API
export const productsAPI = {
  getAll: () => apiRequest("/products"),

  getById: (id: number) => apiRequest(`/products/${id}`),

  create: (product: any) =>
    apiRequest("/products", {
      method: "POST",
      body: JSON.stringify(product),
    }),

  update: (id: number, product: any) =>
    apiRequest(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(product),
    }),

  updateStock: (id: number, inStock: boolean) =>
    apiRequest(`/products/${id}/stock`, {
      method: "PATCH",
      body: JSON.stringify({ in_stock: inStock }),
    }),

  delete: (id: number) =>
    apiRequest(`/products/${id}`, {
      method: "DELETE",
    }),
}

// Orders API
export const ordersAPI = {
  getAll: (status?: string) => {
    const query = status ? `?status=${status}` : ""
    return apiRequest(`/orders${query}`)
  },

  create: (order: any) =>
    apiRequest("/orders", {
      method: "POST",
      body: JSON.stringify(order),
    }),

  updateStatus: (id: number, status: string) =>
    apiRequest(`/orders/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
}

// Analytics API
export const analyticsAPI = {
  get: (period?: string, startDate?: string, endDate?: string) => {
    const params = new URLSearchParams()
    if (period) params.append("period", period)
    if (startDate) params.append("start_date", startDate)
    if (endDate) params.append("end_date", endDate)

    const query = params.toString() ? `?${params}` : ""
    return apiRequest(`/analytics${query}`)
  },

  getAverages: () => apiRequest("/analytics/averages"),
}
