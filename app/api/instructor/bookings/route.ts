import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  try {
    // Use admin client to bypass RLS
    const adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Get all bookings
    const { data, error } = await adminClient
      .from('bookings')
      .select('*')
      .order('date', { ascending: false })

    if (error) {
      console.error('Error fetching bookings:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const response = NextResponse.json({ bookings: data || [] })
    
    // Prevent caching
    response.headers.set('Cache-Control', 'no-store, max-age=0')
    
    return response
  } catch (error: any) {
    console.error('Bookings fetch error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}