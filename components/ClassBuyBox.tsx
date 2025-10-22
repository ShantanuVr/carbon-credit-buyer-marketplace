import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Class } from '@/lib/types'
import { formatNumber } from '@/lib/format'
import { Leaf, ShoppingCart, Shield } from 'lucide-react'
import { useState } from 'react'

interface ClassBuyBoxProps {
  classData: Class
  user?: any
  onAddToCart?: (classId: string, quantity: number) => void
  onBuyNow?: (classId: string, quantity: number) => void
  onBuyAndRetire?: (classId: string, quantity: number) => void
}

export function ClassBuyBox({ 
  classData, 
  user, 
  onAddToCart, 
  onBuyNow, 
  onBuyAndRetire 
}: ClassBuyBoxProps) {
  const [quantity, setQuantity] = useState(1)

  const handleQuantityChange = (value: string) => {
    const num = parseInt(value)
    if (num > 0 && num <= classData.remaining) {
      setQuantity(num)
    }
  }

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(classData.id, quantity)
    }
  }

  const handleBuyNow = () => {
    if (onBuyNow) {
      onBuyNow(classData.id, quantity)
    }
  }

  const handleBuyAndRetire = () => {
    if (onBuyAndRetire) {
      onBuyAndRetire(classData.id, quantity)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Purchase Credits</CardTitle>
        <CardDescription>
          Select quantity and purchase options
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="quantity" className="text-sm font-medium">
            Quantity
          </label>
          <Input
            id="quantity"
            type="number"
            min="1"
            max={classData.remaining}
            value={quantity}
            onChange={(e) => handleQuantityChange(e.target.value)}
            placeholder="Enter quantity"
          />
          <p className="text-xs text-muted-foreground">
            Maximum: {formatNumber(classData.remaining)} credits
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Price per credit:</span>
            <span className="font-medium">$0.00</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Total quantity:</span>
            <span className="font-medium">{formatNumber(quantity)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Platform fee:</span>
            <span className="font-medium">$0.00</span>
          </div>
          <div className="border-t pt-2">
            <div className="flex justify-between font-semibold">
              <span>Total:</span>
              <span>$0.00</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Button
            onClick={handleBuyNow}
            className="w-full"
            disabled={!user || quantity > classData.remaining}
          >
            Buy Now
          </Button>
          
          <Button
            variant="outline"
            onClick={handleAddToCart}
            className="w-full"
            disabled={!user || quantity > classData.remaining}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
          
          <Button
            variant="secondary"
            onClick={handleBuyAndRetire}
            className="w-full"
            disabled={!user || quantity > classData.remaining}
          >
            <Shield className="h-4 w-4 mr-2" />
            Buy & Retire
          </Button>
        </div>

        {!user && (
          <div className="p-3 bg-muted rounded-md">
            <p className="text-sm text-muted-foreground">
              Please log in to purchase credits
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
