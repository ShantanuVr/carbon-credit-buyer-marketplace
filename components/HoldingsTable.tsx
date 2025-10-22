import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CreditBalance } from '@/lib/types'
import { formatNumber } from '@/lib/format'
import { Shield, Eye } from 'lucide-react'

interface HoldingsTableProps {
  holdings: CreditBalance[]
  onRetire?: (classId: string) => void
  onViewDetails?: (classId: string) => void
}

export function HoldingsTable({ holdings, onRetire, onViewDetails }: HoldingsTableProps) {
  if (holdings.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <Shield className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">No holdings yet</h3>
          <p className="text-muted-foreground mt-2">
            Start by browsing projects and purchasing carbon credits.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Holdings</CardTitle>
        <CardDescription>
          Carbon credits currently in your portfolio
        </CardDescription>
      </CardHeader>
      <CardContent>
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
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <span>Issued: {formatNumber(holding.class.issued)}</span>
                  <span>Retired: {formatNumber(holding.class.retired)}</span>
                  <span>Remaining: {formatNumber(holding.class.remaining)}</span>
                </div>
              </div>
              <div className="text-right space-y-1">
                <p className="text-lg font-semibold">{formatNumber(holding.quantity)}</p>
                <p className="text-sm text-muted-foreground">credits</p>
              </div>
              <div className="flex space-x-2">
                {onViewDetails && (
                  <Button variant="outline" size="sm" onClick={() => onViewDetails(holding.classId)}>
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                )}
                {onRetire && (
                  <Button size="sm" onClick={() => onRetire(holding.classId)}>
                    <Shield className="h-4 w-4 mr-2" />
                    Retire
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
