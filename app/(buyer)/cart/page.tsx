'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CartItem } from '@/lib/types'
import { formatNumber } from '@/lib/format'
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function CartPage() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadCartItems()
  }, [])

  const loadCartItems = () => {
    // TODO: Load from localStorage or API
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    }
    setIsLoading(false)
  }

  const updateQuantity = (classId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(classId)
      return
    }

    const updatedItems = cartItems.map(item =>
      item.classId === classId ? { ...item, quantity: newQuantity } : item
    )
    setCartItems(updatedItems)
    localStorage.setItem('cart', JSON.stringify(updatedItems))
  }

  const removeItem = (classId: string) => {
    const updatedItems = cartItems.filter(item => item.classId !== classId)
    setCartItems(updatedItems)
    localStorage.setItem('cart', JSON.stringify(updatedItems))
  }

  const clearCart = () => {
    setCartItems([])
    localStorage.removeItem('cart')
  }

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = cartItems.reduce((sum, item) => sum + (item.quantity * 0), 0) // Placeholder pricing
  const platformFee = 0 // Demo: no fees
  const total = subtotal + platformFee

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="h-8 bg-muted rounded animate-pulse w-1/3" />
            <div className="h-4 bg-muted rounded animate-pulse w-2/3" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="h-6 bg-muted rounded animate-pulse" />
                      <div className="h-4 bg-muted rounded animate-pulse" />
                      <div className="flex justify-between">
                        <div className="h-8 bg-muted rounded animate-pulse w-24" />
                        <div className="h-8 bg-muted rounded animate-pulse w-16" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="h-4 bg-muted rounded animate-pulse" />
                    <div className="h-4 bg-muted rounded animate-pulse" />
                    <div className="h-4 bg-muted rounded animate-pulse" />
                    <div className="h-10 bg-muted rounded animate-pulse" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">Shopping Cart</h1>
          <p className="text-xl text-muted-foreground">
            Review your selected carbon credits before checkout
          </p>
        </div>

        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <Card key={item.classId}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-lg font-semibold">Class {item.classId}</h3>
                          <Badge variant="outline">{item.class.status}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Vintage: {item.class.vintage} • Project: {item.class.projectId}
                        </p>
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="text-muted-foreground">
                            Available: {formatNumber(item.class.remaining)}
                          </span>
                          <span className="text-muted-foreground">
                            Issued: {formatNumber(item.class.issued)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.classId, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <Input
                            type="number"
                            min="1"
                            max={item.class.remaining}
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.classId, parseInt(e.target.value) || 1)}
                            className="w-16 text-center"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.classId, item.quantity + 1)}
                            disabled={item.quantity >= item.class.remaining}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="text-lg font-semibold">$0.00</p>
                          <p className="text-sm text-muted-foreground">
                            {formatNumber(item.quantity)} credits
                          </p>
                        </div>

                        {/* Remove Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.classId)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Cart Actions */}
              <div className="flex justify-between items-center">
                <Button variant="outline" onClick={clearCart}>
                  Clear Cart
                </Button>
                <Link href="/projects">
                  <Button variant="outline">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Items ({totalItems})</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Platform Fee</span>
                      <span>${platformFee.toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <Link href="/buyer/checkout" className="block">
                    <Button className="w-full" size="lg">
                      Proceed to Checkout
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>

                  <div className="text-xs text-muted-foreground text-center">
                    Demo pricing - no actual charges will be made
                  </div>
                </CardContent>
              </Card>

              {/* Security Notice */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start space-x-2">
                    <div className="p-1 rounded-full bg-green-100 dark:bg-green-900/20">
                      <ShoppingCart className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium">Secure Checkout</h4>
                      <p className="text-xs text-muted-foreground">
                        Your carbon credit purchases are processed securely through the registry.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          /* Empty Cart */
          <div className="text-center py-12">
            <div className="mx-auto h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-6">
              <ShoppingCart className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">
              Browse our carbon credit projects and add credits to your cart.
            </p>
            <Link href="/projects">
              <Button size="lg">
                Browse Projects
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
