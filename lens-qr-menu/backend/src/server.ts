// Load environment variables
import dotenv from "dotenv"
dotenv.config()

if (!process.env.DATABASE_URL) {
  console.error("ERROR: DATABASE_URL is not set in .env file!")
  console.error("Please create a .env file with your PostgreSQL connection string")
  process.exit(1)
}

console.log("[v0] Environment loaded successfully")
console.log("[v0] Database URL:", process.env.DATABASE_URL?.replace(/:[^:]*@/, ":****@")) // Hide password in logs

// Backend entry point - Sets up Express server, Socket.IO, and API routes
import express from "express"
import cors from "cors"
import http from "http"
import { Server } from "socket.io"
import authRoutes from "./routes/auth"
import productRoutes from "./routes/products"
import orderRoutes from "./routes/orders"
import analyticsRoutes from "./routes/analytics"
import { initDatabase } from "./database/init"

// Initialize Express app
const app = express()
const server = http.createServer(app)

// Initialize Socket.IO for real-time updates
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
  },
})

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
)
app.use(express.json())

// Make Socket.IO instance available to routes
app.set("io", io)

// API Routes
app.use("/api/auth", authRoutes)
app.use("/api/products", productRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/analytics", analyticsRoutes)

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" })
})

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("[v0] Client connected:", socket.id)

  socket.on("disconnect", () => {
    console.log("[v0] Client disconnected:", socket.id)
  })
})

// Initialize database and start server
const PORT = process.env.PORT || 3001

initDatabase()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`[v0] Server running on http://localhost:${PORT}`)
      console.log(`[v0] Socket.IO ready for real-time updates`)
    })
  })
  .catch((error) => {
    console.error("[v0] Failed to initialize database:", error)
    process.exit(1)
  })
