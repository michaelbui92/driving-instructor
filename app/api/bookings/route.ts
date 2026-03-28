import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

// USE ANON KEY FOR READS - SERVICE ROLE HAS STALE DATA
export async function GET(request: NextRequest) {
  try {
    // Use ANON key for reads
    const anonClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    
    // AGGRESSIVE retry for Supabase replication lag
    let data: any = null
    let error: any = null
    let count: number = 0
    let attempts = 0
    const maxAttempts = 5
    const retryDelay = 2000  // 2 seconds
    
    while (attempts < maxAttempts) {
      attempts++
      
      const result = await anonClient
        .from('bookings')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
      
      data = result.data
      error = result.error
      count = result.count || 0
      
      console.log(`Attempt ${attempts}/${maxAttempts}: Got ${data?.length || 0} bookings (count: ${count})`)
      
      // If we got the expected count OR this is our last attempt, break
      if (data && count > 0 && data.length === count) {
        console.log(`✅ Got all ${count} bookings`)
        break
      }
      
      if (attempts < maxAttempts) {
        console.log(`🔄 Retrying in ${retryDelay}ms...`)
        await new Promise(resolve => setTimeout(resolve, retryDelay))
      }
    }
    
    if (error) {
      console.error('Bookings fetch error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    console.log(`📊 Final: ${data?.length || 0} bookings (DB says: ${count})`)
    
    if (count > 0 && data?.length !== count) {
      console.warn(`⚠️ WARNING: Missing ${count - (data?.length || 0)} bookings due to replication lag`)
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
