import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

// USE ANON KEY FOR READS - SERVICE ROLE HAS STALE DATA
export async function GET(request: NextRequest) {
  try {
    // Use ANON key for reads (fresh data) instead of service role (stale)
    const anonClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    
    // Simple query with exact count
    const { data, error, count } = await anonClient
      .from('bookings')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Bookings fetch error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    console.log(`📊 /api/bookings (anon key): Got ${data?.length || 0} bookings (total in DB: ${count})`)
    
    // Log first booking status to verify freshness
    if (data && data.length > 0) {
      console.log('First booking status:', data[0].status)
    }
    
    // Minimal transformation
    const bookings = (data || []).map((b: any) => ({
      id: b.id,
      studentName: b.student_name || '',
      email: b.email || '',
      phone: b.phone || '',
      date: b.date || '',
      time: b.time || '',
      lessonType: b.lesson_type || 'single',
      status: b.status, // Direct copy
      price: b.lesson_type === 'single' ? 55 : 45,
      createdAt: b.created_at,
      archived: b.archived || false,
      originalDate: b.original_date || null,
      previousDate: b.previous_date || null,
      rescheduleHistory: b.reschedule_history || [],
      packageId: b.package_id || null,
      claimCode: b.claim_code || null,
    }))
    
    const response = NextResponse.json({ bookings })
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0')
    return response
    
  } catch (error: any) {
    console.error('Bookings API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
