import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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
      .select('email, auth_user_id')
      .eq('auth_user_id', user.id)
      .single()

    console.log('Cancel - Student lookup:', { 
      userEmail: user.email, 
      userId: user.id, 
      studentFound: !!student,
      studentAuthUserId: student?.auth_user_id,
      studentEmail: student?.email 
    })

    if (!student) {
      return NextResponse.json({ 
        error: 'Student not found. Please try logging out and back in.',
        details: `No student record found for auth_user_id: ${user.id}`
      }, { status: 404 })
    }

    // Fetch the booking to verify ownership
    const { data: booking, error: fetchError } = await adminClient
      .from('bookings_new')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError || !booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    // Verify email matches
    console.log('Cancel - Email check:', {
      bookingEmail: booking.email,
      studentEmail: student.email,
      match: booking.email === student.email
    })
    
    if (booking.email !== student.email) {
      return NextResponse.json({ 
        error: 'Unauthorized - email mismatch',
        details: `Booking email (${booking.email}) doesn't match student email (${student.email})`
      }, { status: 403 })
    }

    // Cancel the booking using admin client
    const { error: cancelError } = await adminClient
      .from('bookings_new')
      .update({ status: 'cancelled' })
      .eq('id', id)

    if (cancelError) {
      console.error('Cancel error:', cancelError)
      return NextResponse.json(
        { error: 'Failed to cancel booking' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Cancel booking error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
