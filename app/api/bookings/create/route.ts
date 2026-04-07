import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sanitizeBookingInput, validateBookingInput } from '@/lib/api-auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Sanitize input
    const sanitized = sanitizeBookingInput(body)
    
    // Validate required fields
    const errors = validateBookingInput(sanitized)
    if (errors.length > 0) {
      return NextResponse.json(
        { error: errors.join(', ') },
        { status: 400 }
      )
    }
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    
    // Create booking
    const { data, error } = await supabase
      .from('bookings_new')
      .insert([
        {
          student_name: sanitized.studentName,
          email: sanitized.email,
          phone: sanitized.phone,
          address: sanitized.address,
          date: sanitized.date,
          time: sanitized.time,
          lesson_type: sanitized.lessonType,
          status: 'pending',
          notes: sanitized.notes,
        },
      ])
      .select()
      .single()
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    // Generate claim code for email notification
    const claimCode = Math.floor(100000 + Math.random() * 900000).toString()
    
    // Send confirmation email asynchronously
    try {
      await fetch(`${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/api/bookings/notify-confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ booking: data, claimCode })
      })
    } catch {
      // Email failure is non-critical - booking is still created
    }
    
    return NextResponse.json({ 
      success: true, 
      booking: data,
      claimCode,
      message: 'Booking created successfully! Check your email for confirmation.'
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
