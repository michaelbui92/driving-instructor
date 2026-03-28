import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

// UPDATE booking status
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: bookingId } = await params
    const { status } = await request.json()

    console.log('🔄 Status update:', { bookingId, status })

    if (!status || !['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
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
      console.error('❌ Update error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    console.log('✅ Update succeeded:', { id: data.id, status: data.status })

    return NextResponse.json({
      success: true,
      booking: {
        id: data.id,
        studentName: data.student_name || '',
        email: data.email || '',
        phone: data.phone || '',
        date: data.date || '',
        time: data.time || '',
        lessonType: data.lesson_type || 'casual',
        status: data.status,
        createdAt: data.created_at,
        archived: data.archived || false,
        originalDate: data.original_date || null,
        previousDate: data.previous_date || null,
        rescheduleHistory: data.reschedule_history || [],
        packageId: data.package_id || null,
        claimCode: data.claim_code || null,
      }
    })

  } catch (error: any) {
    console.error('❌ Unexpected error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
