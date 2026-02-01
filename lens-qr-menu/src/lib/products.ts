export interface Product {
  id: number
  name: string
  category: string
  price: number
  image: string
  options?: string[]
  specialNotes?: string
  inStock?: boolean
}

export const products: Product[] = [
  // Kafe
  {
    id: 1,
    name: "Espresso",
    category: "Kafe",
    price: 2.5,
    image: "/espresso-coffee-cup.png",
    options: ["Obični", "Dupli"],
    inStock: true,
  },
  {
    id: 2,
    name: "Cappuccino",
    category: "Kafe",
    price: 3.5,
    image: "/cappuccino-with-foam-art.jpg",
    options: ["Obično mlijeko", "Soja mlijeko", "Sa orasima"],
    inStock: true,
  },
  {
    id: 3,
    name: "Latte",
    category: "Kafe",
    price: 3.5,
    image: "/caffe-latte-in-glass.jpg",
    options: ["Obični", "Vanila", "Karamel"],
    inStock: true,
  },
  {
    id: 4,
    name: "Turska kafa",
    category: "Kafe",
    price: 2.0,
    image: "/turkish-coffee-traditional.jpg",
    options: ["Obična", "Sa šećerom", "Srednja"],
    inStock: true,
  },
  {
    id: 5,
    name: "Americano",
    category: "Kafe",
    price: 2.5,
    image: "/americano-coffee-black.jpg",
    options: ["Mala", "Velika"],
    inStock: true,
  },
  {
    id: 6,
    name: "Macchiato",
    category: "Kafe",
    price: 3.0,
    image: "/macchiato-coffee-layered.jpg",
    options: ["Obični", "Karamel"],
    inStock: true,
  },
  // Sokovi
  {
    id: 7,
    name: "Cijeđeni sok od narandže",
    category: "Sokovi",
    price: 4.5,
    image: "/fresh-orange-juice-glass.jpg",
    options: ["Mala", "Velika"],
    inStock: true,
  },
  {
    id: 8,
    name: "Cijeđeni sok od limuna",
    category: "Sokovi",
    price: 4.0,
    image: "/fresh-lemon-juice-with-mint.jpg",
    options: ["Mala", "Velika", "Sa mentom"],
    inStock: true,
  },
  {
    id: 9,
    name: "Smoothie jagoda-banana",
    category: "Sokovi",
    price: 5.5,
    image: "/strawberry-banana-smoothie-pink.jpg",
    options: ["Standard", "Sa proteinom"],
    inStock: true,
  },
  {
    id: 10,
    name: "Smoothie mango-ananas",
    category: "Sokovi",
    price: 5.5,
    image: "/mango-pineapple-smoothie-yellow.jpg",
    options: ["Standard", "Sa proteinom"],
    inStock: true,
  },
  {
    id: 11,
    name: "Ledeni čaj",
    category: "Sokovi",
    price: 3.0,
    image: "/iced-tea-with-lemon.png",
    options: ["Breskva", "Limun", "Šumsko voće"],
    inStock: true,
  },
  {
    id: 12,
    name: "Gazirana voda",
    category: "Sokovi",
    price: 2.0,
    image: "/sparkling-water-bottle.png",
    options: ["Prirodna", "Sa ukusom limuna"],
    inStock: true,
  },
  // Nargile
  {
    id: 13,
    name: "Nargila - Jabuka",
    category: "Nargile",
    price: 18.0,
    image: "/hookah-icon.png",
    options: ["Standard", "Premium"],
    inStock: true,
  },
  {
    id: 14,
    name: "Nargila - Borovnica",
    category: "Nargile",
    price: 18.0,
    image: "/hookah-icon.png",
    options: ["Standard", "Premium"],
    inStock: true,
  },
  {
    id: 15,
    name: "Nargila - Lubenica",
    category: "Nargile",
    price: 18.0,
    image: "/hookah-icon.png",
    options: ["Standard", "Premium"],
    inStock: true,
  },
  {
    id: 16,
    name: "Nargila - Menta",
    category: "Nargile",
    price: 18.0,
    image: "/hookah-icon.png",
    options: ["Standard", "Premium", "Dvostruka menta"],
    inStock: true,
  },
  {
    id: 17,
    name: "Nargila - Mix voća",
    category: "Nargile",
    price: 20.0,
    image: "/hookah-icon.png",
    options: ["Standard", "Premium"],
    inStock: true,
  },
  {
    id: 18,
    name: "Nargila - Šuma bobica",
    category: "Nargile",
    price: 20.0,
    image: "/hookah-icon.png",
    options: ["Standard", "Premium"],
    inStock: true,
  },
]

export function getProductStockStatus(): Record<number, boolean> {
  if (typeof window === "undefined") return {}
  const stock = localStorage.getItem("productStock")
  return stock ? JSON.parse(stock) : {}
}

export function updateProductStock(productId: number, inStock: boolean): void {
  if (typeof window === "undefined") return
  const stock = getProductStockStatus()
  stock[productId] = inStock
  localStorage.setItem("productStock", JSON.stringify(stock))
  window.dispatchEvent(new Event("stockUpdated"))
}

export function isProductInStock(productId: number): boolean {
  const stock = getProductStockStatus()
  return stock[productId] !== undefined ? stock[productId] : true
}
