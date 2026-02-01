"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Switch } from "./ui/switch"
import { Label } from "./ui/label"
import { products } from "../lib/products"
import { getProductStockStatus, updateProductStock } from "../lib/products"
import { Package } from "lucide-react"

/**
 * STOCK MANAGER COMPONENT
 *
 * Allows employees/owners to toggle product availability.
 * Products marked as out of stock won't be available for ordering.
 */
export function StockManager() {
  const [stockStatus, setStockStatus] = useState<Record<number, boolean>>({})

  // Load current stock status from localStorage
  useEffect(() => {
    setStockStatus(getProductStockStatus())

    const handleStockUpdate = () => {
      setStockStatus(getProductStockStatus())
    }

    window.addEventListener("stockUpdated", handleStockUpdate)
    return () => window.removeEventListener("stockUpdated", handleStockUpdate)
  }, [])

  // Toggle product stock status
  const handleToggleStock = (productId: number, inStock: boolean) => {
    updateProductStock(productId, inStock)
    setStockStatus((prev) => ({ ...prev, [productId]: inStock }))
  }

  // Check if product is in stock (default to true if not set)
  const isInStock = (productId: number) => {
    return stockStatus[productId] !== undefined ? stockStatus[productId] : true
  }

  // Group products by category for better organization
  const groupedProducts = products.reduce(
    (acc, product) => {
      if (!acc[product.category]) {
        acc[product.category] = []
      }
      acc[product.category].push(product)
      return acc
    },
    {} as Record<string, typeof products>,
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2">
          <Package className="h-6 w-6" />
          Upravljanje Zalihama
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">Označite proizvode koji nisu dostupni</p>
      </div>

      {/* Display products grouped by category */}
      {Object.entries(groupedProducts).map(([category, categoryProducts]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="text-lg">{category}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryProducts.map((product) => {
                const inStock = isInStock(product.id)
                return (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {/* Product Image */}
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {/* Product Info */}
                      <div>
                        <p className="font-medium text-foreground">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.price.toFixed(2)} KM</p>
                      </div>
                    </div>
                    {/* Stock Toggle */}
                    <div className="flex items-center gap-3">
                      <Label
                        htmlFor={`stock-${product.id}`}
                        className={`text-sm font-medium ${inStock ? "text-green-600" : "text-red-600"}`}
                      >
                        {inStock ? "Dostupno" : "Nedostupno"}
                      </Label>
                      <Switch
                        id={`stock-${product.id}`}
                        checked={inStock}
                        onCheckedChange={(checked) => handleToggleStock(product.id, checked)}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
