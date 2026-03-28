import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

// TEST NEW TABLE
export async function GET(request: NextRequest) {
  try {
    const anonClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    
    // Try to query bookings_new
    const { data, error, count } = await anonClient
      .from('bookings_new')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
    
    if (error) {
      return NextResponse.json({ 
        error: error.message,
        hint: 'bookings_new table might not exist yet. Create it with SQL.'
      }, { status: 500 })
    }
    
    return NextResponse.json({
      table: 'bookings_new',
      rows: data?.length || 0,
      count,
      data: data?.map((b: any) => ({
        id: b.id.substring(0, 8),
        status: b.status,
        date: b.date,
        time: b.time,
        created_at: b.created_at
      })),
      conclusion: data && data.length > 0 
        ? '✅ NEW TABLE WORKS - No cache corruption'
        : 'Table exists but empty'
    })
    
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
