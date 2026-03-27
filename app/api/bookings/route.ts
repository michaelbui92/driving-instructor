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
    // EXTREME retry for Supabase replication lag - can be 10+ seconds!
    const url = new URL(request.url)
    const forceFresh = url.searchParams.has('force')
    
    console.log('📊 /api/bookings query (with extreme retry)...', {
      forceFresh,
      query: url.searchParams.toString()
    })
    
    let data: any = null
    let error: any = null
    let attempts = 0
    const maxAttempts = 10  // EXTREME: 10 attempts
    const retryDelay = 2000 // EXTREME: 2 seconds between
    
    // Get booking count first (for comparison)
    const { count: expectedCount } = await adminClient
      .from('bookings')
      .select('*', { count: 'exact', head: true })
    
    console.log(`🎯 Expected booking count: ${expectedCount}`)
    
    while (attempts < maxAttempts) {
      attempts++
      console.log(`🔄 Attempt ${attempts}/${maxAttempts}...`)
      
      const result = await adminClient
        .from('bookings')
        .select('*', { count: 'exact', head: false })
        .order('created_at', { ascending: false, nullsFirst: false })
      
      data = result.data
      error = result.error
      
      // If we got data without error
      if (data && !error) {
        console.log(`📊 Got ${data.length} bookings`)
        
        // Check if we got ALL expected bookings
        if (expectedCount !== null && data.length === expectedCount) {
          console.log(`✅ Got ALL ${data.length} bookings (matches expected count)`)
          
          // Log status breakdown
          const statusCounts = data.reduce((acc: any, b: any) => {
            acc[b.status] = (acc[b.status] || 0) + 1
            return acc
          }, {})
          console.log(`📈 Status breakdown:`, statusCounts)
          break
        } else {
          console.log(`⚠️ Got ${data.length}/${expectedCount} bookings, will retry...`)
        }
      } else if (error) {
        console.log(`❌ Error: ${error.message}`)
      }
      
      // Wait and retry
      if (attempts < maxAttempts) {
        console.log(`⏳ Waiting ${retryDelay}ms before retry ${attempts + 1}...`)
        await new Promise(resolve => setTimeout(resolve, retryDelay))
      }
    }
    
    // If still missing data after all retries, log warning but return what we have
    if (expectedCount !== null && data && data.length < expectedCount) {
      console.warn(`🚨 WARNING: After ${attempts} attempts, only got ${data.length}/${expectedCount} bookings`)
      console.warn(`🚨 Supabase replication lag is too high (${attempts * retryDelay / 1000} seconds)`)
    }
    
    console.log('📈 /api/bookings query result:', {
      count: data?.length,
      error: error?.message,
      attempts,
      // Log ALL booking IDs and statuses for debugging
      allBookings: data?.map((b: any) => ({ 
        id: b.id?.substring(0, 8), 
        status: b.status, 
        student_name: b.student_name,
        date: b.date 
      }))
    })
    
    // EXTREME DEBUG: Log raw data if debug param is present
    const url = new URL(request.url)
    if (url.searchParams.has('debug')) {
      console.log('🔍 DEBUG MODE - Raw data:', data)
    }

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