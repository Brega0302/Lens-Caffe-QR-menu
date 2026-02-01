"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { Navbar } from "../components/navbar"
import { Menu } from "../components/menu"
import { OrderStatusViewer } from "../components/order-status-viewer"
import { Cart } from "../components/cart"
import { CustomerGuard } from "../components/customer-guard"
import { AIChatAssistant } from "../components/ai-chat-assistant"
import { FloatingActions } from "../components/floating-actions"

/**
 * MENU PAGE
 *
 * Main ordering page where customers can browse products and place orders.
 * Includes menu browsing, cart management, order status tracking, and AI assistant.
 *
 * Features:
 * - Dynamic category filtering via URL params
 * - Floating action buttons for cart and AI chat
 * - Real-time order status viewer
 */
export default function MenuPage() {
  const [searchParams] = useSearchParams()
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isAIOpen, setIsAIOpen] = useState(false)
  const [categoryFromUrl, setCategoryFromUrl] = useState<string | null>(null)

  // Extract category from URL params
  useEffect(() => {
    setCategoryFromUrl(searchParams.get("category"))
  }, [searchParams])

  return (
    <CustomerGuard>
      <div className="min-h-screen bg-background">
        {/* Navigation bar */}
        <Navbar />

        {/* Main content area */}
        <div className="container mx-auto px-5 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            {/* Shows customer's active order status */}
            <OrderStatusViewer />

            {/* Product browsing and ordering */}
            <Menu initialCategory={categoryFromUrl} />
          </div>
        </div>

        {/* Floating buttons for cart and AI assistant */}
        <FloatingActions onCartClick={() => setIsCartOpen(true)} onAIClick={() => setIsAIOpen(true)} />

        {/* Shopping cart modal */}
        <Cart isOpen={isCartOpen} onOpenChange={setIsCartOpen} />

        {/* AI chat assistant modal */}
        <AIChatAssistant isOpen={isAIOpen} onOpenChange={setIsAIOpen} />
      </div>
    </CustomerGuard>
  )
}
