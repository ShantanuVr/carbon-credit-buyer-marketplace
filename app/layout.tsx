import '@/styles/globals.css'
import type { Metadata } from 'next'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { getCurrentUser } from '@/lib/auth'

export const metadata: Metadata = {
  title: 'Carbon Market (Demo)',
  description: 'A demo marketplace for carbon credit trading and retirement',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Navbar user={user} />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}