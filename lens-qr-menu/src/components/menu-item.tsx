"use client"

import { useState } from "react"
import { Plus, Minus, TrendingUp } from "lucide-react"
import { Button } from "./ui/button"
import { Card, CardContent, CardFooter } from "./ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Textarea } from "./ui/textarea"
import { Badge } from "./ui/badge"
import { useCart } from "./cart-provider"
import type { Product } from "../lib/products"
import { useToast } from "../hooks/use-toast"

interface MenuItemProps {
  product: Product
  isPopular?: boolean
}

/**
 * MENU ITEM COMPONENT
 *
 * Displays a single product card with image, details, and add-to-cart functionality.
 * Includes quantity selector, option picker, and special notes field.
 */
export function MenuItem({ product, isPopular }: MenuItemProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedOption, setSelectedOption] = useState(product.options?.[0] || "")
  const [specialNotes, setSpecialNotes] = useState("")
  const [showNotes, setShowNotes] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const { addItem } = useCart()
  const { toast } = useToast()

  const handleAddToCart = () => {
    addItem({
      ...product,
      selectedOption,
      quantity,
      specialNotes,
    })
    toast({
      title: "Dodano u korpu",
      description: `${product.name} ${selectedOption ? `(${selectedOption})` : ""} x${quantity}`,
    })
    // Reset form
    setQuantity(1)
    setSpecialNotes("")
    setShowNotes(false)
  }

  return (
    <Card className="overflow-hidden border border-primary/20 hover:border-primary/50 hover:shadow-xl transition-all duration-300 group">
      {/* Product Image */}
      <div className="relative h-44 sm:h-52 bg-secondary overflow-hidden">
        {!imageLoaded && <div className="absolute inset-0 bg-muted animate-pulse" />}
        <img
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setImageLoaded(true)}
        />
        {isPopular && (
          <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground">
            <TrendingUp className="h-3 w-3 mr-1" />
            Popularno
          </Badge>
        )}
      </div>

      {/* Product Info */}
      <CardContent className="p-4 sm:p-6 space-y-1">
        <div>
          <h3 className="text-lg sm:text-xl font-semibold text-foreground leading-tight">{product.name}</h3>
          <p className="text-sm text-muted-foreground mt-1">{product.category}</p>
        </div>

        <div className="text-2xl sm:text-3xl font-bold text-primary">{product.price.toFixed(2)} KM</div>

        {/* Options Selector */}
        {product.options && product.options.length > 0 && (
          <Select value={selectedOption} onValueChange={setSelectedOption}>
            <SelectTrigger className="bg-card border-primary/20 h-12 my-2">
              <SelectValue placeholder="Odaberi opciju" />
            </SelectTrigger>
            <SelectContent>
              {product.options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </CardContent>

      {/* Quantity Controls and Add to Cart */}
      <CardFooter className="p-4 sm:p-6 pt-0 flex flex-row gap-3 -mt-4">
        {/* Quantity Selector */}
        <div className="w-1/2 grid grid-cols-3 border border-primary/30 rounded-lg overflow-hidden h-14">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="hover:bg-primary/10 rounded-none h-full text-lg"
          >
            <Minus className="h-5 w-5" />
          </Button>
          <div className="flex items-center justify-center font-bold text-lg text-foreground border-x border-primary/30 bg-card">
            {quantity}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setQuantity(quantity + 1)}
            className="hover:bg-primary/10 rounded-none h-full text-lg"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>

        {/* Add to Cart Button */}
        <Button onClick={handleAddToCart} className="w-1/2 h-14 text-base transition-all duration-300">
          Dodaj u korpu
        </Button>
      </CardFooter>

      {/* Special Notes Section */}
      {showNotes ? (
        <div className="px-4 sm:px-6 pb-4 space-y-0">
          <Textarea
            placeholder="Npr: bez šećera, sa extra ledom..."
            value={specialNotes}
            onChange={(e) => setSpecialNotes(e.target.value)}
            className="min-h-[80px] text-sm border-primary/20 focus:border-primary"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowNotes(false)}
            className="w-full text-xs text-muted-foreground h-10"
          >
            Zatvori
          </Button>
        </div>
      ) : (
        <div className="px-4 sm:px-6 pb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowNotes(true)}
            className="w-full text-xs text-primary hover:text-primary h-10"
          >
            + Dodaj posebne napomene
          </Button>
        </div>
      )}
    </Card>
  )
}
