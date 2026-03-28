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
    
    // TRY bookings_new FIRST (fresh table), fall back to bookings
    let tableName = 'bookings_new'
    let data: any = null
    let error: any = null
    
    const result = await anonClient
      .from(tableName)
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
    
    data = result.data
    error = result.error
    
    // If bookings_new doesn't exist or is empty, try old table
    if (error || !data || data.length === 0) {
      console.log(`bookings_new not available, trying bookings...`)
      const oldResult = await anonClient
        .from('bookings')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
      
      data = oldResult.data
      error = oldResult.error
      tableName = 'bookings'
    }
    
    if (error) {
      console.error('Bookings fetch error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    console.log(`📊 Using table "${tableName}": ${data?.length || 0} bookings`)
    
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
