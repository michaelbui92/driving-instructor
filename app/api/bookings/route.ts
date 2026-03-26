import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// SIMPLE API: Returns ALL bookings for everyone
export async function GET(request: NextRequest) {
  try {
    // Use admin client to bypass RLS - show everything
    const adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Get ALL bookings, newest first
    const { data, error } = await adminClient
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Bookings fetch error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Format for frontend
    const bookings = (data || []).map((b: any) => ({
      id: b.id,
      studentName: b.student_name,
      email: b.email,
      phone: b.phone,
      date: b.date,
      time: b.time,
      lessonType: b.lesson_type,
      status: b.status,
      price: b.lesson_type === 'single' ? 55 : 45,
      createdAt: b.created_at,
    }))

    const response = NextResponse.json({ bookings })
    
    // NO CACHING - fresh data every time
    response.headers.set('Cache-Control', 'no-store, max-age=0')
    
    return response
  } catch (error: any) {
    console.error('Bookings API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}