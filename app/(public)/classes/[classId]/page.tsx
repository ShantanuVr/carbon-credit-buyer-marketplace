'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { RegistryClient } from '@/lib/api'
import { Class, Project, PurchaseFormSchema } from '@/lib/types'
import { formatNumber, formatDate } from '@/lib/format'
import { Leaf, ShoppingCart, Shield, Calendar, TrendingUp, ExternalLink } from 'lucide-react'
import Link from 'next/link'

interface ClassDetailPageProps {
  params: {
    classId: string
  }
}

interface ClassWithProject extends Class {
  project: Project
}

export default function ClassDetailPage({ params }: ClassDetailPageProps) {
  const router = useRouter()
  const [classData, setClassData] = useState<ClassWithProject | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isPurchasing, setIsPurchasing] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [error, setError] = useState('')
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    fetchClassData()
    checkAuth()
  }, [params.classId])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
    }
  }

  const fetchClassData = async () => {
    try {
      const registryClient = new RegistryClient()
      const [cls, projects] = await Promise.all([
        registryClient.getClass(params.classId),
        registryClient.getProjects(),
      ])

      const project = projects.find(p => p.id === cls.projectId)
      if (project) {
        setClassData({ ...cls, project })
      }
    } catch (error) {
      console.error('Error fetching class data:', error)
      setError('Failed to load class information')
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuantityChange = (value: string) => {
    const num = parseInt(value)
    if (num > 0 && num <= (classData?.remaining || 0)) {
      setQuantity(num)
    }
  }

  const handleAddToCart = () => {
    if (!user) {
      router.push('/login')
      return
    }
    // TODO: Implement cart functionality
    console.log('Add to cart:', { classId: params.classId, quantity })
  }

  const handleBuyNow = async () => {
    if (!user) {
      router.push('/login')
      return
    }

    setIsPurchasing(true)
    setError('')

    try {
      const validatedData = PurchaseFormSchema.parse({
        classId: params.classId,
        quantity,
      })

      const response = await fetch('/api/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validatedData),
      })

      const result = await response.json()

      if (result.success) {
        router.push(`/buyer/orders/${result.orderId}`)
      } else {
        setError(result.error || 'Purchase failed')
      }
    } catch (err) {
      setError('Invalid purchase data')
    } finally {
      setIsPurchasing(false)
    }
  }

  const handleBuyAndRetire = () => {
    if (!user) {
      router.push('/login')
      return
    }
    // TODO: Implement buy and retire functionality
    console.log('Buy and retire:', { classId: params.classId, quantity })
  }

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
                <CardHeader>
                  <div className="h-6 bg-muted rounded animate-pulse" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="space-y-2">
                        <div className="h-3 bg-muted rounded animate-pulse" />
                        <div className="h-4 bg-muted rounded animate-pulse" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="h-6 bg-muted rounded animate-pulse" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="h-10 bg-muted rounded animate-pulse" />
                  <div className="h-10 bg-muted rounded animate-pulse" />
                  <div className="h-10 bg-muted rounded animate-pulse" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!classData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold">Class not found</h1>
          <p className="text-muted-foreground mt-2">
            The requested credit class could not be found.
          </p>
          <Link href="/projects">
            <Button className="mt-4">Browse Projects</Button>
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
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link href="/projects" className="hover:text-primary">
              Projects
            </Link>
            <span>/</span>
            <Link href={`/projects/${classData.project.id}`} className="hover:text-primary">
              {classData.project.name}
            </Link>
            <span>/</span>
            <span>Class {classData.id}</span>
          </div>
          
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold">Class {classData.id}</h1>
              <p className="text-xl text-muted-foreground">
                Vintage: {classData.vintage}
              </p>
            </div>
            <Badge variant={classData.remaining > 0 ? 'default' : 'secondary'}>
              {classData.status}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Class Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Class Information</CardTitle>
                <CardDescription>
                  Detailed information about this credit class
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Issued Credits</p>
                      <p className="text-2xl font-bold">{formatNumber(classData.issued)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Retired Credits</p>
                      <p className="text-2xl font-bold">{formatNumber(classData.retired)}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Available Credits</p>
                      <p className="text-2xl font-bold text-primary">{formatNumber(classData.remaining)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Created</p>
                      <p className="text-lg font-medium">{formatDate(classData.createdAt)}</p>
                    </div>
                  </div>
                </div>

                {classData.factorRef && (
                  <div className="p-4 bg-muted rounded-md">
                    <p className="text-sm">
                      <span className="text-muted-foreground">Factor Reference:</span>{' '}
                      <span className="font-medium">{classData.factorRef}</span>
                    </p>
                  </div>
                )}

                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Project Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Project Name</p>
                      <p className="font-medium">{classData.project.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Region</p>
                      <p className="font-medium">{classData.project.region || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Country</p>
                      <p className="font-medium">{classData.project.country || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Methodology</p>
                      <p className="font-medium">{classData.project.methodology || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Link href={`/projects/${classData.project.id}`}>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Project Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Purchase Widget */}
          <div className="space-y-6">
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

                {error && (
                  <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <Button
                    onClick={handleBuyNow}
                    className="w-full"
                    disabled={isPurchasing || quantity > classData.remaining}
                  >
                    {isPurchasing ? 'Processing...' : 'Buy Now'}
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={handleAddToCart}
                    className="w-full"
                    disabled={quantity > classData.remaining}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                  
                  <Button
                    variant="secondary"
                    onClick={handleBuyAndRetire}
                    className="w-full"
                    disabled={quantity > classData.remaining}
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
                    <Link href="/login">
                      <Button variant="outline" size="sm" className="mt-2 w-full">
                        Login
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Issued</span>
                  </div>
                  <span className="font-medium">{formatNumber(classData.issued)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">Retired</span>
                  </div>
                  <span className="font-medium">{formatNumber(classData.retired)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Leaf className="h-4 w-4 text-primary" />
                    <span className="text-sm">Available</span>
                  </div>
                  <span className="font-medium text-primary">{formatNumber(classData.remaining)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
