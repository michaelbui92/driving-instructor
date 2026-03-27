import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// SIMPLE: Create booking with minimal requirements
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('📦 Booking creation request:', body)
    
    // Extract with defaults - ONLY date and time are required
    const {
      studentName = '',
      email = 'guest@example.com', // Default if not provided
      phone = '',
      date,
      time,
      lessonType = 'single', // Default
      lessonName,
      price,
    } = body
    
    // ONLY require date and time - everything else has defaults
    if (!date || !time) {
      console.error('❌ Missing date or time:', { date: !!date, time: !!time })
      return NextResponse.json({ 
        error: 'Date and time are required',
        details: { hasDate: !!date, hasTime: !!time }
      }, { status: 400 })
    }
    
    // Generate claim code
    const claimCode = Math.floor(100000 + Math.random() * 900000).toString()
    
    // Use admin client
    const adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    
    console.log('📝 Creating booking with:', {
      student_name: studentName || '(no name)',
      email: email || '(no email)',
      date,
      time,
      lesson_type: lessonType
    })
    
    // Create booking
    const { data, error } = await adminClient
      .from('bookings')
      .insert([
        {
          student_name: studentName,
          email: email,
          phone: phone,
          date: date,
          time: time,
          lesson_type: lessonType,
          status: 'pending',
          claim_code: claimCode,
        },
      ])
      .select()
    
    if (error) {
      console.error('❌ Booking creation error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    console.log('✅ Booking created successfully:', { 
      id: data[0]?.id,
      fullRecord: data[0]
    })
    
    return NextResponse.json({ 
      success: true, 
      booking: data[0],
      claimCode,
      message: 'Booking created successfully'
    })
  } catch (error: any) {
    console.error('Booking creation error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
