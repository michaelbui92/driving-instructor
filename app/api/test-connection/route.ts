import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({
        status: 'missing_env',
        message: 'Supabase environment variables not set',
        hasUrl: !!supabaseUrl,
        hasKey: !!supabaseKey
      }, { status: 500 })
    }
    
    const client = createClient(supabaseUrl, supabaseKey)
    
    // Test connection by counting bookings
    const { data, error, count } = await client
      .from('bookings_new')
      .select('*', { count: 'exact' })
      .limit(1)
    
    if (error) {
      return NextResponse.json({
        status: 'connection_error',
        message: error.message,
        error
      }, { status: 500 })
    }
    
    return NextResponse.json({
      status: 'connected',
      message: `Supabase connection successful`,
      bookingsCount: count || 0,
      sampleData: data?.[0] || null,
      table: 'bookings_new',
      timestamp: new Date().toISOString()
    })
    
  } catch (error: any) {
    return NextResponse.json({
      status: 'exception',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 })
  }
}
