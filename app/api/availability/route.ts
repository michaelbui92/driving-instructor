import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

// Time format conversion: "9:00 AM" -> "09:00", "5:00 PM" -> "17:00"
function to24HourFormat(time12h: string): string {
  if (!time12h || !time12h.includes(' ')) return time12h
  
  const [timePart, period] = time12h.split(' ')
  let [hours, minutes] = timePart.split(':').map(Number)
  
  if (period === 'PM' && hours !== 12) {
    hours += 12
  } else if (period === 'AM' && hours === 12) {
    hours = 0
  }
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
}

// Time format conversion: "09:00" -> "9:00 AM", "17:00" -> "5:00 PM"  
function to12HourFormat(time24h: string): string {
  if (!time24h || !time24h.includes(':')) return time24h
  
  const [hoursStr, minutes] = time24h.split(':')
  let hours = parseInt(hoursStr)
  const period = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12 || 12
  
  return `${hours}:${minutes} ${period}`
}

// Check if a 24h time slot falls within a time range
function isTimeInRange(slotTime: string, startTime: string, endTime: string): boolean {
  // Convert both to comparable format
  const slot24 = to24HourFormat(slotTime)
  const start24 = to24HourFormat(startTime)
  const end24 = to24HourFormat(endTime)
  
  // Handle end time being past midnight (e.g., end at "1:00 AM")
  if (end24 < start24) {
    // Range crosses midnight
    return slot24 >= start24 || slot24 <= end24
  }
  
  return slot24 >= start24 && slot24 < end24
}

// Check if a day matches day_type rule
function dayMatchesRule(dateStr: string, dayType: string): boolean {
  const date = new Date(dateStr)
  const dayOfWeek = date.getDay() // 0 = Sunday, 6 = Saturday
  
  if (dayType === 'ALL_DAYS') return true
  if (dayType === 'WEEKDAY') return dayOfWeek >= 1 && dayOfWeek <= 5
  if (dayType === 'WEEKEND') return dayOfWeek === 0 || dayOfWeek === 6
  
  // If dayType is a specific day name like "wednesday", "sunday"
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  return dayNames[dayOfWeek] === dayType.toLowerCase()
}

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

    // Create supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    
    // Get date info
    const dateObj = new Date(date)
    const dayOfWeek = dateObj.getDay()
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
    
    // Get availability rules from Supabase
    const { data: rules, error: rulesError } = await supabase
      .from('availability_rules')
      .select('*')
      .eq('enabled', true)
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
      .from('bookings_new')
      .select('*')
      .eq('date', date)
      .in('status', ['pending', 'confirmed'])
    
    if (bookingsError) {
      console.error('Error fetching bookings:', bookingsError)
      return NextResponse.json(
        { error: 'Failed to fetch bookings' },
        { status: 500 }
      )
    }
    
    // Get blocked slots
    const { data: blockedSlots, error: blockedError } = await supabase
      .from('blocked_slots')
      .select('*')
      .eq('date', date)
    
    if (blockedError) {
      console.error('Error fetching blocked slots:', blockedError)
    }
    
    // Generate default time slots based on day
    let defaultSlots: string[]
    if (isWeekend) {
      // Weekend: 8am to 7pm (every hour EXCEPT 12pm)
      defaultSlots = [
        '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
        '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM'
      ]
    } else {
      // Weekday: 9am to 8pm (every hour EXCEPT 12pm)
      defaultSlots = [
        '9:00 AM', '10:00 AM', '11:00 AM',
        '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM'
      ]
    }
    
    // Track blocked times
    const blockedTimes = new Set<string>()
    const bookedTimes = new Set<string>((bookings || []).map(b => b.time))
    const blockedSlotTimes = new Set<string>((blockedSlots || []).map(b => b.time))
    
    // Apply TIME_BLOCK rules
    const timeBlockRules = (rules || []).filter(r => r.type === 'TIME_BLOCK')
    for (const rule of timeBlockRules) {
      if (!dayMatchesRule(date, rule.day_type || 'ALL_DAYS')) continue
      if (!rule.start_time || !rule.end_time) continue
      
      // Block all slots within this time range
      for (const slot of defaultSlots) {
        if (isTimeInRange(slot, rule.start_time, rule.end_time)) {
          blockedTimes.add(slot)
        }
      }
    }
    
    // Apply EXCEPTION rules (unblock times that were blocked)
    const exceptionRules = (rules || []).filter(r => r.type === 'EXCEPTION')
    for (const rule of exceptionRules) {
      if (!dayMatchesRule(date, rule.day_type || 'ALL_DAYS')) continue
      if (!rule.start_time || !rule.end_time) continue
      
      // Unblock times within this exception range
      for (const slot of defaultSlots) {
        if (isTimeInRange(slot, rule.start_time, rule.end_time)) {
          blockedTimes.delete(slot)
        }
      }
    }
    
    // Apply MAX_BOOKING rules
    const maxBookingRules = (rules || []).filter(r => r.type === 'MAX_BOOKING')
    for (const rule of maxBookingRules) {
      if (!dayMatchesRule(date, rule.day_type || 'ALL_DAYS')) continue
      
      const maxBookings = rule.max_bookings || 1
      const currentBookings = (bookings || []).filter(b => b.status !== 'cancelled').length
      
      if (currentBookings >= maxBookings) {
        // Block ALL slots if max bookings reached
        for (const slot of defaultSlots) {
          blockedTimes.add(slot)
        }
        break // Don't apply other max rules
      }
    }
    
    // Calculate available slots: default - blocked - booked - manually blocked
    const availableSlots = defaultSlots.filter(slot => 
      !blockedTimes.has(slot) && 
      !bookedTimes.has(slot) &&
      !blockedSlotTimes.has(slot)
    )
    
    return NextResponse.json({
      date,
      dayOfWeek: isWeekend ? 'weekend' : 'weekday',
      availableSlots,
      bookedSlots: Array.from(bookedTimes),
      blockedSlots: Array.from(blockedTimes),
      manuallyBlockedSlots: Array.from(blockedSlotTimes),
      rules: rules || [],
      debug: {
        totalRules: (rules || []).length,
        timeBlocks: timeBlockRules.length,
        exceptions: exceptionRules.length,
        maxBookings: maxBookingRules.length
      }
    })
  } catch (error) {
    console.error('Error in availability API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
