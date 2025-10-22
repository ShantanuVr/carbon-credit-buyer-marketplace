import { Card, CardContent } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={`animate-pulse rounded-md bg-muted ${className}`} />
  )
}

export function LoadingSpinner({ size = 'default' }: { size?: 'sm' | 'default' | 'lg' }) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    default: 'h-6 w-6',
    lg: 'h-8 w-8',
  }

  return (
    <Loader2 className={`animate-spin ${sizeClasses[size]}`} />
  )
}

export function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  action 
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  action?: React.ReactNode
}) {
  return (
    <div className="text-center py-12">
      <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
        <Icon className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="text-muted-foreground mt-2">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

export function ErrorState({ 
  title = 'Something went wrong', 
  description = 'An error occurred while loading this content.',
  onRetry 
}: {
  title?: string
  description?: string
  onRetry?: () => void
}) {
  return (
    <Card>
      <CardContent className="p-12 text-center">
        <div className="mx-auto h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
          <svg className="h-6 w-6 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium">{title}</h3>
        <p className="text-muted-foreground mt-2">{description}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-4 text-sm text-primary hover:underline"
          >
            Try again
          </button>
        )}
      </CardContent>
    </Card>
  )
}
