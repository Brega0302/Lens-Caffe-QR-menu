"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Label } from "./ui/label"
import { useToast } from "../hooks/use-toast"
import { authenticateEmployee, setCurrentEmployee } from "../lib/order-storage"
import { Lock, ArrowLeft } from "lucide-react"

/**
 * ADMIN LOGIN COMPONENT
 *
 * Login form for employees and owners.
 * Validates credentials and redirects to dashboard on success.
 */
export function AdminLogin() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const employee = authenticateEmployee(username, password)

    if (employee) {
      setCurrentEmployee(employee)
      toast({
        title: "Prijava uspješna",
        description: `Dobrodošli, ${employee.name}!`,
      })
      navigate("/admin/dashboard")
    } else {
      toast({
        title: "Greška",
        description: "Pogrešno korisničko ime ili lozinka",
        variant: "destructive",
      })
    }

    setIsLoading(false)
  }

  return (
    <Card className="w-full max-w-md border-primary/20">
      <CardHeader className="space-y-1 text-center">
        {/* Back button */}
        <Button asChild variant="ghost" className="absolute top-4 left-4 gap-2" size="sm">
          <Link to="/">
            <ArrowLeft className="h-4 w-4" />
            Nazad
          </Link>
        </Button>

        {/* Lock icon */}
        <div className="flex justify-center mb-4">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Lock className="h-6 w-6 text-primary" />
          </div>
        </div>

        <CardTitle className="text-2xl text-foreground">Admin Prijava</CardTitle>
        <CardDescription>Prijavite se kao uposlenik Caffe Lens</CardDescription>
      </CardHeader>

      <CardContent>
        {/* Login form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Korisničko ime</Label>
            <Input
              id="username"
              type="text"
              placeholder="admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Lozinka</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
            {isLoading ? "Prijava..." : "Prijavi se"}
          </Button>
        </form>

        {/* Demo accounts info */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground text-center mb-2 font-semibold">Demo nalozi:</p>
          <div className="space-y-1 text-xs text-muted-foreground">
            <p>
              <span className="font-mono">owner</span> / <span className="font-mono">owner123</span>
            </p>
            <p>
              <span className="font-mono">konobar</span> / <span className="font-mono">konobar123</span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
