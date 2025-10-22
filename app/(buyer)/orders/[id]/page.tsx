'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Order, CartItem } from '@/lib/types'
import { formatNumber, formatDate } from '@/lib/format'
import { CheckCircle, Package, Shield, ExternalLink, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface OrderDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadOrder()
  }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

  const loadOrder = () => {
    const savedOrder = localStorage.getItem(`order_${id}`)
    if (savedOrder) {
      setOrder(JSON.parse(savedOrder))
    }
    setIsLoading(false)
  }

  const totalItems = order?.lines.reduce((sum, item) => sum + item.quantity, 0) || 0
  const totalValue = order?.lines.reduce((sum, item) => sum + (item.quantity * 0), 0) || 0

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="h-8 bg-muted rounded animate-pulse w-1/3" />
            <div className="h-4 bg-muted rounded animate-pulse w-2/3" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="flex justify-between p-4 border rounded-lg">
                        <div className="space-y-2">
                          <div className="h-4 bg-muted rounded animate-pulse w-24" />
                          <div className="h-3 bg-muted rounded animate-pulse w-32" />
                        </div>
                        <div className="space-y-2">
                          <div className="h-4 bg-muted rounded animate-pulse w-16" />
                          <div className="h-3 bg-muted rounded animate-pulse w-12" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            <div>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="h-6 bg-muted rounded animate-pulse" />
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

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-2">Order not found</h1>
          <p className="text-muted-foreground mb-6">
            The requested order could not be found.
          </p>
          <Link href="/buyer/dashboard">
            <Button>Go to Dashboard</Button>
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
            <Link href="/buyer/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold">Order #{order.id}</h1>
              <p className="text-xl text-muted-foreground">
                Placed on {formatDate(order.createdAt)}
              </p>
            </div>
            <Badge variant="default" className="text-lg px-4 py-2">
              <CheckCircle className="h-4 w-4 mr-2" />
              Completed
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Items */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
                <CardDescription>
                  Carbon credits included in this order
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {order.lines.map((item) => (
                  <div key={item.classId} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium">Class {item.classId}</h3>
                        <Badge variant="outline">{item.class.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Vintage: {item.class.vintage} • Project: {item.class.projectId}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>Issued: {formatNumber(item.class.issued)}</span>
                        <span>Retired: {formatNumber(item.class.retired)}</span>
                        <span>Remaining: {formatNumber(item.class.remaining)}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatNumber(item.quantity)} credits</p>
                      <p className="text-sm text-muted-foreground">$0.00</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Transfer Receipts */}
            {order.transferReceiptIds && order.transferReceiptIds.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Transfer Receipts</CardTitle>
                  <CardDescription>
                    Registry confirmation for credit transfers
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {order.transferReceiptIds.map((receiptId, index) => (
                    <div key={receiptId} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20">
                          <Package className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <p className="font-medium">Transfer Receipt #{receiptId}</p>
                          <p className="text-sm text-muted-foreground">
                            Registry confirmation for {order.lines[index]?.quantity} credits
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Receipt
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
                <CardDescription>
                  Manage your purchased credits
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button className="w-full">
                    <Shield className="h-4 w-4 mr-2" />
                    Retire Credits
                  </Button>
                  <Link href="/buyer/certificates">
                    <Button variant="outline" className="w-full">
                      View Certificates
                    </Button>
                  </Link>
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
                    <span>${totalValue.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Platform Fee</span>
                    <span>$0.00</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>${totalValue.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Order Date:</span>
                    <span>{formatDate(order.createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge variant="default">Completed</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card>
              <CardHeader>
                <CardTitle>Next Steps</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="p-1 rounded-full bg-primary/10">
                      <Shield className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Retire Credits</h4>
                      <p className="text-xs text-muted-foreground">
                        Permanently retire credits to generate certificates
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="p-1 rounded-full bg-green-100 dark:bg-green-900/20">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Track Impact</h4>
                      <p className="text-xs text-muted-foreground">
                        Monitor your environmental impact in the dashboard
                      </p>
                    </div>
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
