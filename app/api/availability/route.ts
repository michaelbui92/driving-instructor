import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

// All possible time slots in 12-hour format
const ALL_SLOTS = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM']

// Convert slot like "8:00 AM" to minutes since midnight
function slotToMinutes(slot: string): number {
  const [time, period] = slot.split(' ')
  let [hours, minutes] = time.split(':').map(Number)
  if (period === 'PM' && hours !== 12) hours += 12
  if (period === 'AM' && hours === 12) hours = 0
  return hours * 60 + minutes
}

// Check if a slot falls within a time range (times like "08:00:00" or "17:00")
function isSlotInRange(slot: string, startTime: string, endTime: string): boolean {
  // Parse start time
  const startParts = startTime.split(':')
  const startMinutes = parseInt(startParts[0]) * 60 + parseInt(startParts[1])
  
  // Parse end time  
  const endParts = endTime.split(':')
  const endMinutes = parseInt(endParts[0]) * 60 + parseInt(endParts[1])
  
  // Get slot minutes
  const slotMinutes = slotToMinutes(slot)
  
  return slotMinutes >= startMinutes && slotMinutes <= endMinutes
}

// Check if a date matches a day_type
function matchesDayType(date: Date, dayType: string): boolean {
  const dayOfWeek = date.getDay()
  
  if (dayType === 'ALL_DAYS') return true
  if (dayType === 'WEEKDAY') return dayOfWeek >= 1 && dayOfWeek <= 5
  if (dayType === 'WEEKEND') return dayOfWeek === 0 || dayOfWeek === 6
  
  return false
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')
    
    if (!date) {
      return NextResponse.json({ error: 'Date parameter is required' }, { status: 400 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    
    const dateObj = new Date(date)
    const dayOfWeek = dateObj.getDay()
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
    
    // Get all rules
    const { data: rules } = await supabase
      .from('availability_rules')
      .select('*')
      .eq('enabled', true)
    
    // Get manual blocks for this date
    const { data: manualBlocks } = await supabase
      .from('blocked_slots')
      .select('date, time')
      .eq('date', date)
    
    // Get bookings for this date
    const { data: bookings } = await supabase
      .from('bookings_new')
      .select('date, time')
      .eq('date', date)
      .in('status', ['pending', 'confirmed'])
    
    // Start with all slots available
    let blockedSlots = new Set<string>()
    
    // 1. FIRST: Check MAX_BOOKING rules - if day limit reached, block ALL slots
    const maxBookingRules = (rules || []).filter(r => 
      r.type === 'MAX_BOOKING' && matchesDayType(dateObj, r.day_type || 'ALL_DAYS')
    )
    
    for (const rule of maxBookingRules) {
      if (rule.max_bookings !== undefined && rule.max_bookings !== null) {
        const existingBookingsCount = (bookings || []).length
        if (existingBookingsCount >= rule.max_bookings) {
          // Day is fully booked - return empty availability
          return NextResponse.json({
            date,
            dayOfWeek: isWeekend ? 'weekend' : 'weekday',
            availableSlots: [],
            blockedSlots: ALL_SLOTS,
            bookedSlots: (bookings || []).map(b => b.time),
            rules: rules || [],
            dayFullyBooked: true,
            maxBookings: rule.max_bookings,
            currentBookings: existingBookingsCount
          })
        }
      }
    }
    
    // 2. Apply TIME_BLOCK rules
    const timeBlockRules = (rules || []).filter(r => 
      r.type === 'TIME_BLOCK' && matchesDayType(dateObj, r.day_type || 'ALL_DAYS')
    )
    
    for (const rule of timeBlockRules) {
      if (!rule.start_time || !rule.end_time) continue
      
      for (const slot of ALL_SLOTS) {
        if (isSlotInRange(slot, rule.start_time, rule.end_time)) {
          blockedSlots.add(slot)
        }
      }
    }
    
    // 3. Apply manual blocks (override rules)
    for (const block of (manualBlocks || [])) {
      blockedSlots.add(block.time)
    }
    
    // 4. Apply booked slots
    const bookedSlots = new Set((bookings || []).map(b => b.time))
    
    // 5. Calculate available
    const availableSlots = ALL_SLOTS.filter(slot => 
      !blockedSlots.has(slot) && !bookedSlots.has(slot)
    )
    
    return NextResponse.json({
      date,
      dayOfWeek: isWeekend ? 'weekend' : 'weekday',
      availableSlots,
      blockedSlots: Array.from(blockedSlots),
      bookedSlots: Array.from(bookedSlots),
      rules: rules || []
    })
  } catch (error) {
    console.error('Error in availability API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}