import { Suspense } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { RegistryClient } from '@/lib/api'
import { createRegistryClient } from '@/lib/api'
import { Project, Class } from '@/lib/types'
import { formatNumber, formatDate } from '@/lib/format'
import { Search, Filter, Globe, Calendar, Leaf } from 'lucide-react'
import Link from 'next/link'

interface ProjectWithClasses extends Project {
  classes: Class[]
}

async function getAllProjects(): Promise<ProjectWithClasses[]> {
  try {
    const registryClient = createRegistryClient()
    const [projects, classes] = await Promise.all([
      registryClient.getProjects('ACTIVE'),
      registryClient.getClasses(true),
    ])

    // Group classes by project
    const classesByProject = classes.reduce((acc, cls) => {
      if (!acc[cls.projectId]) acc[cls.projectId] = []
      acc[cls.projectId].push(cls)
      return acc
    }, {} as Record<string, Class[]>)

    return projects.map(project => ({
      ...project,
      classes: classesByProject[project.id] || [],
    }))
  } catch (error) {
    console.error('Error fetching projects:', error)
    return []
  }
}

function ProjectCard({ project }: { project: ProjectWithClasses }) {
  const totalAvailable = project.classes.reduce((sum, cls) => sum + cls.remaining, 0)
  const totalIssued = project.classes.reduce((sum, cls) => sum + cls.issued, 0)
  const totalRetired = project.classes.reduce((sum, cls) => sum + cls.retired, 0)

  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl">{project.name}</CardTitle>
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
              <p className="font-medium">{formatDate(project.createdAt)}</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Available Credits:</span>
            <span className="font-medium">{formatNumber(totalAvailable)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total Issued:</span>
            <span className="font-medium">{formatNumber(totalIssued)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total Retired:</span>
            <span className="font-medium">{formatNumber(totalRetired)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Active Classes:</span>
            <span className="font-medium">{project.classes.length}</span>
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
          {totalAvailable > 0 && (
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

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 9 }).map((_, i) => (
        <Card key={i} className="h-full">
          <CardHeader>
            <div className="space-y-2">
              <div className="h-6 bg-muted rounded animate-pulse" />
              <div className="h-4 bg-muted rounded animate-pulse" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 2 }).map((_, j) => (
                <div key={j} className="space-y-1">
                  <div className="h-3 bg-muted rounded animate-pulse" />
                  <div className="h-4 bg-muted rounded animate-pulse" />
                </div>
              ))}
            </div>
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="flex justify-between">
                  <div className="h-4 bg-muted rounded animate-pulse w-24" />
                  <div className="h-4 bg-muted rounded animate-pulse w-16" />
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
  )
}

export default async function ProjectsPage() {
  const projects = await getAllProjects()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Carbon Credit Projects</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Browse verified carbon projects and discover available credits for purchase
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search projects..."
                className="pl-10 pr-4 py-2 border border-input rounded-md bg-background text-sm"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            {projects.length} active projects
          </div>
        </div>

        {/* Projects Grid */}
        <Suspense fallback={<LoadingSkeleton />}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </Suspense>

        {projects.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <Leaf className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">No projects found</h3>
            <p className="text-muted-foreground mt-2">
              There are no active projects available at the moment.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
