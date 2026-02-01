// Analytics routes - Business intelligence and reporting
import express from "express"
import { sql } from "../database/init"
import { authenticateToken, requireRole } from "../middleware/auth"

const router = express.Router()

interface StatsResult {
  total_orders: string
  total_revenue: string
  avg_order_value: string
  cash_orders: string
  card_orders: string
}

interface TopProductResult {
  product_name: string
  total_quantity: string
  order_count: string
}

interface AverageResult {
  overall_avg: string
  weekly_avg: string
  monthly_avg: string
}

// Get analytics data
router.get("/", authenticateToken, async (req, res) => {
  try {
    const period = req.query.period as string | undefined
    const start_date = req.query.start_date as string | undefined
    const end_date = req.query.end_date as string | undefined
    const userRole = req.user.role

    // Employees can only see shift analytics
    if (userRole === "employee" && period !== "shift1" && period !== "shift2") {
      return res.status(403).json({ error: "Employees can only access shift analytics" })
    }

    let statsResult: StatsResult[]
    let topProductsResult: TopProductResult[] = []

    if (start_date && end_date) {
      statsResult = await sql<StatsResult[]>`
        SELECT 
          COUNT(*) as total_orders,
          COALESCE(SUM(total_amount), 0) as total_revenue,
          COALESCE(AVG(total_amount), 0) as avg_order_value,
          COUNT(CASE WHEN payment_method = 'cash' THEN 1 END) as cash_orders,
          COUNT(CASE WHEN payment_method = 'card' THEN 1 END) as card_orders
        FROM orders o
        WHERE o.created_at >= ${start_date} AND o.created_at <= ${end_date}
      `
    } else if (period === "shift1") {
      statsResult = await sql<StatsResult[]>`
        SELECT 
          COUNT(*) as total_orders,
          COALESCE(SUM(total_amount), 0) as total_revenue,
          COALESCE(AVG(total_amount), 0) as avg_order_value,
          COUNT(CASE WHEN payment_method = 'cash' THEN 1 END) as cash_orders,
          COUNT(CASE WHEN payment_method = 'card' THEN 1 END) as card_orders
        FROM orders o
        WHERE DATE(o.created_at) = CURRENT_DATE 
          AND EXTRACT(HOUR FROM o.created_at) >= 6 
          AND EXTRACT(HOUR FROM o.created_at) < 14
      `
    } else if (period === "shift2") {
      statsResult = await sql<StatsResult[]>`
        SELECT 
          COUNT(*) as total_orders,
          COALESCE(SUM(total_amount), 0) as total_revenue,
          COALESCE(AVG(total_amount), 0) as avg_order_value,
          COUNT(CASE WHEN payment_method = 'cash' THEN 1 END) as cash_orders,
          COUNT(CASE WHEN payment_method = 'card' THEN 1 END) as card_orders
        FROM orders o
        WHERE DATE(o.created_at) = CURRENT_DATE 
          AND EXTRACT(HOUR FROM o.created_at) >= 14 
          AND EXTRACT(HOUR FROM o.created_at) < 22
      `
    } else if (period === "today") {
      statsResult = await sql<StatsResult[]>`
        SELECT 
          COUNT(*) as total_orders,
          COALESCE(SUM(total_amount), 0) as total_revenue,
          COALESCE(AVG(total_amount), 0) as avg_order_value,
          COUNT(CASE WHEN payment_method = 'cash' THEN 1 END) as cash_orders,
          COUNT(CASE WHEN payment_method = 'card' THEN 1 END) as card_orders
        FROM orders o
        WHERE DATE(o.created_at) = CURRENT_DATE
      `
    } else if (period === "week") {
      statsResult = await sql<StatsResult[]>`
        SELECT 
          COUNT(*) as total_orders,
          COALESCE(SUM(total_amount), 0) as total_revenue,
          COALESCE(AVG(total_amount), 0) as avg_order_value,
          COUNT(CASE WHEN payment_method = 'cash' THEN 1 END) as cash_orders,
          COUNT(CASE WHEN payment_method = 'card' THEN 1 END) as card_orders
        FROM orders o
        WHERE o.created_at >= CURRENT_DATE - INTERVAL '7 days'
      `
    } else if (period === "month") {
      statsResult = await sql<StatsResult[]>`
        SELECT 
          COUNT(*) as total_orders,
          COALESCE(SUM(total_amount), 0) as total_revenue,
          COALESCE(AVG(total_amount), 0) as avg_order_value,
          COUNT(CASE WHEN payment_method = 'cash' THEN 1 END) as cash_orders,
          COUNT(CASE WHEN payment_method = 'card' THEN 1 END) as card_orders
        FROM orders o
        WHERE o.created_at >= CURRENT_DATE - INTERVAL '30 days'
      `
    } else if (period === "year") {
      statsResult = await sql<StatsResult[]>`
        SELECT 
          COUNT(*) as total_orders,
          COALESCE(SUM(total_amount), 0) as total_revenue,
          COALESCE(AVG(total_amount), 0) as avg_order_value,
          COUNT(CASE WHEN payment_method = 'cash' THEN 1 END) as cash_orders,
          COUNT(CASE WHEN payment_method = 'card' THEN 1 END) as card_orders
        FROM orders o
        WHERE o.created_at >= CURRENT_DATE - INTERVAL '1 year'
      `
    } else {
      statsResult = await sql<StatsResult[]>`
        SELECT 
          COUNT(*) as total_orders,
          COALESCE(SUM(total_amount), 0) as total_revenue,
          COALESCE(AVG(total_amount), 0) as avg_order_value,
          COUNT(CASE WHEN payment_method = 'cash' THEN 1 END) as cash_orders,
          COUNT(CASE WHEN payment_method = 'card' THEN 1 END) as card_orders
        FROM orders o
      `
    }

    // Get top products (only for owners)
    if (userRole === "owner") {
      if (start_date && end_date) {
        topProductsResult = await sql<TopProductResult[]>`
          SELECT 
            oi.product_name,
            SUM(oi.quantity) as total_quantity,
            COUNT(DISTINCT oi.order_id) as order_count
          FROM order_items oi
          JOIN orders o ON oi.order_id = o.id
          WHERE o.created_at >= ${start_date} AND o.created_at <= ${end_date}
          GROUP BY oi.product_name
          ORDER BY total_quantity DESC
          LIMIT 5
        `
      } else if (period) {
        topProductsResult = await sql<TopProductResult[]>`
          SELECT 
            oi.product_name,
            SUM(oi.quantity) as total_quantity,
            COUNT(DISTINCT oi.order_id) as order_count
          FROM order_items oi
          JOIN orders o ON oi.order_id = o.id
          GROUP BY oi.product_name
          ORDER BY total_quantity DESC
          LIMIT 5
        `
      }
    }

    res.json({
      period,
      statistics: statsResult[0],
      top_products: topProductsResult,
    })
  } catch (error) {
    console.error("Analytics error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Get average income statistics (owner only)
router.get("/averages", authenticateToken, requireRole("owner"), async (req, res) => {
  try {
    const result = await sql<AverageResult[]>`
      SELECT 
        COALESCE(AVG(total_amount), 0) as overall_avg,
        COALESCE(AVG(CASE 
          WHEN created_at >= CURRENT_DATE - INTERVAL '7 days' 
          THEN total_amount 
        END), 0) as weekly_avg,
        COALESCE(AVG(CASE 
          WHEN created_at >= CURRENT_DATE - INTERVAL '30 days' 
          THEN total_amount 
        END), 0) as monthly_avg
      FROM orders
    `

    res.json(result[0])
  } catch (error) {
    console.error("Averages error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

export default router
