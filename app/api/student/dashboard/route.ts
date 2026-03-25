import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getStudentBookings } from '@/lib/student-auth'

export async function GET(request: NextRequest) {
  try {
    // Get access token from cookie
    const accessToken = request.cookies.get('sb-access-token')?.value

    if (!accessToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Create authenticated client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: { headers: { Authorization: `Bearer ${accessToken}` } },
      }
    )

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
    }

    // Get student's own record
    const { data: student } = await supabase
      .from('students')
      .select('*')
      .eq('auth_user_id', user.id)
      .single()

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    // Get bookings (RLS enforces email matching)
    const bookings = await getStudentBookings(student.email)

    // Group by status
    const upcoming = bookings.filter(
      (b: any) => b.status === 'pending' || b.status === 'confirmed'
    )
    const completed = bookings.filter((b: any) => b.status === 'completed')
    const cancelled = bookings.filter((b: any) => b.status === 'cancelled')

    return NextResponse.json({
      student: {
        id: student.id,
        email: student.email,
        fullName: student.full_name,
        phone: student.phone,
      },
      bookings: {
        all: bookings,
        upcoming,
        completed,
        cancelled,
        count: {
          upcoming: upcoming.length,
          completed: completed.length,
          cancelled: cancelled.length,
        },
      },
    })
  } catch (error) {
    console.error('Dashboard error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
