import { NextRequest, NextResponse } from 'next/server'
import { getDBClient } from '@/lib/db-client'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: bookingId } = await params
    const body = await request.json()
    const { instructor_notes } = body

    const db = getDBClient()

    const result = await db
      .from('bookings_new')
      .update({ instructor_notes })
      .eq('id', bookingId)

    if (result.error) {
      console.error('Error updating instructor notes:', result.error)
      return NextResponse.json({ error: result.error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Instructor notes update error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
