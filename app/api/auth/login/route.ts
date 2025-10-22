import { NextRequest, NextResponse } from 'next/server'
import { RegistryClient } from '@/lib/api'
import { AuthLoginSchema } from '@/lib/types'
import { setAuthCookie } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = AuthLoginSchema.parse(body)

    const registryClient = new RegistryClient()
    const response = await registryClient.login(email, password)

    // Set httpOnly cookie
    await setAuthCookie(response.token)

    return NextResponse.json({
      success: true,
      user: response.user,
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, error: 'Invalid credentials' },
      { status: 401 }
    )
  }
}
