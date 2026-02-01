import { AdminGuard } from "@/components/admin-guard"
import { EmployeeDashboard } from "@/components/employee-dashboard"
import { OwnerDashboard } from "@/components/owner-dashboard"

/**
 * DASHBOARD PAGE
 *
 * Protected dashboard page that displays different content based on user role.
 * - Owners see full analytics, menu management, and order management
 * - Employees see orders, shift analytics, and stock management only
 *
 * Access controlled by AdminGuard which checks authentication.
 */
export default function DashboardPage() {
  return (
    <AdminGuard>
      {(employee) => {
        // Route to appropriate dashboard based on role
        if (employee.role === "owner") {
          return <OwnerDashboard employee={employee} />
        }
        return <EmployeeDashboard employee={employee} />
      }}
    </AdminGuard>
  )
}
