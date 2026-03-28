import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Force dynamic rendering - never cache
export const dynamic = 'force-dynamic'

// SIMPLE API: Returns ALL bookings for everyone
export async function GET(request: NextRequest) {
  try {
    // Use admin client to bypass RLS - show everything
    const adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Get booking count first
    const { count: expectedCount } = await adminClient
      .from('bookings')
      .select('*', { count: 'exact', head: true })
    
    // Fetch bookings with retry for Supabase replication lag
    let data: any = null
    let error: any = null
    let attempts = 0
    const maxAttempts = 5
    const retryDelay = 1000
    
    while (attempts < maxAttempts) {
      attempts++
      
      const result = await adminClient
        .from('bookings')
        .select('*', { count: 'exact', head: false })
        .order('created_at', { ascending: false })
      
      data = result.data
      error = result.error
      
      if (data && !error && (expectedCount === null || data.length === expectedCount)) {
        break
      }
      
      if (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, retryDelay))
      }
    }

    if (error) {
      console.error('Bookings fetch error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Debug: log raw data statuses
    const statuses = (data || []).map((b: any) => ({ id: b.id.substring(0, 8), status: b.status }))
    console.log(`📤 GET /api/bookings → ${(data || []).length} bookings, statuses:`, JSON.stringify(statuses))

    // Format for frontend — include ALL fields both portals need
    const bookings = (data || []).map((b: any) => {
      // Derive price from lesson_type
      let price = 45
      if (b.lesson_type === 'single') price = 55
      else if (b.lesson_type === 'package10') price = 45 * 10
      else if (b.lesson_type === 'package20') price = 45 * 20
      else if (b.lesson_type === 'test') price = 55

      return {
        id: b.id,
        studentName: b.student_name || '',
        email: b.email || '',
        phone: b.phone || '',
        date: b.date || '',
        time: b.time || '',
        lessonType: b.lesson_type || 'casual',
        status: b.status || 'pending',
        price,
        createdAt: b.created_at || new Date().toISOString(),
        archived: b.archived || false,
        originalDate: b.original_date || null,
        previousDate: b.previous_date || null,
        rescheduleHistory: b.reschedule_history || [],
        packageId: b.package_id || null,
        claimCode: b.claim_code || null,
      }
    })

    const response = NextResponse.json({ bookings })
    
    // Aggressive no-cache headers for Vercel CDN + browser
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    response.headers.set('Vary', '*')
    
    return response
  } catch (error: any) {
    console.error('Bookings API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
