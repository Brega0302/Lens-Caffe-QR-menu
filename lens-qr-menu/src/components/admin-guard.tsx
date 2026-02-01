"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getCurrentEmployee } from "../lib/order-storage"
import type { Employee } from "../lib/types"

interface AdminGuardProps {
  children: (employee: Employee) => React.ReactNode
}

/**
 * ADMIN GUARD COMPONENT
 *
 * Protects admin routes by checking if user is authenticated.
 * Redirects to login page if not authenticated.
 * Renders children with employee data if authenticated.
 */
export function AdminGuard({ children }: AdminGuardProps) {
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [isChecking, setIsChecking] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const currentEmployee = getCurrentEmployee()
    if (!currentEmployee) {
      navigate("/admin/login")
    } else {
      setEmployee(currentEmployee)
    }
    setIsChecking(false)
  }, [navigate])

  // Show loading state while checking authentication
  if (isChecking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Provjera pristupa...</p>
        </div>
      </div>
    )
  }

  if (!employee) {
    return null
  }

  return <>{children(employee)}</>
}
