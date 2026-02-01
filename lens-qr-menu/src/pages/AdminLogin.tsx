import { AdminLogin } from "@/components/admin-login"

/**
 * ADMIN LOGIN PAGE
 *
 * Login page for both employees and owners to access their respective dashboards.
 * Uses the AdminLogin component which handles authentication.
 */
export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <AdminLogin />
    </div>
  )
}
