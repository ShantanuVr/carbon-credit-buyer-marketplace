import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Project } from '@/lib/types'
import { formatNumber } from '@/lib/format'
import { Leaf, Globe, Calendar } from 'lucide-react'
import Link from 'next/link'

interface ListingCardProps {
  project: Project
  availableCredits?: number
}

export function ListingCard({ project, availableCredits = 0 }: ListingCardProps) {
  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{project.name}</CardTitle>
            <CardDescription className="line-clamp-2">
              {project.description || 'No description available'}
            </CardDescription>
          </div>
          <Badge variant="outline">{project.status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground">Region</p>
              <p className="font-medium">{project.region || 'N/A'}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground">Created</p>
              <p className="font-medium">{new Date(project.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Available Credits:</span>
            <span className="font-medium">{formatNumber(availableCredits)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total Issued:</span>
            <span className="font-medium">{formatNumber(project.totalIssued)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total Retired:</span>
            <span className="font-medium">{formatNumber(project.totalRetired)}</span>
          </div>
        </div>

        {project.methodology && (
          <div className="p-2 bg-muted rounded-md">
            <p className="text-sm">
              <span className="text-muted-foreground">Methodology:</span>{' '}
              <span className="font-medium">{project.methodology}</span>
            </p>
          </div>
        )}

        <div className="flex gap-2">
          <Link href={`/projects/${project.id}`} className="flex-1">
            <Button variant="outline" className="w-full">
              View Details
            </Button>
          </Link>
          {availableCredits > 0 && (
            <Link href={`/projects/${project.id}`} className="flex-1">
              <Button className="w-full">
                <Leaf className="h-4 w-4 mr-2" />
                Buy Credits
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
