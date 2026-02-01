// Authentication routes - Login and user management
import express from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { sql } from "../database/init"
import { authenticateToken } from "../middleware/auth"

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"

// Login endpoint
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password required" })
    }

    const users = await sql`SELECT * FROM users WHERE username = ${username}`

    if (users.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    const user = users[0]

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password_hash)

    if (!validPassword) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: "24h" })

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Get current user endpoint (protected)
router.get("/me", authenticateToken, async (req, res) => {
  try {
    const users = await sql`SELECT id, username, role, created_at FROM users WHERE id = ${req.user.id}`

    if (users.length === 0) {
      return res.status(404).json({ error: "User not found" })
    }

    res.json(users[0])
  } catch (error) {
    console.error("Get user error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

export default router
