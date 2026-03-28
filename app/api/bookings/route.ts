import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

// GET ALL BOOKINGS
export async function GET(request: NextRequest) {
  try {
    const adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data, error } = await adminClient
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1000)

    if (error) {
      console.error('Bookings fetch error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const statuses = (data || []).map((b: any) => `${b.id.substring(0, 8)}:${b.status}`)
    console.log(`📤 GET /api/bookings → ${(data || []).length} bookings:`, statuses)

    const bookings = (data || []).map((b: any) => {
      let price = 45
      if (b.lesson_type === 'single') price = 55
      else if (b.lesson_type === 'package10') price = 45 * 10
      else if (b.lesson_type === 'package20') price = 45 * 20
      else if (b.lesson_type === 'test') price = 55

      return {
        id: b.id,
        studentName: b.student_name || '',
        email: b.email || '',
        phone: b.phone || '',
        date: b.date || '',
        time: b.time || '',
        lessonType: b.lesson_type || 'casual',
        status: b.status || 'pending',
        price,
        createdAt: b.created_at || new Date().toISOString(),
        archived: b.archived || false,
        originalDate: b.original_date || null,
        previousDate: b.previous_date || null,
        rescheduleHistory: b.reschedule_history || [],
        packageId: b.package_id || null,
        claimCode: b.claim_code || null,
      }
    })

    const response = NextResponse.json({ bookings })
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0')
    return response
  } catch (error: any) {
    console.error('Bookings API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
