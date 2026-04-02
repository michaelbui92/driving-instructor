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

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    
    // Get current timestamp to bust any cache
    const now = new Date().toISOString()
    
    // Direct SQL query to bypass any Supabase caching issues
    const { data: rules, error: rulesError } = await supabase.rpc('get_availability_rules', {
      current_time: now
    })
    
    // If RPC doesn't exist, fall back to direct select with no cache
    let finalRules: any[] = []
    
    if (rulesError || !rules) {
      // Try direct select with range to force fresh data
      const { data: directRules, error: directError } = await supabase
        .from('availability_rules')
        .select('id, name, type, day_type, start_time, end_time, priority, enabled')
        .eq('enabled', true)
        .range(0, 100)  // Force a range query to avoid caching
      
      if (directError) {
        console.error('Error fetching rules:', directError)
        return NextResponse.json({ error: 'Failed to fetch rules' }, { status: 500 })
      }
      
      finalRules = directRules || []
    } else {
      finalRules = rules || []
    }
    
    // Debug: log what we got
    console.log('[Availability-Dates] Rules count:', finalRules.length)
    console.log('[Availability-Dates] Rules:', JSON.stringify(finalRules))
    console.log('[Availability-Dates] Bookings count:', (bookings || []).length)
    console.log('[Availability-Dates] Blocked slots count:', (blockedSlots || []).length)
    
    // Get all future dates for next 28 days
    const futureDates: string[] = []
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    for (let i = 1; i <= 28; i++) {
      const d = new Date(today)
      d.setDate(today.getDate() + i)
      futureDates.push(d.toISOString().split('T')[0])
    }
    
    // Get existing bookings for these dates
    const { data: bookings } = await supabase
      .from('bookings_new')
      .select('date, time, status')
      .in('date', futureDates)
      .in('status', ['pending', 'confirmed'])
    
    // Get blocked slots for these dates
    const { data: blockedSlots } = await supabase
      .from('blocked_slots')
      .select('date, time')
      .in('date', futureDates)
    
    // All possible time slots
    const allSlots = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM']
    
    // Calculate availability for each date
    const availableDates = futureDates.map(dateStr => {
      const dateObj = new Date(dateStr)
      const dayOfWeek = dateObj.getDay()
      
      // Find matching rules for this day
      const matchingRules = (finalRules || []).filter(rule => {
        if (rule.day_type === 'ALL_DAYS') return true
        if (rule.day_type === 'WEEKDAY') return dayOfWeek >= 1 && dayOfWeek <= 5
        if (rule.day_type === 'WEEKEND') return dayOfWeek === 0 || dayOfWeek === 6
        return false
      })
      
      // Check for TIME_BLOCK rules that block all slots
      const timeBlockRules = matchingRules.filter(r => r.type === 'TIME_BLOCK')
      
      // Get bookings and blocked slots for this date
      const dateBookings = (bookings || []).filter(b => b.date === dateStr)
      const dateBlockedSlots = (blockedSlots || []).filter(b => b.date === dateStr)
      
      // Calculate blocked slots for this date
      const blockedForDate = new Set<string>()
      
      // Add manual blocks
      dateBlockedSlots.forEach(b => blockedForDate.add(b.time))
      
      // Apply TIME_BLOCK rules
      timeBlockRules.forEach(rule => {
        if (!rule.start_time || !rule.end_time) return
        
        // Parse rule times (format: "HH:MM:SS")
        const ruleParts = rule.start_time.split(':')
        const startHour = parseInt(ruleParts[0])
        const startMin = parseInt(ruleParts[1])
        const ruleEndParts = rule.end_time.split(':')
        const endHour = parseInt(ruleEndParts[0])
        const endMin = parseInt(ruleEndParts[1])
        const startMinutes = startHour * 60 + startMin
        const endMinutes = endHour * 60 + endMin
        
        // Block all slots within range
        allSlots.forEach(slot => {
          const slotParts = slot.split(' ')
          const period = slotParts[1]
          let [hour, min] = slotParts[0].split(':').map(Number)
          
          // Convert to 24h
          if (period === 'PM' && hour !== 12) hour += 12
          if (period === 'AM' && hour === 12) hour = 0
          
          const slotMinutes = hour * 60 + min
          
          if (slotMinutes >= startMinutes && slotMinutes <= endMinutes) {
            blockedForDate.add(slot)
          }
        })
      })
      
      // Check for MAX_BOOKING rules
      const maxBookingRules = matchingRules.filter(r => r.type === 'MAX_BOOKING')
      for (const rule of maxBookingRules) {
        if (rule.max_bookings && dateBookings.length >= rule.max_bookings) {
          // All slots are blocked
          return { date: dateStr, hasSlots: false }
        }
      }
      
      // Count available slots
      const bookedTimes = new Set(dateBookings.map(b => b.time))
      const availableSlots = allSlots.filter(slot => 
        !blockedForDate.has(slot) && !bookedTimes.has(slot)
      )
      
      // Debug log for each date
      console.log(`[Availability-Dates] ${dateStr}: blocked=${blockedForDate.size}, booked=${bookedTimes.size}, available=${availableSlots.length}`)
      
      return { date: dateStr, hasSlots: availableSlots.length > 0 }
    })
    
    return NextResponse.json({ availableDates })
  } catch (error) {
    console.error('Error in availability dates API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}