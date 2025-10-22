import { NextResponse } from 'next/server'
import { HealthClient } from '@/lib/api'

export async function GET() {
  try {
    const healthClient = new HealthClient()
    const health = await healthClient.checkHealth()
    
    return NextResponse.json(health)
  } catch (error) {
    return NextResponse.json(
      { ok: false, registry: false, adapter: false },
      { status: 500 }
    )
  }
}
