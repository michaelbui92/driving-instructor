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
    // Aggressive retry for replication lag - Supabase can have 2-5 second lag
    console.log('📊 /api/bookings query...')
    
    let data: any = null
    let error: any = null
    let attempts = 0
    const maxAttempts = 5  // Increased from 3
    const retryDelay = 1000 // Increased from 500ms
    
    while (attempts < maxAttempts) {
      attempts++
      console.log(`🔄 Attempt ${attempts}/${maxAttempts}...`)
      
      const result = await adminClient
        .from('bookings')
        .select('*', { count: 'exact', head: false })
        .order('created_at', { ascending: false, nullsFirst: false })
      
      data = result.data
      error = result.error
      
      // If we got data without error, check if it looks reasonable
      if (data && !error) {
        console.log(`✅ Got ${data.length} bookings`)
        
        // Basic sanity check: should have at least 1 booking if we know there are bookings
        // (This is a weak check, but better than nothing)
        if (data.length > 0) {
          // Log what we got for debugging
          const statusCounts = data.reduce((acc: any, b: any) => {
            acc[b.status] = (acc[b.status] || 0) + 1
            return acc
          }, {})
          console.log(`📊 Status breakdown:`, statusCounts)
          break
        } else {
          console.log(`⚠️ Got 0 bookings, will retry...`)
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