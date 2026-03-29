import { NextRequest, NextResponse } from 'next/server'
import { getDBClient } from '@/lib/db-client'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: bookingId } = await params
    const db = getDBClient()

    const result = await db
      .from('bookings')
      .delete()
      .eq('id', bookingId)

    if (result.error) {
      console.error('Error deleting booking:', result.error)
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Booking delete error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
