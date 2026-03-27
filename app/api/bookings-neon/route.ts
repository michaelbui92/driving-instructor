import { NextRequest, NextResponse } from 'next/server'
import { getAllBookings, testConnection } from '@/lib/neon'

// TEST API: Uses Neon instead of Supabase
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 /api/bookings-neon: Testing Neon connection...')
    
    // Test connection first
    const connectionTest = await testConnection()
    if (!connectionTest.success) {
      console.error('❌ Neon connection failed:', connectionTest.error)
      return NextResponse.json({ 
        error: 'Neon database connection failed',
        details: connectionTest.error 
      }, { status: 500 })
    }
    
    console.log('✅ Neon connection successful:', connectionTest.time)
    
    // Get all bookings from Neon
    const bookings = await getAllBookings()
    
    console.log(`📊 Neon bookings: ${bookings.length} found`)
    
    // Format for frontend (same format as Supabase API)
    const formattedBookings = bookings.map((b: any) => ({
      id: b.id,
      studentName: b.student_name || '',
      email: b.email || '',
      phone: b.phone || '',
      date: b.date || '',
      time: b.time || '',
      lessonType: b.lesson_type || 'casual',
      status: b.status || 'pending',
      price: b.lesson_type === 'single' ? 55 : 45,
      createdAt: b.created_at || new Date().toISOString(),
    }))
    
    const response = NextResponse.json({ 
      bookings: formattedBookings,
      debug: {
        source: 'neon',
        connection: connectionTest,
        count: bookings.length,
        rawCount: bookings.length
      }
    })
    
    // No cache
    response.headers.set('Cache-Control', 'no-store, max-age=0')
    
    return response
  } catch (error: any) {
    console.error('Neon API error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 })
  }
}