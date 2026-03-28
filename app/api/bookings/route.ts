import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

// GET ALL BOOKINGS
export async function GET(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    
    console.log('🔍 GET /api/bookings debug:', {
      supabaseUrl: supabaseUrl?.substring(0, 50) + '...',
      serviceKeyLength: serviceKey?.length,
      hasUrl: !!supabaseUrl,
      hasKey: !!serviceKey
    })

    const adminClient = createClient(supabaseUrl, serviceKey)

    // First, let's check what tables exist
    const { data: tables, error: tablesError } = await adminClient
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .limit(1)

    console.log('📊 Table check:', { 
      tableExists: !tablesError, 
      error: tablesError?.message,
      count: tables?.length
    })

    // Try multiple times to avoid stale read replicas
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
        .limit(1000)
      
      data = result.data
      error = result.error
      
      if (data && !error) {
        // Check if we have the expected number of bookings
        if (data.length >= 5) { // We know there are 5 bookings
          break
        }
      }
      
      if (attempts < maxAttempts) {
        console.log(`Retry ${attempts}/${maxAttempts} - got ${data?.length || 0} bookings`)
        await new Promise(resolve => setTimeout(resolve, retryDelay))
      }
    }

    if (error) {
      console.error('Bookings fetch error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Log RAW data from Supabase
    console.log(`📤 GET /api/bookings → RAW Supabase response:`, JSON.stringify(data, null, 2))
    
    // Log EVERY booking with full details
    console.log(`📤 GET /api/bookings → ${(data || []).length} bookings:`)
    ;(data || []).forEach((b: any, i: number) => {
      console.log(`  ${i+1}. ${b.id.substring(0, 8)}: status=${b.status}, date=${b.date}, email=${b.email}`)
    })

    const bookings = (data || []).map((b: any) => {
      // DEBUG: Log before transformation
      console.log(`🔍 Transforming ${b.id.substring(0, 8)}: raw status="${b.status}", type=${typeof b.status}`)
      
      let price = 45
      if (b.lesson_type === 'single') price = 55
      else if (b.lesson_type === 'package10') price = 45 * 10
      else if (b.lesson_type === 'package20') price = 45 * 20
      else if (b.lesson_type === 'test') price = 55

      const result = {
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
      
      console.log(`  → Result status="${result.status}"`)
      return result
    })

    const response = NextResponse.json({ bookings })
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0')
    return response
  } catch (error: any) {
    console.error('Bookings API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
