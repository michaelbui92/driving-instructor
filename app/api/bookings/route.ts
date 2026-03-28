import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

// GET ALL BOOKINGS - FIXED VERSION
export async function GET(request: NextRequest) {
  try {
    const adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Retry logic to avoid Supabase read replica lag
    let data: any = null
    let error: any = null
    let attempts = 0
    const maxAttempts = 3
    const retryDelay = 1000
    
    while (attempts < maxAttempts) {
      attempts++
      
      const result = await adminClient
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false })
      
      data = result.data
      error = result.error
      
      if (data && !error) {
        // Check if we got at least some data
        if (data.length > 0) {
          console.log(`✅ Attempt ${attempts}/${maxAttempts}: Got ${data.length} bookings`)
          break
        }
      }
      
      if (attempts < maxAttempts) {
        console.log(`🔄 Retry ${attempts}/${maxAttempts} - got ${data?.length || 0} bookings`)
        await new Promise(resolve => setTimeout(resolve, retryDelay))
      }
    }

    if (error) {
      console.error('Bookings fetch error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Log what we got
    console.log(`📊 Final: ${data?.length || 0} bookings from Supabase`)

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
        status: b.status, // FIXED: No default, just copy
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
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0')
    return response
  } catch (error: any) {
    console.error('Bookings API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
