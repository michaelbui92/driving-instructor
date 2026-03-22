import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')
    
    if (!date) {
      return NextResponse.json(
        { error: 'Date parameter is required' },
        { status: 400 }
      )
    }
    
    // Parse the date to get day of week
    const dateObj = new Date(date)
    const dayOfWeek = dateObj.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
    
    // Get availability rules for this day
    const { data: rules, error: rulesError } = await supabase
      .from('availability_rules')
      .select('*')
      .or(`day_type.eq.${dayOfWeek},day_type.eq.all`)
      .order('priority', { ascending: true })
    
    if (rulesError) {
      console.error('Error fetching availability rules:', rulesError)
      return NextResponse.json(
        { error: 'Failed to fetch availability rules' },
        { status: 500 }
      )
    }
    
    // Get existing bookings for this date
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('*')
      .eq('date', date)
      .eq('status', 'confirmed')
    
    if (bookingsError) {
      console.error('Error fetching bookings:', bookingsError)
      return NextResponse.json(
        { error: 'Failed to fetch bookings' },
        { status: 500 }
      )
    }
    
    // Generate time slots based on rules
    const bookedTimes = bookings?.map(b => b.time) || []
    const availableSlots: string[] = []
    
    // Default time slots if no rules found
    if (!rules || rules.length === 0) {
      // Default business hours
      const defaultSlots = [
        '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'
      ]
      
      if (dayOfWeek === 'saturday') {
        defaultSlots.push('12:00')
        defaultSlots.splice(defaultSlots.indexOf('17:00'), 1)
      }
      
      availableSlots.push(...defaultSlots.filter(slot => !bookedTimes.includes(slot)))
    } else {
      // Generate slots based on rules
      for (const rule of rules) {
        if (!rule.start_time || !rule.end_time) continue
        
        // Simple time slot generation (every hour)
        const startHour = parseInt(rule.start_time.split(':')[0])
        const endHour = parseInt(rule.end_time.split(':')[0])
        
        for (let hour = startHour; hour < endHour; hour++) {
          const timeSlot = `${hour.toString().padStart(2, '0')}:00`
          if (!bookedTimes.includes(timeSlot)) {
            availableSlots.push(timeSlot)
          }
        }
      }
    }
    
    // Remove duplicates and sort
    const uniqueSlots = Array.from(new Set(availableSlots)).sort()
    
    return NextResponse.json({
      date,
      dayOfWeek,
      availableSlots: uniqueSlots,
      bookedSlots: bookedTimes,
      rules: rules || []
    })
  } catch (error) {
    console.error('Error in availability API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}