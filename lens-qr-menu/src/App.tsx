import { Routes, Route } from "react-router-dom"
import { CartProvider } from "./components/cart-provider"
import { OrderProvider } from "./components/order-provider"
import { Toaster } from "./components/ui/toaster"
import HomePage from "./pages/Home"
import MenuPage from "./pages/Menu"
import AdminLoginPage from "./pages/AdminLogin"
import DashboardPage from "./pages/Dashboard"

/**
 * ROOT APP COMPONENT
 *
 * Sets up the routing structure and wraps the app with necessary providers:
 * - OrderProvider: Manages order state across the app
 * - CartProvider: Manages shopping cart state
 * - Toaster: Displays toast notifications
 *
 * Routes:
 * - / : Landing page for customers
 * - /menu : Menu browsing and ordering page
 * - /admin/login : Login page for employees and owners
 * - /admin/dashboard : Dashboard for authenticated employees/owners
 */
export default function App() {
  return (
    <OrderProvider>
      <CartProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/dashboard" element={<DashboardPage />} />
        </Routes>
        <Toaster />
      </CartProvider>
    </OrderProvider>
  )
}
