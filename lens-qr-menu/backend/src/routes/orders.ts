// Order routes - Create, read, update orders with real-time Socket.IO updates
import express from "express"
import { sql } from "../database/init"
import { authenticateToken } from "../middleware/auth"

const router = express.Router()

// Get all orders (protected - employee and owner)
router.get("/", authenticateToken, async (req, res) => {
  try {
    const { status } = req.query
    const statusFilter = status as string | undefined

    let orders

    if (statusFilter) {
      orders = await sql`
        SELECT o.*, 
          COALESCE(
            json_agg(
              json_build_object(
                'id', oi.id,
                'product_id', oi.product_id,
                'product_name', oi.product_name,
                'quantity', oi.quantity,
                'price_at_time', oi.price_at_time
              )
            ) FILTER (WHERE oi.id IS NOT NULL), '[]'
          ) as items
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        WHERE o.status = ${statusFilter}
        GROUP BY o.id 
        ORDER BY o.created_at DESC
      `
    } else {
      orders = await sql`
        SELECT o.*, 
          COALESCE(
            json_agg(
              json_build_object(
                'id', oi.id,
                'product_id', oi.product_id,
                'product_name', oi.product_name,
                'quantity', oi.quantity,
                'price_at_time', oi.price_at_time
              )
            ) FILTER (WHERE oi.id IS NOT NULL), '[]'
          ) as items
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        GROUP BY o.id 
        ORDER BY o.created_at DESC
      `
    }

    res.json(orders)
  } catch (error) {
    console.error("Get orders error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Create order (public route)
router.post("/", async (req, res) => {
  try {
    const { table_number, payment_method, items, additional_info } = req.body

    // Calculate total
    const total = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0)

    const orders = await sql.begin(async (sql) => {
      // Create order
      const [order] = await sql`
        INSERT INTO orders (table_number, payment_method, total_amount, additional_info) 
        VALUES (${table_number}, ${payment_method}, ${total}, ${additional_info || null}) 
        RETURNING *
      `

      // Create order items
      for (const item of items) {
        await sql`
          INSERT INTO order_items (order_id, product_id, product_name, quantity, price_at_time) 
          VALUES (${order.id}, ${item.id}, ${item.name}, ${item.quantity}, ${item.price})
        `
      }

      // Fetch complete order with items
      return await sql`
        SELECT o.*, 
          COALESCE(
            json_agg(
              json_build_object(
                'id', oi.id,
                'product_id', oi.product_id,
                'product_name', oi.product_name,
                'quantity', oi.quantity,
                'price_at_time', oi.price_at_time
              )
            ) FILTER (WHERE oi.id IS NOT NULL), '[]'
          ) as items
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        WHERE o.id = ${order.id}
        GROUP BY o.id
      `
    })

    // Emit Socket.IO event for real-time update
    const io = req.app.get("io")
    io.emit("order:created", orders[0])

    res.status(201).json(orders[0])
  } catch (error) {
    console.error("Create order error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Update order status (protected - employee and owner)
router.patch("/:id/status", authenticateToken, async (req, res) => {
  try {
    const { status } = req.body
    const completed_at = status === "completed" ? new Date() : null

    await sql`
      UPDATE orders 
      SET status = ${status}, completed_at = ${completed_at} 
      WHERE id = ${req.params.id}
    `

    // Fetch complete order with items
    const orders = await sql`
      SELECT o.*, 
        COALESCE(
          json_agg(
            json_build_object(
              'id', oi.id,
              'product_id', oi.product_id,
              'product_name', oi.product_name,
              'quantity', oi.quantity,
              'price_at_time', oi.price_at_time
            )
          ) FILTER (WHERE oi.id IS NOT NULL), '[]'
        ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.id = ${req.params.id}
      GROUP BY o.id
    `

    if (orders.length === 0) {
      return res.status(404).json({ error: "Order not found" })
    }

    // Emit Socket.IO event for real-time update
    const io = req.app.get("io")
    io.emit("order:updated", orders[0])

    res.json(orders[0])
  } catch (error) {
    console.error("Update order status error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

export default router
