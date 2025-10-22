import { NextRequest, NextResponse } from 'next/server'
import { RegistryClient } from '@/lib/api'
import { PurchaseFormSchema } from '@/lib/types'
import { getCurrentUser } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { classId, quantity } = PurchaseFormSchema.parse(body)

    const registryClient = new RegistryClient()
    const result = await registryClient.transferCredits({
      toOrgId: user.orgId,
      classId,
      quantity,
    })

    // Create order record
    const order = {
      id: `order_${Date.now()}`,
      lines: [{ classId, quantity }],
      createdAt: new Date().toISOString(),
      transferReceiptIds: [result.receiptId || `transfer_${Date.now()}`],
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      order,
    })
  } catch (error) {
    console.error('Purchase error:', error)
    return NextResponse.json(
      { success: false, error: 'Purchase failed' },
      { status: 500 }
    )
  }
}
