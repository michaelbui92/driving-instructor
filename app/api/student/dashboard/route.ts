import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

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

    // Get student's own record (create if doesn't exist)
    const adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    let { data: student } = await adminClient
      .from('students')
      .select('*')
      .eq('auth_user_id', user.id)
      .single()

    // Create student record if doesn't exist
    if (!student) {
      console.log('Creating student for user:', user.id, user.email)
      const { data: newStudent, error: createError } = await adminClient
        .from('students')
        .insert({ auth_user_id: user.id, email: user.email } as any)
        .select()
        .single()

      if (createError) {
        console.error('Error creating student:', createError)
        return NextResponse.json({ error: 'Failed to create student record', details: createError.message }, { status: 500 })
      }

      student = newStudent
    }

    // Get bookings using admin client to bypass RLS
    const { data: bookingsData, error: bookingsError } = await adminClient
      .from('bookings')
      .select('*')
      .eq('email', student.email)
      .order('date', { ascending: false })

    if (bookingsError) {
      console.error('Error fetching bookings:', bookingsError)
    }

    const bookings = (bookingsData || []).map((b: any) => ({
      id: b.id,
      studentName: b.student_name,
      email: b.email,
      phone: b.phone,
      date: b.date,
      time: b.time,
      lessonType: b.lesson_type,
      status: b.status,
      price: 0,
      createdAt: b.created_at,
      claimCode: b.claim_code,
    }))

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
  } catch (error: any) {
    console.error('Dashboard error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error?.message || String(error) },
      { status: 500 }
    )
  }
}
