import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

// TEST: Query test_bookings_debug table
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 /api/test-bookings called')
    
    const anonClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    
    // Query the TEST table
    const { data, error, count } = await anonClient
      .from('test_bookings_debug')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('❌ Test query error:', error)
      return NextResponse.json({ 
        error: error.message,
        hint: 'Make sure test_bookings_debug table exists'
      }, { status: 500 })
    }
    
    console.log(`✅ Test query: Got ${data?.length || 0} rows (count: ${count})`)
    
    // Also query the REAL bookings table for comparison
    const { data: realData, error: realError, count: realCount } = await anonClient
      .from('bookings')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
    
    return NextResponse.json({
      test: {
        table: 'test_bookings_debug',
        rows: data?.length || 0,
        count,
        data: data?.map((b: any) => ({
          id: b.id.substring(0, 8),
          student_name: b.student_name,
          status: b.status,
          created_at: b.created_at
        }))
      },
      real: {
        table: 'bookings',
        rows: realData?.length || 0,
        count: realCount,
        data: realData?.map((b: any) => ({
          id: b.id.substring(0, 8),
          status: b.status,
          created_at: b.created_at
        }))
      },
      comparison: {
        testTableFresh: data && data.length > 0 ? 'YES' : 'NO',
        realTableFresh: realData && realData.length === 2 ? 'YES (should be 2)' : `NO (got ${realData?.length || 0})`,
        cacheIssue: realData && realData.length > 2 ? 'YES - real table returning old cached data' : 'NO'
      }
    })
    
  } catch (error: any) {
    console.error('❌ Unexpected error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
