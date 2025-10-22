import { Suspense } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { RegistryClient } from '@/lib/api'
import { Project, Class } from '@/lib/types'
import { formatNumber, formatDate } from '@/lib/format'
import { Globe, Calendar, Leaf, TrendingUp, Shield, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface ProjectDetailPageProps {
  params: {
    projectId: string
  }
}

async function getProjectWithClasses(projectId: string): Promise<{ project: Project; classes: Class[] } | null> {
  try {
    const registryClient = new RegistryClient()
    const [project, classes] = await Promise.all([
      registryClient.getProject(projectId),
      registryClient.getClasses(true),
    ])

    const projectClasses = classes.filter(cls => cls.projectId === projectId)
    
    return { project, classes: projectClasses }
  } catch (error) {
    console.error('Error fetching project:', error)
    return null
  }
}

function ClassCard({ cls }: { cls: Class }) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">Class {cls.id}</CardTitle>
            <CardDescription>
              Vintage: {cls.vintage}
            </CardDescription>
          </div>
          <Badge variant={cls.remaining > 0 ? 'default' : 'secondary'}>
            {cls.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Issued:</span>
            <p className="font-medium">{formatNumber(cls.issued)}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Retired:</span>
            <p className="font-medium">{formatNumber(cls.retired)}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Remaining:</span>
            <p className="font-medium">{formatNumber(cls.remaining)}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Created:</span>
            <p className="font-medium">{formatDate(cls.createdAt)}</p>
          </div>
        </div>

        {cls.factorRef && (
          <div className="p-2 bg-muted rounded-md">
            <p className="text-sm">
              <span className="text-muted-foreground">Factor Ref:</span>{' '}
              <span className="font-medium">{cls.factorRef}</span>
            </p>
          </div>
        )}

        <div className="flex gap-2">
          <Link href={`/classes/${cls.id}`} className="flex-1">
            <Button variant="outline" className="w-full">
              View Details
            </Button>
          </Link>
          {cls.remaining > 0 && (
            <Link href={`/classes/${cls.id}`} className="flex-1">
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

function LoadingSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="h-8 bg-muted rounded animate-pulse w-1/3" />
        <div className="h-4 bg-muted rounded animate-pulse w-2/3" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-muted rounded animate-pulse" />
              <div className="h-6 bg-muted rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="space-y-2">
                <div className="h-6 bg-muted rounded animate-pulse" />
                <div className="h-4 bg-muted rounded animate-pulse" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, j) => (
                  <div key={j} className="space-y-1">
                    <div className="h-3 bg-muted rounded animate-pulse" />
                    <div className="h-4 bg-muted rounded animate-pulse" />
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <div className="h-10 bg-muted rounded animate-pulse flex-1" />
                <div className="h-10 bg-muted rounded animate-pulse flex-1" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const data = await getProjectWithClasses(params.projectId)

  if (!data) {
    notFound()
  }

  const { project, classes } = data
  const totalAvailable = classes.reduce((sum, cls) => sum + cls.remaining, 0)
  const totalIssued = classes.reduce((sum, cls) => sum + cls.issued, 0)
  const totalRetired = classes.reduce((sum, cls) => sum + cls.retired, 0)

  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<LoadingSkeleton />}>
        <div className="space-y-8">
          {/* Project Header */}
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold">{project.name}</h1>
                <p className="text-xl text-muted-foreground">
                  {project.description || 'No description available'}
                </p>
              </div>
              <Badge variant="outline" className="text-lg px-4 py-2">
                {project.status}
              </Badge>
            </div>

            {/* Project Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Leaf className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{formatNumber(totalAvailable)}</p>
                      <p className="text-sm text-muted-foreground">Available Credits</p>
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
                      <p className="text-2xl font-bold">{formatNumber(totalIssued)}</p>
                      <p className="text-sm text-muted-foreground">Total Issued</p>
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
                      <p className="text-2xl font-bold">{formatNumber(totalRetired)}</p>
                      <p className="text-sm text-muted-foreground">Total Retired</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Project Details */}
            <Card>
              <CardHeader>
                <CardTitle>Project Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Region</p>
                        <p className="font-medium">{project.region || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Created</p>
                        <p className="font-medium">{formatDate(project.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Country</p>
                      <p className="font-medium">{project.country || 'N/A'}</p>
                    </div>
                    {project.methodology && (
                      <div>
                        <p className="text-sm text-muted-foreground">Methodology</p>
                        <p className="font-medium">{project.methodology}</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Available Classes */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold">Available Credit Classes</h2>
              <div className="text-sm text-muted-foreground">
                {classes.length} classes
              </div>
            </div>

            {classes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {classes.map((cls) => (
                  <ClassCard key={cls.id} cls={cls} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Leaf className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">No classes available</h3>
                <p className="text-muted-foreground mt-2">
                  This project doesn't have any available credit classes at the moment.
                </p>
              </div>
            )}
          </div>
        </div>
      </Suspense>
    </div>
  )
}
