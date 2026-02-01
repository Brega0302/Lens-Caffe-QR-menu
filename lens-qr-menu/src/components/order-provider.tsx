"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { io, type Socket } from "socket.io-client"

export interface Order {
  id: string
  tableNumber: string
  items: Array<{
    id: number
    name: string
    selectedOption?: string
    quantity: number
    price: number
  }>
  totalAmount: number
  status: "new" | "in_progress" | "ready" | "completed"
  paymentMethod: "cash" | "card"
  additionalInfo?: string
  createdAt: string
  completedAt?: string
}

interface OrderContextType {
  orders: Order[]
  refreshOrders: () => void
}

const OrderContext = createContext<OrderContextType | undefined>(undefined)

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001"

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([])
  const [socket, setSocket] = useState<Socket | null>(null)

  const refreshOrders = async () => {
    try {
      const response = await fetch(`${API_URL}/api/orders`)
      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error)
    }
  }

  useEffect(() => {
    refreshOrders()

    // Connect to Socket.IO for real-time updates
    const newSocket = io(API_URL)
    setSocket(newSocket)

    newSocket.on("orderCreated", refreshOrders)
    newSocket.on("orderUpdated", refreshOrders)

    return () => {
      newSocket.disconnect()
    }
  }, [])

  return <OrderContext.Provider value={{ orders, refreshOrders }}>{children}</OrderContext.Provider>
}

export function useOrders() {
  const context = useContext(OrderContext)
  if (!context) {
    throw new Error("useOrders must be used within OrderProvider")
  }
  return context
}
