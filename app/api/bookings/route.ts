import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')
    
    let query = supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (date) {
      query = query.eq('date', date)
    }
    
    const { data, error } = await query
    
    if (error) {
      console.error('Error fetching bookings:', error)
      return NextResponse.json(
        { error: 'Failed to fetch bookings' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ bookings: data })
  } catch (error) {
    console.error('Error in bookings API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const bookingData = await request.json()
    
    // Validate required fields
    const requiredFields = ['student_name', 'email', 'phone', 'date', 'time', 'lesson_type']
    for (const field of requiredFields) {
      if (!bookingData[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }
    
    // Check if slot is already booked
    const { data: existingBookings, error: checkError } = await supabase
      .from('bookings')
      .select('*')
      .eq('date', bookingData.date)
      .eq('time', bookingData.time)
      .eq('status', 'confirmed')
    
    if (checkError) {
      console.error('Error checking existing bookings:', checkError)
      return NextResponse.json(
        { error: 'Failed to check availability' },
        { status: 500 }
      )
    }
    
    if (existingBookings && existingBookings.length > 0) {
      return NextResponse.json(
        { error: 'This time slot is already booked' },
        { status: 409 }
      )
    }
    
    // Create booking
    const { data, error } = await supabase
      .from('bookings')
      .insert([{
        student_name: bookingData.student_name,
        email: bookingData.email,
        phone: bookingData.phone,
        date: bookingData.date,
        time: bookingData.time,
        lesson_type: bookingData.lesson_type,
        status: 'pending',
        created_at: new Date().toISOString()
      }])
      .select()
    
    if (error) {
      console.error('Error creating booking:', error)
      return NextResponse.json(
        { error: 'Failed to create booking' },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { 
        success: true, 
        booking: data[0],
        message: 'Booking created successfully!'
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error in bookings API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}