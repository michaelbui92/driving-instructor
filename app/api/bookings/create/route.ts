import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const { studentName, email, phone, date, time, lessonType, lessonName, price } = await request.json()

    if (!email || !date || !time || !lessonType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const claimCode = Math.floor(100000 + Math.random() * 900000).toString()

    // Use admin client to bypass RLS
    const adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data, error } = await adminClient
      .from('bookings')
      .insert([
        {
          student_name: studentName || '',
          email: email,
          phone: phone || '',
          date: date,
          time: time,
          lesson_type: lessonType,
          status: 'pending',
          claim_code: claimCode,
        },
      ])
      .select()

    if (error) {
      console.error('Error creating booking:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, booking: data, claimCode })
  } catch (error: any) {
    console.error('Booking creation error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
