// Product routes - CRUD operations for menu items
import express from "express"
import { sql } from "../database/init"
import { authenticateToken, requireRole } from "../middleware/auth"

const router = express.Router()

// Get all products (public route)
router.get("/", async (req, res) => {
  try {
    const products = await sql`SELECT * FROM products ORDER BY category, name`
    res.json(products)
  } catch (error) {
    console.error("Get products error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Get single product
router.get("/:id", async (req, res) => {
  try {
    const products = await sql`SELECT * FROM products WHERE id = ${req.params.id}`

    if (products.length === 0) {
      return res.status(404).json({ error: "Product not found" })
    }

    res.json(products[0])
  } catch (error) {
    console.error("Get product error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Create product (owner only)
router.post("/", authenticateToken, requireRole("owner"), async (req, res) => {
  try {
    const { name, category, price, image_url, popular } = req.body

    const products = await sql`
      INSERT INTO products (name, category, price, image_url, popular) 
      VALUES (${name}, ${category}, ${price}, ${image_url || null}, ${popular || false}) 
      RETURNING *
    `

    res.status(201).json(products[0])
  } catch (error) {
    console.error("Create product error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Update product (owner only)
router.put("/:id", authenticateToken, requireRole("owner"), async (req, res) => {
  try {
    const { name, category, price, image_url, popular } = req.body

    const products = await sql`
      UPDATE products 
      SET name = ${name}, category = ${category}, price = ${price}, 
          image_url = ${image_url}, popular = ${popular} 
      WHERE id = ${req.params.id} 
      RETURNING *
    `

    if (products.length === 0) {
      return res.status(404).json({ error: "Product not found" })
    }

    res.json(products[0])
  } catch (error) {
    console.error("Update product error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Toggle stock status (employee and owner)
router.patch("/:id/stock", authenticateToken, async (req, res) => {
  try {
    const { in_stock } = req.body

    const products = await sql`
      UPDATE products 
      SET in_stock = ${in_stock} 
      WHERE id = ${req.params.id} 
      RETURNING *
    `

    if (products.length === 0) {
      return res.status(404).json({ error: "Product not found" })
    }

    res.json(products[0])
  } catch (error) {
    console.error("Update stock error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Delete product (owner only)
router.delete("/:id", authenticateToken, requireRole("owner"), async (req, res) => {
  try {
    const products = await sql`DELETE FROM products WHERE id = ${req.params.id} RETURNING id`

    if (products.length === 0) {
      return res.status(404).json({ error: "Product not found" })
    }

    res.json({ message: "Product deleted successfully" })
  } catch (error) {
    console.error("Delete product error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

export default router
