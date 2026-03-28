import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

// SIMPLE, CLEAN API - WORKS LIKE /test PAGE
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 /api/bookings-new called')
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    
    console.log('Supabase URL:', supabaseUrl?.substring(0, 50) + '...')
    console.log('Service key exists:', !!serviceKey)
    
    const adminClient = createClient(supabaseUrl, serviceKey)
    
    // SIMPLE query - just like /test page
    const { data, error, count } = await adminClient
      .from('bookings')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('❌ Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    console.log(`✅ Got ${data?.length || 0} bookings (count: ${count})`)
    
    if (data && data.length > 0) {
      console.log('First booking:', {
        id: data[0].id.substring(0, 8),
        status: data[0].status,
        created_at: data[0].created_at
      })
    }
    
    // Simple transformation - minimal
    const bookings = (data || []).map((b: any) => ({
      id: b.id,
      studentName: b.student_name || '',
      email: b.email || '',
      phone: b.phone || '',
      date: b.date || '',
      time: b.time || '',
      lessonType: b.lesson_type || 'single',
      status: b.status, // NO TRANSFORMATION
      price: b.lesson_type === 'single' ? 55 : 45,
      createdAt: b.created_at,
      archived: b.archived || false,
      originalDate: b.original_date || null,
      previousDate: b.previous_date || null,
      rescheduleHistory: b.reschedule_history || [],
      packageId: b.package_id || null,
      claimCode: b.claim_code || null,
    }))
    
    return NextResponse.json({ 
      bookings,
      count: data?.length,
      totalCount: count 
    })
    
  } catch (error: any) {
    console.error('❌ Unexpected error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
