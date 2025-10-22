'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, User, LogOut, Sun, Moon } from 'lucide-react'
import { useState, useEffect } from 'react'
import { env } from '@/lib/env'

interface NavbarProps {
  user?: {
    id: string
    email: string
    role: string
    orgId: string
  } | null
  cartCount?: number
}

export function Navbar({ user, cartCount = 0 }: NavbarProps) {
  const pathname = usePathname()
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark)
    
    setIsDark(shouldBeDark)
    document.documentElement.classList.toggle('dark', shouldBeDark)
  }, [])

  const toggleTheme = () => {
    const newTheme = !isDark
    setIsDark(newTheme)
    document.documentElement.classList.toggle('dark', newTheme)
    localStorage.setItem('theme', newTheme ? 'dark' : 'light')
  }

  const isActive = (path: string) => pathname === path

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">C</span>
              </div>
              <span className="font-bold text-xl">{env.NEXT_PUBLIC_BRAND_NAME}</span>
            </Link>

            <div className="hidden md:flex items-center space-x-6">
              <Link
                href="/"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive('/') ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                Browse
              </Link>
              <Link
                href="/projects"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive('/projects') ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                Projects
              </Link>
              {user && (
                <Link
                  href="/buyer/dashboard"
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    isActive('/buyer/dashboard') ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  Dashboard
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-9 w-9"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            {user ? (
              <>
                <Link href="/buyer/cart">
                  <Button variant="ghost" size="icon" className="relative">
                    <ShoppingCart className="h-4 w-4" />
                    {cartCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">
                        {cartCount}
                      </Badge>
                    )}
                  </Button>
                </Link>

                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">{user.email}</span>
                </div>

                <form action="/api/auth/logout" method="post">
                  <Button variant="ghost" size="sm" type="submit">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </form>
              </>
            ) : (
              <Link href="/login">
                <Button>Login</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
