"use client"

import { Link } from "react-router-dom"
import { MessageSquare, Menu, X } from "lucide-react"
import { Button } from "./ui/button"
import { useState } from "react"

/**
 * CUSTOMER NAVBAR COMPONENT
 *
 * Main navigation bar for customers with desktop and mobile views.
 * Mobile view uses a hamburger menu dropdown.
 */
export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <nav className="border-b border-primary/20 bg-card/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img src="/logo.png" alt="Caffe Lens Logo" className="h-10 md:h-14 w-auto" />
          </Link>

          <div className="flex items-center gap-2 md:gap-4">
            {/* Desktop Navigation */}
            <Button asChild variant="ghost" className="hidden sm:flex">
              <Link to="/menu">Meni</Link>
            </Button>
            <Button asChild variant="ghost" className="hidden md:flex">
              <Link to="/about">O Nama</Link>
            </Button>
            <Button asChild variant="ghost" size="icon" className="hidden sm:flex">
              <Link to="/feedback">
                <MessageSquare className="h-5 w-5" />
              </Link>
            </Button>

            {/* Mobile menu toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="sm:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden absolute top-16 left-0 right-0 bg-card/98 backdrop-blur-md border-b border-primary/20 shadow-lg py-4 px-4 space-y-2 z-40">
          <Button asChild variant="ghost" className="w-full justify-start" onClick={() => setIsMobileMenuOpen(false)}>
            <Link to="/menu">Meni</Link>
          </Button>
          <Button asChild variant="ghost" className="w-full justify-start" onClick={() => setIsMobileMenuOpen(false)}>
            <Link to="/about">O Nama</Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            className="w-full justify-start gap-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Link to="/feedback">
              <MessageSquare className="h-5 w-5" />
              <span>Customer Feedback</span>
            </Link>
          </Button>
        </div>
      )}
    </nav>
  )
}
