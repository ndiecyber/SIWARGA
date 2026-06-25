import { NextRequest, NextResponse } from 'next/server'
import { apiLogger } from '@/lib/logger'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    apiLogger.error({ error: body }, 'Client-side error reported')
    return NextResponse.json({ success: true })
  } catch (error) {
    apiLogger.error({ err: error }, 'Gagal menerima laporan error dari client')
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
