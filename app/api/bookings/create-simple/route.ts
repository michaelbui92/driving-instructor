import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sanitizeString, MAX_LENGTHS, isValidDate, isValidTime } from '@/lib/api-auth'

// SIMPLE: Create booking with minimal requirements
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Sanitize and validate date/time (required fields)
    const date = sanitizeString(body.date, MAX_LENGTHS.date)
    const time = sanitizeString(body.time, MAX_LENGTHS.time)
    
    if (!date || !time) {
      return NextResponse.json({ 
        error: 'Date and time are required',
        received: { hasDate: !!date, hasTime: !!time }
      }, { status: 400 })
    }
    
    if (!isValidDate(date)) {
      return NextResponse.json({ 
        error: 'Invalid date format (use YYYY-MM-DD)' 
      }, { status: 400 })
    }
    
    if (!isValidTime(time)) {
      return NextResponse.json({ 
        error: 'Invalid time format' 
      }, { status: 400 })
    }
    
    // Sanitize optional fields
    const studentName = sanitizeString(body.studentName, MAX_LENGTHS.studentName)
    const email = sanitizeString(body.email, MAX_LENGTHS.email).toLowerCase() || 'guest@example.com'
    const phone = sanitizeString(body.phone, MAX_LENGTHS.phone)
    const lessonType = sanitizeString(body.lessonType, MAX_LENGTHS.lessonType) || 'single'
    
    // Validate lesson type
    const validLessonTypes = ['single', 'casual', 'test', 'package']
    if (!validLessonTypes.includes(lessonType)) {
      return NextResponse.json({ 
        error: 'Invalid lesson type' 
      }, { status: 400 })
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
      // Check for unique constraint violation (double-booking)
      if (error.code === '23505' || error.code === 'PGRST116') {
        return NextResponse.json({
          error: `This time slot (${date} at ${time}) is already booked. Please choose a different time.`,
        }, { status: 409 })
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    // Generate claim code for email notification
    const claimCode = Math.floor(100000 + Math.random() * 900000).toString()
    
    return NextResponse.json({ 
      success: true, 
      booking: data[0],
      claimCode,
      message: 'Booking created successfully'
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
