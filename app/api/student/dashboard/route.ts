import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  try {
    // Get access token from cookie
    const accessToken = request.cookies.get('sb-access-token')?.value

    if (!accessToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // DEBUG: Log environment info
    console.log('🚀 Dashboard API called')
    console.log('📦 Environment:', {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      timestamp: new Date().toISOString()
    })

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

    // Use admin client for all database operations
    const adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    console.log('Dashboard - user id:', user.id, 'email:', user.email)

    // Look up student by email (more reliable than auth_user_id)
    let { data: student } = await adminClient
      .from('students')
      .select('*')
      .eq('email', user.email)
      .single()

    console.log('Found student:', student)

    // Create student record if doesn't exist
    if (!student) {
      console.log('Creating student for email:', user.email, 'auth_user_id:', user.id)
      const { data: newStudent, error: createError } = await adminClient
        .from('students')
        .insert({ 
          email: user.email,
          auth_user_id: user.id 
        } as any)
        .select()
        .single()

      if (createError) {
        console.error('Error creating student:', createError)
        return NextResponse.json({ error: 'Failed to create student record', details: createError.message }, { status: 500 })
      }

      student = newStudent
    } else if (!student.auth_user_id) {
      // Update existing student with auth_user_id if missing
      console.log('Updating student with auth_user_id:', user.id)
      const { data: updatedStudent, error: updateError } = await adminClient
        .from('students')
        .update({ auth_user_id: user.id })
        .eq('id', student.id)
        .select()
        .single()
      
      if (!updateError && updatedStudent) {
        student = updatedStudent
      }
    }

    // Get bookings using admin client to bypass RLS
    console.log('🔍 Student querying bookings for email:', user.email)
    
    // First, let's check what emails actually exist in bookings
    const { data: allBookings } = await adminClient
      .from('bookings')
      .select('email')
      .limit(100)
    
    // Get unique emails (compatible with older TypeScript target)
    const emails = allBookings?.map(b => b.email) || []
    const uniqueEmails = emails.filter((email, index) => emails.indexOf(email) === index)
    
    console.log('📧 All unique emails in bookings table:', {
      uniqueEmails: uniqueEmails,
      totalBookings: allBookings?.length
    })
    
    // Now query for this specific user's email
    const { data: bookingsData, error: bookingsError } = await adminClient
      .from('bookings')
      .select('*')
      .eq('email', user.email)
      .order('date', { ascending: false })

    console.log('📊 Student bookings query result:', {
      queryEmail: user.email,
      foundCount: bookingsData?.length,
      error: bookingsError?.message,
      bookingsFound: bookingsData?.map(b => ({
        id: b.id,
        student_name: b.student_name,
        email: b.email,
        date: b.date,
        status: b.status
      }))
    })
    
    // Also try case-insensitive search
    console.log('🔎 Trying case-insensitive search...')
    const { data: allBookingsDetailed } = await adminClient
      .from('bookings')
      .select('*')
      .limit(50)
    
    const caseInsensitiveMatches = allBookingsDetailed?.filter(b => 
      b.email.toLowerCase() === user.email.toLowerCase()
    )
    
    console.log('🎯 Case-insensitive matches:', {
      count: caseInsensitiveMatches?.length,
      matches: caseInsensitiveMatches?.map(b => ({
        email: b.email,
        expected: user.email,
        match: b.email.toLowerCase() === user.email.toLowerCase()
      }))
    })

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

    const response = NextResponse.json({
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
    
    // Prevent ALL caching - aggressive headers
    // Vercel-specific: https://vercel.com/docs/edge-network/caching
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    response.headers.set('Surrogate-Control', 'no-store')
    response.headers.set('CDN-Cache-Control', 'no-store')
    response.headers.set('Vercel-CDN-Cache-Control', 'no-store')
    
    return response
  } catch (error: any) {
    console.error('Dashboard error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error?.message || String(error) },
      { status: 500 }
    )
  }
}
