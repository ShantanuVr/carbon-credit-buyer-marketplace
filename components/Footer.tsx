import Link from 'next/link'
import { env } from '@/lib/env'

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xs">C</span>
              </div>
              <span className="font-bold">{env.NEXT_PUBLIC_BRAND_NAME}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              A demo marketplace for carbon credit trading and retirement.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Browse</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary">
                  All Projects
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-muted-foreground hover:text-primary">
                  Project Directory
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">For Buyers</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/login" className="text-muted-foreground hover:text-primary">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/buyer/dashboard" className="text-muted-foreground hover:text-primary">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/buyer/certificates" className="text-muted-foreground hover:text-primary">
                  Certificates
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href={`${env.NEXT_PUBLIC_EXPLORER_BASE_URL}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary"
                >
                  Explorer
                </a>
              </li>
              <li>
                <a 
                  href={`${env.NEXT_PUBLIC_REGISTRY_API_URL}/docs`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary"
                >
                  API Docs
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t">
          <p className="text-sm text-muted-foreground text-center">
            © 2024 {env.NEXT_PUBLIC_BRAND_NAME}. Demo application for carbon credit marketplace.
          </p>
        </div>
      </div>
    </footer>
  )
}
