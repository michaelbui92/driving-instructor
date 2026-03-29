import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// SIMPLE: Create booking with minimal requirements
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('📦 Simple booking creation:', body)
    
    // Extract with defaults
    const {
      studentName = '',
      email = 'guest@example.com',
      phone = '',
      date,
      time,
      lessonType = 'single',
    } = body
    
    // ONLY require date and time
    if (!date || !time) {
      return NextResponse.json({ 
        error: 'Date and time are required',
        received: { date: !!date, time: !!time }
      }, { status: 400 })
    }
    
    // Use admin client
    const adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    
    // Create booking
    const { data, error } = await adminClient
      .from('bookings_new')
      .insert([
        {
          student_name: studentName,
          email: email,
          phone: phone,
          date: date,
          time: time,
          lesson_type: lessonType,
          status: 'pending',
        },
      ])
      .select()
    
    if (error) {
      console.error('❌ Booking creation error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    console.log('✅ Booking created:', { id: data[0]?.id })
    
    // Generate claim code for email notification (not stored in DB)
    const claimCode = Math.floor(100000 + Math.random() * 900000).toString()
    
    return NextResponse.json({ 
      success: true, 
      booking: data[0],
      claimCode, // For email notification only
      message: 'Booking created successfully'
    })
  } catch (error: any) {
    console.error('Booking creation error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}