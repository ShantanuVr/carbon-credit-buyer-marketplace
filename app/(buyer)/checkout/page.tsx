'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { RegistryClient } from '@/lib/api'
import { CartItem, TransferRequest } from '@/lib/types'
import { formatNumber } from '@/lib/format'
import { CheckCircle, Shield, CreditCard, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function CheckoutPage() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    loadCartItems()
    checkAuth()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const loadCartItems = () => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    }
  }

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      } else {
        router.push('/login')
      }
    } catch (error) {
      router.push('/login')
    }
  }

  const handleCheckout = async () => {
    if (!user) {
      router.push('/login')
      return
    }

    setIsProcessing(true)
    setError('')

    try {
      const registryClient = new RegistryClient()
      const transferReceiptIds: string[] = []

      // Process each cart item
      for (const item of cartItems) {
        const transferRequest: TransferRequest = {
          toOrgId: user.orgId,
          classId: item.classId,
          quantity: item.quantity,
        }

        const result = await registryClient.transferCredits(transferRequest)
        transferReceiptIds.push(result.receiptId || `transfer_${Date.now()}`)
      }

      // Create order record
      const order = {
        id: `order_${Date.now()}`,
        lines: cartItems,
        createdAt: new Date().toISOString(),
        transferReceiptIds,
      }

      // Store order locally (in a real app, this would be stored in a database)
      localStorage.setItem(`order_${order.id}`, JSON.stringify(order))

      // Clear cart
      localStorage.removeItem('cart')
      setCartItems([])

      setOrderId(order.id)
      setIsSuccess(true)
    } catch (err) {
      console.error('Checkout error:', err)
      setError('Checkout failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = cartItems.reduce((sum, item) => sum + (item.quantity * 0), 0)
  const platformFee = 0
  const total = subtotal + platformFee

  if (isSuccess && orderId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <div className="mx-auto h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-4xl font-bold">Purchase Successful!</h1>
            <p className="text-xl text-muted-foreground">
              Your carbon credits have been transferred to your account.
            </p>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-lg font-semibold">Order #{orderId}</h3>
                  <p className="text-sm text-muted-foreground">
                    {formatNumber(totalItems)} credits purchased
                  </p>
                </div>

                <div className="space-y-2">
                  {cartItems.map((item) => (
                    <div key={item.classId} className="flex justify-between text-sm">
                      <span>Class {item.classId} ({formatNumber(item.quantity)} credits)</span>
                      <span>$0.00</span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-2">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>$0.00</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <div className="flex gap-4 justify-center">
              <Link href={`/buyer/orders/${orderId}`}>
                <Button>
                  View Order Details
                </Button>
              </Link>
              <Link href="/buyer/dashboard">
                <Button variant="outline">
                  Go to Dashboard
                </Button>
              </Link>
            </div>

            <div className="p-4 bg-muted rounded-md">
              <h4 className="font-medium mb-2">Next Steps:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• View your holdings in the dashboard</li>
                <li>• Retire credits to generate certificates</li>
                <li>• Track your environmental impact</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-2">No items to checkout</h1>
          <p className="text-muted-foreground mb-6">
            Your cart is empty. Add some carbon credits to proceed.
          </p>
          <Link href="/projects">
            <Button>Browse Projects</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <Link href="/buyer/cart">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Cart
              </Button>
            </Link>
          </div>
          <h1 className="text-4xl font-bold">Checkout</h1>
          <p className="text-xl text-muted-foreground">
            Review your order and complete your carbon credit purchase
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Items */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
                <CardDescription>
                  Review the carbon credits you&apos;re purchasing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.classId} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium">Class {item.classId}</h3>
                        <Badge variant="outline">{item.class.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Vintage: {item.class.vintage} • Project: {item.class.projectId}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatNumber(item.quantity)} credits</p>
                      <p className="text-sm text-muted-foreground">$0.00</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>
                  Demo mode - no actual payment required
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <CreditCard className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Demo Payment</p>
                    <p className="text-sm text-muted-foreground">
                      No actual charges will be made
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
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

                {error && (
                  <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                    {error}
                  </div>
                )}

                <Button
                  onClick={handleCheckout}
                  className="w-full"
                  size="lg"
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing...' : 'Complete Purchase'}
                </Button>

                <div className="text-xs text-muted-foreground text-center">
                  By completing this purchase, you agree to transfer the carbon credits to your account.
                </div>
              </CardContent>
            </Card>

            {/* Security Notice */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start space-x-2">
                  <div className="p-1 rounded-full bg-green-100 dark:bg-green-900/20">
                    <Shield className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium">Secure Transfer</h4>
                    <p className="text-xs text-muted-foreground">
                      Credits are transferred directly through the registry&apos;s secure system.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
