"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getCurrentEmployee } from "../lib/order-storage"

interface CustomerGuardProps {
  children: React.ReactNode
}

/**
 * CUSTOMER GUARD COMPONENT
 *
 * Protects customer routes by checking if user is an employee.
 * Redirects employees to admin dashboard.
 * Regular customers can proceed.
 */
export function CustomerGuard({ children }: CustomerGuardProps) {
  const [isChecking, setIsChecking] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const currentEmployee = getCurrentEmployee()
    if (currentEmployee) {
      // Redirect logged-in employees to admin dashboard
      navigate("/admin/dashboard")
    } else {
      setIsChecking(false)
    }
  }, [navigate])

  // Show loading state while checking
  if (isChecking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Učitavanje...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
