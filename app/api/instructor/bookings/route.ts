import { NextRequest, NextResponse } from 'next/server'
import { getDBClient } from '@/lib/db-client'

export async function GET(request: NextRequest) {
  try {
    const db = getDBClient()
    
    // Get all bookings ordered by date descending
    const result = await db
      .from('bookings')
      .select('*')
      .order('date', { ascending: false })
    
    if (result.error) {
      console.error('Error fetching bookings:', result.error)
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    const response = NextResponse.json({ bookings: result.data || [] })
    response.headers.set('Cache-Control', 'no-store, max-age=0')
    
    return response
  } catch (error: any) {
    console.error('Bookings fetch error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
