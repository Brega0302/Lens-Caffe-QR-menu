// Database seeding script - Populates initial product data
import { sql } from "../database/init"

const products = [
  { name: "Espresso", category: "Espresso", price: 3.5, image_url: "/espresso-coffee-cup.png", popular: true },
  { name: "Cappuccino", category: "Cappuccino", price: 4.0, image_url: "/cappuccino-with-foam-art.jpg", popular: true },
  { name: "Caffè Latte", category: "Latte", price: 4.5, image_url: "/caffe-latte-in-glass.jpg", popular: false },
  {
    name: "Turkish Coffee",
    category: "Turkish",
    price: 3.0,
    image_url: "/turkish-coffee-traditional.jpg",
    popular: false,
  },
  { name: "Americano", category: "Americano", price: 3.75, image_url: "/americano-coffee-black.jpg", popular: true },
  { name: "Macchiato", category: "Macchiato", price: 3.5, image_url: "/macchiato-coffee-layered.jpg", popular: false },
  { name: "Flat White", category: "Espresso", price: 4.25, image_url: "/flat-white-latte-art.jpg", popular: false },
  { name: "Mocha", category: "Latte", price: 5.0, image_url: "/mocha-chocolate-coffee.jpg", popular: true },
  { name: "Cortado", category: "Espresso", price: 3.75, image_url: "/cortado-espresso-milk.jpg", popular: false },
  {
    name: "Jabuka Sok",
    category: "Sokovi",
    price: 2.5,
    image_url: "/placeholder.svg?height=200&width=200",
    popular: false,
  },
  {
    name: "Narandža Sok",
    category: "Sokovi",
    price: 2.5,
    image_url: "/placeholder.svg?height=200&width=200",
    popular: true,
  },
  {
    name: "Voćni Mix",
    category: "Sokovi",
    price: 3.0,
    image_url: "/placeholder.svg?height=200&width=200",
    popular: false,
  },
  { name: "Jabuka Nargile", category: "Nargile", price: 15.0, image_url: "/hookah-icon.png", popular: true },
  { name: "Mint Nargile", category: "Nargile", price: 15.0, image_url: "/hookah-icon.png", popular: false },
  { name: "Mix Nargile", category: "Nargile", price: 18.0, image_url: "/hookah-icon.png", popular: true },
]

export async function seedProducts() {
  try {
    const checkResult = await sql`SELECT COUNT(*) FROM products`

    if (Number.parseInt(checkResult[0].count) > 0) {
      console.log("Products already seeded")
      return
    }

    console.log("Seeding products...")

    for (const product of products) {
      await sql`
        INSERT INTO products (name, category, price, image_url, popular) 
        VALUES (${product.name}, ${product.category}, ${product.price}, ${product.image_url}, ${product.popular})
      `
    }

    console.log("Products seeded successfully")
  } catch (error) {
    console.error("Seed products error:", error)
    throw error
  }
}

// Run if called directly
if (require.main === module) {
  seedProducts()
    .then(() => {
      console.log("Seeding complete")
      process.exit(0)
    })
    .catch((error) => {
      console.error("Seeding failed:", error)
      process.exit(1)
    })
}
