import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sanitizeString, MAX_LENGTHS, isValidDate } from '@/lib/api-auth'

export const dynamic = 'force-dynamic'

// UPDATE booking status - This is a public route for students (PIN-based auth is done client-side)
// For instructor calls, the instructor portal should use /api/instructor/bookings/[id]/status instead
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: bookingId } = await params
    const body = await request.json()
    const { status } = body

    // Validate status
    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed']
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    // Validate booking ID
    if (!bookingId || typeof bookingId !== 'string' || bookingId.length > 100) {
      return NextResponse.json({ error: 'Invalid booking ID' }, { status: 400 })
    }

    const adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Update and get the returned row in one shot
    const { data, error } = await adminClient
      .from('bookings_new')
      .update({ status })
      .eq('id', bookingId)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      booking: {
        id: data.id,
        studentName: sanitizeString(data.student_name, MAX_LENGTHS.studentName),
        email: sanitizeString(data.email, MAX_LENGTHS.email),
        phone: sanitizeString(data.phone, MAX_LENGTHS.phone),
        date: sanitizeString(data.date, MAX_LENGTHS.date),
        time: sanitizeString(data.time, MAX_LENGTHS.time),
        lessonType: sanitizeString(data.lesson_type, MAX_LENGTHS.lessonType),
        status: data.status,
        createdAt: data.created_at,
        archived: data.archived || false,
      }
    })

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
