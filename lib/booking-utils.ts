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

// Get available slots for a specific date, taking into account existing bookings
// If 6pm is booked, 7pm is blocked. If 7pm is booked, 6pm is blocked.
export function getAvailableSlots(date: string, existingBookings?: Booking[]): TimeSlot[] {
  const allSlots = generateTimeSlots().filter((slot) => slot.date === date)
  const slots = [...allSlots]

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
              const timeOptions = ['6:00 PM', '7:00 PM', '8:00 PM']

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
                const timeOptions = ['6:00 PM', '7:00 PM', '8:00 PM']

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

// Validate booking details
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

  // For packages, need to select required number of slots
  if (booking.lessonType !== 'single' && selectedSlotIds) {
    const requiredLessons = getRequiredLessons(booking.lessonType)
    if (selectedSlotIds.length < requiredLessons) {
      errors.push(`Please select ${requiredLessons} lessons for your package`)
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