import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

// SIMPLE FIXED VERSION
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

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // SIMPLE transformation - just copy the status directly
    const bookings = (data || []).map((b: any) => ({
      id: b.id,
      studentName: b.student_name || '',
      email: b.email || '',
      phone: b.phone || '',
      date: b.date || '',
      time: b.time || '',
      lessonType: b.lesson_type || 'casual',
      status: b.status, // NO DEFAULT, just copy
      price: b.lesson_type === 'single' ? 55 : 45,
      createdAt: b.created_at,
      archived: b.archived || false,
      originalDate: b.original_date || null,
      previousDate: b.previous_date || null,
      rescheduleHistory: b.reschedule_history || [],
      packageId: b.package_id || null,
      claimCode: b.claim_code || null,
    }))

    // Log first booking to verify
    if (bookings.length > 0) {
      console.log('✅ Fixed route - first booking:', {
        id: bookings[0].id.substring(0, 8),
        rawStatus: data?.[0]?.status,
        transformedStatus: bookings[0].status
      })
    }

    return NextResponse.json({ bookings })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
