"use client"

import { Trash2, CreditCard, Banknote } from "lucide-react"
import { Button } from "./ui/button"
import { useCart } from "./cart-provider"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { TableLayoutSelector } from "./table-layout-selector"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"
import { Label } from "./ui/label"
import { useOrders } from "./order-provider"
import { addOrder } from "../lib/order-storage"
import { useToast } from "../hooks/use-toast"

interface CartProps {
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

/**
 * CART COMPONENT
 *
 * Shopping cart modal that displays cart items and handles order placement.
 * Includes table selection and payment method selection.
 */
export function Cart({ isOpen: externalIsOpen, onOpenChange }: CartProps = {}) {
  const { items, removeItem, total, clearCart } = useCart()
  const [internalIsOpen, setInternalIsOpen] = useState(false)
  const [selectedTable, setSelectedTable] = useState("")
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card">("cash")
  const { refreshOrders } = useOrders()
  const { toast } = useToast()

  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen
  const setIsOpen = onOpenChange || setInternalIsOpen

  const handleConfirmOrder = () => {
    if (!selectedTable) {
      toast({
        title: "Greška",
        description: "Molimo odaberite broj stola",
        variant: "destructive",
      })
      return
    }

    // Create and save order
    const order = addOrder({
      table: selectedTable,
      items: items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        selectedOption: item.selectedOption,
      })),
      total,
      timestamp: new Date().toISOString(),
      status: "nova",
      paymentMethod,
    })

    refreshOrders()

    toast({
      title: "Narudžba poslata!",
      description: `Vaša narudžba za ${selectedTable} je primljena. Plaćanje: ${paymentMethod === "cash" ? "Keš" : "Kartica"}`,
    })

    // Reset cart and form
    clearCart()
    setIsOpen(false)
    setSelectedTable("")
    setPaymentMethod("cash")
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Vaša Korpa</DialogTitle>
        </DialogHeader>

        {items.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">Korpa je prazna</div>
        ) : (
          <div className="space-y-6">
            {/* Cart Items List */}
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id + item.selectedOption}
                  className="flex items-start justify-between gap-3 pb-4 border-b border-primary/10"
                >
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">{item.name}</h4>
                    {item.selectedOption && <p className="text-sm text-muted-foreground">{item.selectedOption}</p>}
                    <p className="text-sm text-muted-foreground">x{item.quantity}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">{(item.price * item.quantity).toFixed(2)} KM</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.id, item.selectedOption)}
                      className="h-8 w-8"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="flex items-center justify-between text-xl font-bold pt-2 pb-4 border-b">
              <span className="text-foreground">Ukupno:</span>
              <span className="text-primary">{total.toFixed(2)} KM</span>
            </div>

            {/* Table Selection */}
            <div>
              <h3 className="font-semibold text-lg mb-3 text-foreground">Odaberite Stol</h3>
              <TableLayoutSelector selectedTable={selectedTable} onTableSelect={setSelectedTable} />
            </div>

            {/* Payment Method Selection */}
            <div>
              <h3 className="font-semibold text-lg mb-3 text-foreground">Način Plaćanja</h3>
              <RadioGroup
                value={paymentMethod}
                onValueChange={(value) => setPaymentMethod(value as "cash" | "card")}
                className="grid grid-cols-2 gap-3"
              >
                <div className="relative">
                  <RadioGroupItem value="cash" id="cash" className="peer sr-only" />
                  <Label
                    htmlFor="cash"
                    className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                  >
                    <Banknote className="h-6 w-6" />
                    <span className="font-semibold">Keš</span>
                  </Label>
                </div>
                <div className="relative">
                  <RadioGroupItem value="card" id="card" className="peer sr-only" />
                  <Label
                    htmlFor="card"
                    className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                  >
                    <CreditCard className="h-6 w-6" />
                    <span className="font-semibold">Kartica</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Confirm Order Button */}
            <Button onClick={handleConfirmOrder} className="w-full h-12 text-base font-semibold" size="lg">
              Potvrdi Narudžbu
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
