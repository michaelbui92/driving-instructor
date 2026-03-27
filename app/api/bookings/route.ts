import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// SIMPLE API: Returns ALL bookings for everyone
// Force dynamic rendering - never cache
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Use admin client to bypass RLS - show everything
    const adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Get ALL bookings, newest first
    // Simple approach: just fetch once, Supabase replication lag is usually minimal
    // If there are issues, we'll see them in logs and can add retry logic back
    console.log('📊 /api/bookings query...')
    
    const result = await adminClient
      .from('bookings')
      .select('*', { count: 'exact', head: false })
      .order('created_at', { ascending: false, nullsFirst: false })
    
    const data = result.data
    const error = result.error
    
    console.log('📈 /api/bookings query result:', {
      count: data?.length,
      error: error?.message,
      // Log ALL booking IDs and statuses
      allBookings: data?.map((b: any) => ({ id: b.id, status: b.status, date: b.date, time: b.time }))
    })

    if (error) {
      console.error('Bookings fetch error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Format for frontend - use EXACT database field names
    const bookings = (data || []).map((b: any) => ({
      id: b.id,
      studentName: b.student_name || '',  // database field is student_name
      email: b.email || '',
      phone: b.phone || '',
      date: b.date || '',
      time: b.time || '',
      lessonType: b.lesson_type || 'casual',  // database field is lesson_type
      status: b.status || 'pending',
      price: b.lesson_type === 'single' ? 55 : 45,
      createdAt: b.created_at || new Date().toISOString(),
    }))

    const response = NextResponse.json({ bookings })
    
    // AGGRESSIVE NO-CACHE for Vercel Edge Network
    // https://vercel.com/docs/edge-network/caching
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    response.headers.set('Surrogate-Control', 'no-store')
    response.headers.set('CDN-Cache-Control', 'no-store')
    response.headers.set('Vercel-CDN-Cache-Control', 'no-store')
    
    return response
  } catch (error: any) {
    console.error('Bookings API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}