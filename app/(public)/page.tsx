import { Suspense } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { RegistryClient } from '@/lib/api'
import { createRegistryClient } from '@/lib/api'
import { Project, Class } from '@/lib/types'
import { formatNumber } from '@/lib/format'
import { Leaf, TrendingUp, Globe, Shield } from 'lucide-react'
import Link from 'next/link'

interface ProjectWithClasses extends Project {
  classes: Class[]
}

async function getFeaturedProjects(): Promise<ProjectWithClasses[]> {
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

    return projects.slice(0, 6).map(project => ({
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
  const topClass = project.classes.find(cls => cls.remaining > 0)

  return (
    <Card className="h-full">
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
          <div>
            <span className="text-muted-foreground">Region:</span>
            <p className="font-medium">{project.region || 'N/A'}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Country:</span>
            <p className="font-medium">{project.country || 'N/A'}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Available:</span>
            <p className="font-medium">{formatNumber(totalAvailable)}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Classes:</span>
            <p className="font-medium">{project.classes.length}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Link href={`/projects/${project.id}`} className="flex-1">
            <Button variant="outline" className="w-full">
              View Details
            </Button>
          </Link>
          {topClass && (
            <Link href={`/classes/${topClass.id}`} className="flex-1">
              <Button className="w-full">
                Buy Credits
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function StatsCard({ icon: Icon, title, value, description }: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  value: string
  description: string
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <div className="p-2 rounded-lg bg-primary/10">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="h-full">
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
  )
}

export default async function HomePage() {
  const projects = await getFeaturedProjects()

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center space-y-6 mb-12">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Carbon Credit Marketplace
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Browse, purchase, and retire carbon credits from verified projects around the world.
          Make a real impact on climate change.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/projects">
            <Button size="lg">
              Browse Projects
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="lg">
              Get Started
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatsCard
          icon={Globe}
          title="Active Projects"
          value={projects.length.toString()}
          description="Verified carbon projects"
        />
        <StatsCard
          icon={Leaf}
          title="Available Credits"
          value={formatNumber(projects.reduce((sum, p) => sum + p.classes.reduce((s, c) => s + c.remaining, 0), 0))}
          description="Credits ready for purchase"
        />
        <StatsCard
          icon={TrendingUp}
          title="Total Issued"
          value={formatNumber(projects.reduce((sum, p) => sum + p.totalIssued, 0))}
          description="Credits issued to date"
        />
        <StatsCard
          icon={Shield}
          title="Retired Credits"
          value={formatNumber(projects.reduce((sum, p) => sum + p.totalRetired, 0))}
          description="Credits permanently retired"
        />
      </div>

      {/* Featured Projects */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Featured Projects</h2>
          <p className="text-muted-foreground mt-2">
            Discover verified carbon projects with available credits
          </p>
        </div>

        <Suspense fallback={<LoadingSkeleton />}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </Suspense>

        {projects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No projects available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  )
}
