import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Get access token from cookie
    const accessToken = request.cookies.get('sb-access-token')?.value

    if (!accessToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Create authenticated client to get user
    const authClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: { headers: { Authorization: `Bearer ${accessToken}` } },
      }
    )

    // Get current user
    const { data: { user }, error: userError } = await authClient.auth.getUser()
    if (userError || !user || !user.email) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
    }

    // Use admin client for database operations
    const adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Get bookings for this student (include pending and confirmed, exclude cancelled)
    const { data: bookingsData, error: bookingsError } = await adminClient
      .from('bookings_new')
      .select('*')
      .eq('email', user.email)
      .neq('status', 'cancelled')
      .order('date', { ascending: false })

    if (bookingsError) {
      console.error('Bookings fetch error:', bookingsError)
      return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 })
    }

    // Format bookings for frontend
    const bookings = (bookingsData || []).map((b: any) => ({
      id: b.id,
      studentName: b.student_name,
      email: b.email,
      phone: b.phone,
      date: b.date,
      time: b.time,
      lessonType: b.lesson_type,
      status: b.status,
      price: b.lesson_type === 'single' ? 55 : 45, // Simple pricing
      createdAt: b.created_at,
      claimCode: b.claim_code,
    }))

    // Simple response
    const response = NextResponse.json({
      student: {
        email: user.email,
        fullName: user.email.split('@')[0], // Simple name from email
      },
      bookings: {
        all: bookings,
        upcoming: bookings.filter(b => b.status === 'pending' || b.status === 'confirmed'),
        completed: bookings.filter(b => b.status === 'completed'),
        cancelled: [],
        count: {
          upcoming: bookings.filter(b => b.status === 'pending' || b.status === 'confirmed').length,
          completed: bookings.filter(b => b.status === 'completed').length,
          cancelled: 0,
        },
      },
    })
    
    // Prevent caching
    response.headers.set('Cache-Control', 'no-store, max-age=0')
    
    return response
  } catch (error: any) {
    console.error('Dashboard error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}