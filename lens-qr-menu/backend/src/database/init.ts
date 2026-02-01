import dotenv from "dotenv"
dotenv.config()

import postgres from "postgres"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required!")
}

// Create PostgreSQL connection
export const sql = postgres(process.env.DATABASE_URL, {
  max: 20,
  idle_timeout: 30,
  connect_timeout: 10,
  debug: process.env.NODE_ENV === "development",
})

// Database schema creation SQL
const createTables = async () => {
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      role VARCHAR(50) NOT NULL CHECK (role IN ('employee', 'owner')),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `

  await sql`
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      category VARCHAR(100) NOT NULL,
      price DECIMAL(10, 2) NOT NULL,
      image_url TEXT,
      in_stock BOOLEAN DEFAULT true,
      popular BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `

  await sql`
    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      table_number INTEGER NOT NULL,
      status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'ready', 'completed')),
      payment_method VARCHAR(50) NOT NULL CHECK (payment_method IN ('cash', 'card')),
      total_amount DECIMAL(10, 2) NOT NULL,
      additional_info TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      completed_at TIMESTAMP
    )
  `

  await sql`
    CREATE TABLE IF NOT EXISTS order_items (
      id SERIAL PRIMARY KEY,
      order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
      product_id INTEGER REFERENCES products(id),
      product_name VARCHAR(255) NOT NULL,
      quantity INTEGER NOT NULL,
      price_at_time DECIMAL(10, 2) NOT NULL
    )
  `

  await sql`CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status)`
  await sql`CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at)`
  await sql`CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id)`
}

// Initialize database with tables and default users
export async function initDatabase() {
  try {
    console.log("Initializing database...")

    // Create tables
    await createTables()
    console.log("Database tables created successfully")

    // Check if default users exist
    const userCheck = await sql`SELECT COUNT(*) FROM users`

    if (Number.parseInt(userCheck[0].count) === 0) {
      const bcrypt = require("bcryptjs")

      const users = [
        { username: "owner", password: "owner123", role: "owner" },
        { username: "konobar", password: "konobar123", role: "employee" },
        { username: "admin", password: "admin123", role: "employee" },
      ]

      for (const user of users) {
        const hashedPassword = await bcrypt.hash(user.password, 10)
        await sql`INSERT INTO users (username, password_hash, role) VALUES (${user.username}, ${hashedPassword}, ${user.role})`
      }

      console.log("Default users created")
    }

    console.log("Database initialization complete")
  } catch (error) {
    console.error("Database initialization error:", error)
    throw error
  }
}
