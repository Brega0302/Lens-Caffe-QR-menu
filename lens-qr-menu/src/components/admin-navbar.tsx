"use client"

import { Link, useNavigate } from "react-router-dom"
import { Button } from "./ui/button"
import { LogOut, LayoutDashboard } from "lucide-react"
import { setCurrentEmployee } from "../lib/order-storage"
import type { Employee } from "../lib/types"

interface AdminNavbarProps {
  employee: Employee
}

/**
 * ADMIN NAVBAR COMPONENT
 *
 * Navigation bar for authenticated employees and owners.
 * Shows user info and logout button.
 */
export function AdminNavbar({ employee }: AdminNavbarProps) {
  const navigate = useNavigate()

  const handleLogout = () => {
    setCurrentEmployee(null)
    navigate("/admin/login")
  }

  return (
    <nav className="border-b border-primary/20 bg-card/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/admin/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img src="/logo.png" alt="Caffe Lens Logo" className="h-14 w-auto" />
          </Link>

          <div className="flex items-center gap-4">
            {/* User info - hidden on small screens */}
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-foreground">{employee.name}</p>
              <p className="text-xs text-muted-foreground">Admin Panel</p>
            </div>

            {/* Dashboard button */}
            <Button asChild variant="ghost">
              <Link to="/admin/dashboard">
                <LayoutDashboard className="h-5 w-5 mr-2" />
                Dashboard
              </Link>
            </Button>

            {/* Logout button */}
            <Button onClick={handleLogout} variant="outline">
              <LogOut className="h-5 w-5 mr-2" />
              <span className="hidden sm:inline">Odjavi se</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
