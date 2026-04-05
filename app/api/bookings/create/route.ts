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
      notes = '',
    } = body
    
    // ONLY require date and time - everything else has defaults
    if (!date || !time) {
      console.error('❌ Missing date or time:', { date: !!date, time: !!time })
      return NextResponse.json({ 
        error: 'Date and time are required',
        details: { hasDate: !!date, hasTime: !!time }
      }, { status: 400 })
    }
    
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
          notes: notes || null,
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
    
    // Generate claim code for email notification
    const claimCode = Math.floor(100000 + Math.random() * 900000).toString()
    
    // Send confirmation email asynchronously
    try {
      await fetch(`${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/api/bookings/notify-confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ booking: data[0], claimCode })
      })
      console.log('📧 Confirmation email sent for booking', data[0]?.id)
    } catch (emailError) {
      console.error('⚠️ Failed to send confirmation email (booking still created):', emailError)
      // Don't fail the booking if email fails
    }
    
    return NextResponse.json({ 
      success: true, 
      booking: data[0],
      claimCode,
      message: 'Booking created successfully! Check your email for confirmation.'
    })
  } catch (error: any) {
    console.error('Booking creation error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
