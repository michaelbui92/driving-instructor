import { NextRequest, NextResponse } from 'next/server'
import { getDBClient } from '@/lib/db-client'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: bookingId } = await params
    const { status } = await request.json()

    if (!status || !['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const db = getDBClient()

    const result = await db
      .from('bookings')
      .update({ status })
      .eq('id', bookingId)

    if (result.error) {
      console.error('Error updating booking status:', result.error)
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({ success: true, booking: result.data?.[0] || result.data })
  } catch (error: any) {
    console.error('Booking status update error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
