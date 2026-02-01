"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export interface Product {
  id: number
  name: string
  price: number
  category: string
  image: string
  popular?: boolean
  options?: string[]
}

interface CartItem extends Product {
  selectedOption?: string
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: number, selectedOption?: string) => void
  clearCart: () => void
  total: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  const addItem = (item: CartItem) => {
    setItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex((i) => i.id === item.id && i.selectedOption === item.selectedOption)

      if (existingItemIndex > -1) {
        const newItems = [...prevItems]
        newItems[existingItemIndex].quantity += item.quantity
        return newItems
      }

      return [...prevItems, item]
    })
  }

  const removeItem = (id: number, selectedOption?: string) => {
    setItems((prevItems) => prevItems.filter((item) => !(item.id === id && item.selectedOption === selectedOption)))
  }

  const clearCart = () => {
    setItems([])
  }

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart, total }}>{children}</CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within CartProvider")
  }
  return context
}
