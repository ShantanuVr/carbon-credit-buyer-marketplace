import { cookies } from 'next/headers'
import { env } from './env'
import { AuthResponse } from './types'
import { createRegistryClient } from './api'

export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get(env.COOKIE_NAME)?.value || null
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set(env.COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
}

export async function clearAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.delete(env.COOKIE_NAME)
}

export async function getCurrentUser(): Promise<AuthResponse['user'] | null> {
  const token = await getAuthToken()
  if (!token) return null

  try {
    if (env.DEMO_MODE) {
      // In demo mode, return mock user if token exists
      return {
        id: 'user_001',
        email: 'buyer@buyerco.local',
        role: 'BUYER',
        orgId: 'org_001',
      }
    }

    const response = await fetch(`${env.NEXT_PUBLIC_REGISTRY_API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) return null

    const data = await response.json()
    return data.user
  } catch {
    return null
  }
}

export function generateCSRFToken(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}
