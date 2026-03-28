import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

// BRAND NEW API - NO CACHE
export async function GET(request: NextRequest) {
  try {
    console.log('🆕 /api/bookings-fresh called - BRAND NEW ENDPOINT')
    
    const anonClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    
    // Fresh query - no retry logic
    const { data, error, count } = await anonClient
      .from('bookings')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Fresh query error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    console.log(`🆕 Fresh endpoint: ${data?.length || 0} bookings (count: ${count})`)
    
    // Log ALL bookings for debugging
    if (data && data.length > 0) {
      console.log('All bookings from fresh query:')
      data.forEach((b: any, i: number) => {
        console.log(`  ${i+1}. ${b.id.substring(0, 8)}: ${b.status}, ${b.date} ${b.time}`)
      })
    }
    
    // Same transformation as main API
    const bookings = (data || []).map((b: any) => ({
      id: b.id,
      studentName: b.student_name || '',
      email: b.email || '',
      phone: b.phone || '',
      date: b.date || '',
      time: b.time || '',
      lessonType: b.lesson_type || 'single',
      status: b.status,
      price: b.lesson_type === 'single' ? 55 : 45,
      createdAt: b.created_at,
      archived: b.archived || false,
      originalDate: b.original_date || null,
      previousDate: b.previous_date || null,
      rescheduleHistory: b.reschedule_history || [],
      packageId: b.package_id || null,
      claimCode: b.claim_code || null,
    }))
    
    const response = NextResponse.json({ 
      bookings,
      meta: {
        source: 'brand-new-endpoint',
        rows: data?.length || 0,
        count,
        timestamp: new Date().toISOString()
      }
    })
    
    // Aggressive no-cache headers
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    
    return response
    
  } catch (error: any) {
    console.error('Fresh API error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
