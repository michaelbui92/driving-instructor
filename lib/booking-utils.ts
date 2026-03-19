// Booking utilities and data structures

export interface TimeSlot {
  id: string
  date: string
  time: string
  available: boolean
  price: number
  isNightTime: boolean // Flag for 8pm bookings
}

export interface Booking {
  id: string
  studentName: string
  email: string
  phone: string
  address?: string // Optional address field
  lessonType: string
  lessonSlots?: LessonSlot[] // For package bookings
  date: string
  time: string
  price: number
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  createdAt: string
}

export interface LessonSlot {
  date: string
  time: string
  isNightTime: boolean
}

// Explicit Booking type export (redundant but explicit for clarity)
export type BookingRequest = Omit<Booking, 'id' | 'status' | 'createdAt'>

// Generate time slots for next 14 days
export function generateTimeSlots(): TimeSlot[] {
  const slots: TimeSlot[] = []
  const today = new Date()

  for (let i = 1; i <= 14; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    const dateString = date.toISOString().split('T')[0]
    const dayOfWeek = date.getDay() // 0 = Sunday, 6 = Saturday
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6

    let timeOptions: string[]

    if (isWeekend) {
      // Weekend: 8am to 7pm (every hour)
      timeOptions = [
        '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
        '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM'
      ]
    } else {
      // Weekday: 6pm, 7pm, 8pm only
      timeOptions = ['6:00 PM', '7:00 PM', '8:00 PM']
    }

    timeOptions.forEach((time) => {
      slots.push({
        id: `${dateString}-${time}`,
        date: dateString,
        time,
        available: true,
        price: 45,
        isNightTime: time === '8:00 PM', // Flag 8pm as night time
      })
    })
  }

  return slots
}

// Instructor availability management
export interface BlockedSlot {
  date: string
  time: string
  reason?: string
}

const BLOCKED_SLOTS_KEY = 'instructor_blocked_slots'

export function getBlockedSlots(): BlockedSlot[] {
  try {
    const stored = localStorage.getItem(BLOCKED_SLOTS_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function addBlockedSlot(date: string, time: string, reason?: string): void {
  const blocked = getBlockedSlots()
  // Check if already blocked
  if (!blocked.some(b => b.date === date && b.time === time)) {
    blocked.push({ date, time, reason })
    localStorage.setItem(BLOCKED_SLOTS_KEY, JSON.stringify(blocked))
  }
}

export function removeBlockedSlot(date: string, time: string): void {
  const blocked = getBlockedSlots().filter(b => !(b.date === date && b.time === time))
  localStorage.setItem(BLOCKED_SLOTS_KEY, JSON.stringify(blocked))
}

export function isSlotBlocked(date: string, time: string): boolean {
  const blocked = getBlockedSlots()
  return blocked.some(b => b.date === date && b.time === time)
}

// Get blocked dates (dates where all/most slots are blocked)
export function getBlockedDates(): string[] {
  const blocked = getBlockedSlots()
  const blockedDates = new Set<string>()
  
  // Generate all possible slots for the next 14 days
  const allSlots = generateTimeSlots()
  const slotsByDate: Record<string, string[]> = {}
  
  allSlots.forEach(slot => {
    if (!slotsByDate[slot.date]) {
      slotsByDate[slot.date] = []
    }
    slotsByDate[slot.date].push(slot.time)
  })
  
  // Check each date to see if all weekday or all weekend slots are blocked
  Object.keys(slotsByDate).forEach(date => {
    const dateObj = new Date(date)
    const dayOfWeek = dateObj.getDay()
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
    
    const times = slotsByDate[date]
    const blockedForDate = blocked.filter(b => b.date === date)
    
    if (isWeekend) {
      // Weekend: block date if all 8am-7pm slots are blocked
      const weekendSlots = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
        '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM']
      const allBlocked = weekendSlots.every(t => 
        blockedForDate.some(b => b.time === t) || 
        times.every(slotTime => blockedForDate.some(b => b.time === slotTime))
      )
      if (blockedForDate.length >= 6) {
        blockedDates.add(date)
      }
    } else {
      // Weekday: block date if all 6pm, 7pm, 8pm slots are blocked
      if (blockedForDate.length >= 2) {
        blockedDates.add(date)
      }
    }
  })
  
  return Array.from(blockedDates)
}

// Get available slots for a specific date, taking into account existing bookings AND instructor blocked slots
// If 6pm is booked, 7pm is blocked. If 7pm is booked, 6pm is blocked.
export function getAvailableSlots(date: string, existingBookings?: Booking[]): TimeSlot[] {
  const allSlots = generateTimeSlots().filter((slot) => slot.date === date)
  const slots = [...allSlots]
  const blockedSlots = getBlockedSlots()
  
  // First, mark instructor-blocked slots as unavailable
  slots.forEach(slot => {
    if (blockedSlots.some(b => b.date === date && b.time === slot.time)) {
      slot.available = false
    }
  })

  // Mark slots as unavailable based on existing bookings
  if (existingBookings && existingBookings.length > 0) {
    existingBookings
      .filter(booking => booking.status !== 'cancelled')
      .forEach(booking => {
        // Handle single lesson bookings
        if (booking.lessonType === 'single' || !booking.lessonSlots) {
          if (booking.date === date) {
            const bookedSlotIndex = slots.findIndex(slot => slot.time === booking.time)
            if (bookedSlotIndex !== -1) {
              slots[bookedSlotIndex].available = false

              // Blocking logic: if 6pm is booked, block 7pm. If 7pm is booked, block 6pm.
              if (booking.time === '6:00 PM') {
                const blockedIndex = slots.findIndex(slot => slot.time === '7:00 PM')
                if (blockedIndex !== -1) {
                  slots[blockedIndex].available = false
                }
              } else if (booking.time === '7:00 PM') {
                const blockedIndex = slots.findIndex(slot => slot.time === '6:00 PM')
                if (blockedIndex !== -1) {
                  slots[blockedIndex].available = false
                }
              }
            }
          }
        }

        // Handle package bookings with multiple lesson slots
        if (booking.lessonSlots && booking.lessonSlots.length > 0) {
          booking.lessonSlots.forEach(slot => {
            if (slot.date === date) {
              const bookedSlotIndex = slots.findIndex(s => s.time === slot.time)
              if (bookedSlotIndex !== -1) {
                slots[bookedSlotIndex].available = false

                // Blocking logic for package bookings
                if (slot.time === '6:00 PM') {
                  const blockedIndex = slots.findIndex(s => s.time === '7:00 PM')
                  if (blockedIndex !== -1) {
                    slots[blockedIndex].available = false
                  }
                } else if (slot.time === '7:00 PM') {
                  const blockedIndex = slots.findIndex(s => s.time === '6:00 PM')
                  if (blockedIndex !== -1) {
                    slots[blockedIndex].available = false
                  }
                }
              }
            }
          })
        }
      })
  }

  // Only return available slots
  return slots.filter(slot => slot.available)
}

// Get the required number of lessons for a package
export function getRequiredLessons(lessonType: string): number {
  switch (lessonType) {
    case 'single':
      return 1
    case '5-pack':
      return 5
    case '10-pack':
      return 10
    default:
      return 1
  }
}

// Format date for display
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-AU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

// Check if a time slot is night time
export function isNightTimeSlot(time: string): boolean {
  return time === '8:00 PM'
}

// Step-specific validation functions
export function validateStep1(booking: Partial<Booking>): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  if (!booking.lessonType) {
    errors.push('Please select a lesson type')
  }
  return { valid: errors.length === 0, errors }
}

export function validateStep2(booking: Partial<Booking>, selectedSlotIds: string[], allowPartial: boolean = false): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  const requiredLessons = getRequiredLessons(booking.lessonType || 'single')

  if (booking.lessonType === 'single') {
    if (!booking.date) {
      errors.push('Please select a date')
    }
    if (!booking.time) {
      errors.push('Please select a time slot')
    }
    if (selectedSlotIds.length === 0) {
      errors.push('Please select at least one time slot')
    }
  } else {
    // Package validation
    if (selectedSlotIds.length === 0) {
      errors.push('Please select at least one lesson slot')
    } else if (!allowPartial && selectedSlotIds.length < requiredLessons) {
      errors.push(`Please select at least ${requiredLessons} lessons for your package, or choose "I'll choose remaining lessons later"`)
    }
  }

  return { valid: errors.length === 0, errors }
}

export function validateStep3(booking: Partial<Booking>): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!booking.studentName || booking.studentName.trim().length === 0) {
    errors.push('Student name is required')
  }

  if (!booking.email || !booking.email.includes('@')) {
    errors.push('Valid email is required')
  }

  if (!booking.phone || booking.phone.trim().length < 10) {
    errors.push('Valid phone number is required')
  }

  return { valid: errors.length === 0, errors }
}

// Validate booking details (full validation)
export function validateBooking(booking: Partial<Booking>, selectedSlotIds?: string[]): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!booking.studentName || booking.studentName.trim().length === 0) {
    errors.push('Student name is required')
  }

  if (!booking.email || !booking.email.includes('@')) {
    errors.push('Valid email is required')
  }

  if (!booking.phone || booking.phone.trim().length < 10) {
    errors.push('Valid phone number is required')
  }

  if (!booking.lessonType) {
    errors.push('Lesson type is required')
  }

  // For single lesson, need date and time
  if (booking.lessonType === 'single') {
    if (!booking.date) {
      errors.push('Date is required')
    }

    if (!booking.time) {
      errors.push('Time slot is required')
    }
  }

  // For packages, need at least 1 slot selected (full validation happens on submit)
  if (booking.lessonType && booking.lessonType !== 'single' && selectedSlotIds) {
    if (selectedSlotIds.length === 0) {
      errors.push('Please select at least one lesson slot')
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

// Get price for lesson type
export function getLessonPrice(lessonType: string): number {
  const prices: Record<string, number> = {
    'single': 45,
    '5-pack': 220,
    '10-pack': 430,
  }
  return prices[lessonType] || 45
}

// Get lesson type display name
export function getLessonTypeName(lessonType: string): string {
  const names: Record<string, string> = {
    'single': 'Single Lesson (60 min)',
    '5-pack': '5-Lesson Package',
    '10-pack': '10-Lesson Package',
  }
  return names[lessonType] || lessonType
}

// Get lesson type options
export function getLessonTypes() {
  return [
    { id: 'single', name: 'Single Lesson', duration: '60 min', price: 45 },
    { id: '5-pack', name: '5-Lesson Package', duration: '5 × 60 min', price: 220 },
    { id: '10-pack', name: '10-Lesson Package', duration: '10 × 60 min', price: 430 },
  ]
}