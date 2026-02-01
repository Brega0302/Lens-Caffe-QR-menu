export interface OrderItem {
  id: number
  name: string
  price: number
  quantity: number
  selectedOption?: string
}

export interface Order {
  id: string
  table: string
  items: OrderItem[]
  total: number
  timestamp: string
  status: "nova" | "u_pripremi" | "spremna" | "zavrsena"
  paymentMethod?: "cash" | "card"
  notes?: string
  completedAt?: string
}

export interface Employee {
  username: string
  password: string
  name: string
  role: "owner" | "employee"
}

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
