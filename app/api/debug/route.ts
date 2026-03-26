import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const hasServiceKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY
    
    console.log('🔍 Debug API called')
    console.log('📦 Environment check:', {
      supabaseUrl,
      hasServiceKey,
      timestamp: new Date().toISOString()
    })

    if (!supabaseUrl || !hasServiceKey) {
      return NextResponse.json({
        error: 'Missing environment variables',
        supabaseUrl: !!supabaseUrl,
        hasServiceKey
      })
    }

    // Test connection
    const adminClient = createClient(
      supabaseUrl,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Count bookings
    const { count, error } = await adminClient
      .from('bookings')
      .select('*', { count: 'exact', head: true })

    // Also get a sample
    const { data: sampleBookings } = await adminClient
      .from('bookings')
      .select('*')
      .limit(5)

    return NextResponse.json({
      environment: {
        supabaseUrl,
        hasServiceKey: true,
        timestamp: new Date().toISOString()
      },
      database: {
        bookingsCount: count || 0,
        error: error?.message,
        sampleBookings: sampleBookings?.map(b => ({
          id: b.id,
          student_name: b.student_name,
          email: b.email,
          date: b.date,
          status: b.status
        }))
      }
    })
  } catch (error: any) {
    console.error('❌ Debug API error:', error)
    return NextResponse.json({
      error: error.message,
      environment: {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
      }
    }, { status: 500 })
  }
}