import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// SIMPLE DEBUG API: Returns raw Supabase data
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Use admin client
    const adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    console.log('🔍 DEBUG API: Querying Supabase...')
    
    // Simple query, no retries
    const { data, error } = await adminClient
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('❌ DEBUG API Error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log('✅ DEBUG API: Got', data?.length, 'bookings')
    
    if (data && data.length > 0) {
      const first = data[0]
      console.log('🔍 First booking raw:', {
        id: first.id,
        status: first.status,
        statusType: typeof first.status,
        hasStatus: 'status' in first,
        allKeys: Object.keys(first),
        raw: first
      })
    }

    // Return RAW data + analysis
    const response = NextResponse.json({
      rawData: data,
      analysis: data?.map((b: any) => ({
        id: b.id,
        status: b.status,
        statusType: typeof b.status,
        hasStatus: 'status' in b,
        keys: Object.keys(b),
        // What the main API would return
        mainApiMapping: {
          id: b.id,
          studentName: b.student_name || '',
          status: b.status || 'pending',
          lessonType: b.lesson_type || 'casual'
        }
      }))
    })
    
    // No cache
    response.headers.set('Cache-Control', 'no-store, max-age=0')
    
    return response
  } catch (error: any) {
    console.error('DEBUG API error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}