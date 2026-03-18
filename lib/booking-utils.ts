// Booking utilities and data structures

export interface TimeSlot {
  id: string
  date: string
  time: string
  available: boolean
  price: number
}

export interface Booking {
  id: string
  studentName: string
  email: string
  phone: string
  lessonType: string
  date: string
  time: string
  price: number
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  createdAt: string
}

// Generate time slots for next 14 days
export function generateTimeSlots(): TimeSlot[] {
  const slots: TimeSlot[] = []
  const today = new Date()
  const timeOptions = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM']

  for (let i = 1; i <= 14; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    const dateString = date.toISOString().split('T')[0]

    timeOptions.forEach((time) => {
      slots.push({
        id: `${dateString}-${time}`,
        date: dateString,
        time,
        available: true,
        price: 45, // Default price, will be adjusted based on lesson type
      })
    })
  }

  return slots
}

// Get available slots for a specific date
export function getAvailableSlots(date: string): TimeSlot[] {
  const allSlots = generateTimeSlots()
  return allSlots.filter((slot) => slot.date === date && slot.available)
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

// Validate booking details
export function validateBooking(booking: Partial<Booking>): { valid: boolean; errors: string[] } {
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

  if (!booking.date) {
    errors.push('Date is required')
  }

  if (!booking.time) {
    errors.push('Time slot is required')
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
    'test-prep': 50,
  }
  return prices[lessonType] || 45
}

// Get lesson type display name
export function getLessonTypeName(lessonType: string): string {
  const names: Record<string, string> = {
    'single': 'Single Lesson (60 min)',
    '5-pack': '5-Lesson Package',
    '10-pack': '10-Lesson Package',
    'test-prep': 'Test Preparation (90 min)',
  }
  return names[lessonType] || lessonType
}