import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

// Time format conversion: "9:00 AM" -> "09:00"
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

// Normalize time string to HH:MM format for comparison
function normalizeTime(time: string): string {
  if (!time) return ''
  // If time has seconds like "09:00:00", extract just HH:MM
  const parts = time.split(':')
  if (parts.length >= 2) {
    return `${parts[0].padStart(2, '0')}:${parts[1]}`
  }
  return time
}

// Convert HH:MM to minutes since midnight for accurate numeric comparison
function timeToMinutes(time: string): number {
  if (!time) return 0
  const normalized = normalizeTime(time)
  if (normalized.includes(':')) {
    const [hours, minutes] = normalized.split(':').map(Number)
    return hours * 60 + minutes
  }
  return 0
}

// Check if a day matches day_type rule
function dayMatchesRule(dateStr: string, dayType: string): boolean {
  const date = new Date(dateStr)
  const dayOfWeek = date.getDay()
  
  if (dayType === 'ALL_DAYS') return true
  if (dayType === 'WEEKDAY') return dayOfWeek >= 1 && dayOfWeek <= 5
  if (dayType === 'WEEKEND') return dayOfWeek === 0 || dayOfWeek === 6
  
  return false
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    
    // Get all enabled rules
    console.log('[Availability-Dates API] Fetching rules from Supabase...')
    const { data: rules, error: rulesError } = await supabase
      .from('availability_rules')
      .select('*')
      .eq('enabled', true)
    
    console.log('[Availability-Dates API] Rules count:', (rules || []).length)
    console.log('[Availability-Dates API] Rules:', JSON.stringify(rules, null, 2))
    
    if (rulesError) {
      console.error('Error fetching rules:', rulesError)
      return NextResponse.json({ error: 'Failed to fetch rules' }, { status: 500 })
    }
    
    // Get blocked slots for next 28 days
    const today = new Date()
    const futureDates: string[] = []
    for (let i = 1; i <= 28; i++) {
      const d = new Date(today)
      d.setDate(today.getDate() + i)
      futureDates.push(d.toISOString().split('T')[0])
    }
    
    const { data: blockedSlots } = await supabase
      .from('blocked_slots')
      .select('*')
      .in('date', futureDates)
    
    // Get existing bookings for next 28 days
    const { data: bookings } = await supabase
      .from('bookings_new')
      .select('*')
      .in('date', futureDates)
      .in('status', ['pending', 'confirmed'])
    
    // Calculate which dates have available slots
    const availableDates: { date: string; hasSlots: boolean }[] = []
    
    for (const date of futureDates) {
      const dateObj = new Date(date)
      const dayOfWeek = dateObj.getDay()
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
      
      // ALL hours available by default - rules will block what needs blocking
      const defaultSlots = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM']
      
      // Blocked times for this date
      const blockedTimes = new Set<string>((blockedSlots || []).filter(b => b.date === date).map(b => b.time))
      const bookedTimes = new Set<string>((bookings || []).filter(b => b.date === date).map(b => b.time))
      
      // Apply TIME_BLOCK rules
      const timeBlockRules = (rules || []).filter(r => r.type === 'TIME_BLOCK')
      for (const rule of timeBlockRules) {
        if (!dayMatchesRule(date, rule.day_type || 'ALL_DAYS')) continue
        if (!rule.start_time || !rule.end_time) continue
        
        // Convert rule times to minutes for accurate comparison
        const startMinutes = timeToMinutes(rule.start_time)
        const endMinutes = timeToMinutes(rule.end_time)
        
        for (const slot of defaultSlots) {
          const slotMinutes = timeToMinutes(to24HourFormat(slot))
          
          if (slotMinutes >= startMinutes && slotMinutes <= endMinutes) {
            blockedTimes.add(slot)
          }
        }
      }
      
      // Apply EXCEPTION rules
      const exceptionRules = (rules || []).filter(r => r.type === 'EXCEPTION')
      for (const rule of exceptionRules) {
        if (!dayMatchesRule(date, rule.day_type || 'ALL_DAYS')) continue
        if (!rule.start_time || !rule.end_time) continue
        
        // Convert rule times to minutes for accurate comparison
        const startMinutes = timeToMinutes(rule.start_time)
        const endMinutes = timeToMinutes(rule.end_time)
        
        for (const slot of defaultSlots) {
          const slotMinutes = timeToMinutes(to24HourFormat(slot))
          
          if (slotMinutes >= startMinutes && slotMinutes <= endMinutes) {
            blockedTimes.delete(slot)
          }
        }
      }
      
      // Check MAX_BOOKING rules
      const maxBookingRules = (rules || []).filter(r => r.type === 'MAX_BOOKING')
      for (const rule of maxBookingRules) {
        if (!dayMatchesRule(date, rule.day_type || 'ALL_DAYS')) continue
        
        const maxBookings = rule.max_bookings || 1
        const currentBookings = (bookings || []).filter(b => b.date === date && b.status !== 'cancelled').length
        
        if (currentBookings >= maxBookings) {
          availableDates.push({ date, hasSlots: false })
          continue
        }
      }
      
      // Final check: any slots left?
      const availableForDay = defaultSlots.filter(slot => 
        !blockedTimes.has(slot) && !bookedTimes.has(slot)
      )
      
      availableDates.push({ date, hasSlots: availableForDay.length > 0 })
    }
    
    return NextResponse.json({ availableDates })
  } catch (error) {
    console.error('Error in availability dates API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
