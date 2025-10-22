'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { RegistryClient } from '@/lib/api'
import { createRegistryClient } from '@/lib/api'
import { CreditBalance, Retirement } from '@/lib/types'
import { formatNumber, formatDate } from '@/lib/format'
import { Leaf, TrendingUp, Shield, ShoppingCart, Receipt, Activity } from 'lucide-react'
import Link from 'next/link'

export default function BuyerDashboard() {
  const [holdings, setHoldings] = useState<CreditBalance[]>([])
  const [recentRetirements, setRecentRetirements] = useState<Retirement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const registryClient = createRegistryClient()
      const [balances, userData] = await Promise.all([
        registryClient.getCreditBalance(),
        fetch('/api/auth/me').then(res => res.ok ? res.json() : null),
      ])

      setHoldings(balances)
      setUser(userData)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const totalHoldings = holdings.reduce((sum, holding) => sum + holding.quantity, 0)
  const totalValue = holdings.length // Placeholder for actual value calculation

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="h-8 bg-muted rounded animate-pulse w-1/3" />
            <div className="h-4 bg-muted rounded animate-pulse w-2/3" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded animate-pulse" />
                    <div className="h-8 bg-muted rounded animate-pulse" />
                  </div>
                </CardContent>
              </Card>
            ))}
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
          <h1 className="text-4xl font-bold">Dashboard</h1>
          <p className="text-xl text-muted-foreground">
            Welcome back, {user?.email || 'Buyer'}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Leaf className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{formatNumber(totalHoldings)}</p>
                  <p className="text-sm text-muted-foreground">Total Holdings</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20">
                  <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{formatNumber(totalValue)}</p>
                  <p className="text-sm text-muted-foreground">Portfolio Value</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                  <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{recentRetirements.length}</p>
                  <p className="text-sm text-muted-foreground">Retirements</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/20">
                  <Activity className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{holdings.length}</p>
                  <p className="text-sm text-muted-foreground">Active Classes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and navigation shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/projects">
                <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                  <Leaf className="h-6 w-6" />
                  <span>Browse Projects</span>
                </Button>
              </Link>
              <Link href="/buyer/cart">
                <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                  <ShoppingCart className="h-6 w-6" />
                  <span>View Cart</span>
                </Button>
              </Link>
              <Link href="/buyer/certificates">
                <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                  <Receipt className="h-6 w-6" />
                  <span>Certificates</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Holdings Table */}
        <Card>
          <CardHeader>
            <CardTitle>Your Holdings</CardTitle>
            <CardDescription>
              Carbon credits currently in your portfolio
            </CardDescription>
          </CardHeader>
          <CardContent>
            {holdings.length > 0 ? (
              <div className="space-y-4">
                {holdings.map((holding) => (
                  <div key={holding.classId} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium">Class {holding.classId}</h3>
                        <Badge variant="outline">{holding.class.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Vintage: {holding.class.vintage} • Project: {holding.class.projectId}
                      </p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-lg font-semibold">{formatNumber(holding.quantity)}</p>
                      <p className="text-sm text-muted-foreground">credits</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      <Button size="sm">
                        <Shield className="h-4 w-4 mr-2" />
                        Retire
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Leaf className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">No holdings yet</h3>
                <p className="text-muted-foreground mt-2">
                  Start by browsing projects and purchasing carbon credits.
                </p>
                <Link href="/projects">
                  <Button className="mt-4">Browse Projects</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your latest transactions and retirements
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentRetirements.length > 0 ? (
              <div className="space-y-4">
                {recentRetirements.map((retirement) => (
                  <div key={retirement.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Shield className="h-4 w-4 text-green-600" />
                        <h3 className="font-medium">Retirement</h3>
                        <Badge variant="secondary">Completed</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Class {retirement.classId} • {formatDate(retirement.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatNumber(retirement.quantity)}</p>
                      <p className="text-sm text-muted-foreground">credits</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Activity className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No recent activity</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
