import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { newDate, newTime } = await request.json()

    if (!newDate || !newTime) {
      return NextResponse.json(
        { error: 'New date and time are required' },
        { status: 400 }
      )
    }

    const accessToken = request.cookies.get('sb-access-token')?.value
    if (!accessToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Create authenticated client to verify user
    const authClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: { headers: { Authorization: `Bearer ${accessToken}` } },
      }
    )

    // Get current user
    const { data: { user } } = await authClient.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
    }

    // Use admin client for database operations (bypass RLS)
    const adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Get student's email using admin client
    const { data: student } = await adminClient
      .from('students')
      .select('email')
      .eq('auth_user_id', user.id)
      .single()

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    // Fetch the booking to verify ownership
    const { data: booking } = await adminClient
      .from('bookings_new')
      .select('*')
      .eq('id', id)
      .single()

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    if (booking.email !== student.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    if (booking.status === 'cancelled' || booking.status === 'completed') {
      return NextResponse.json(
        { error: 'Cannot reschedule a cancelled or completed booking' },
        { status: 400 }
      )
    }

    // Update the booking to pending - instructor needs to confirm
    const { error: updateError } = await adminClient
      .from('bookings_new')
      .update({ date: newDate, time: newTime, status: 'pending' })
      .eq('id', id)

    if (updateError) {
      console.error('Reschedule error:', updateError)
      return NextResponse.json(
        { error: 'Failed to reschedule booking' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Reschedule booking error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
