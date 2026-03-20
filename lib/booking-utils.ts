// Booking utilities and data structures

// Rule enums and interfaces
export enum RuleType {
  TIME_BLOCK = 'TIME_BLOCK',      // Block specific time ranges
  EXCEPTION = 'EXCEPTION',         // Allow specific times within blocks
  MAX_BOOKING = 'MAX_BOOKING'      // Limit total bookings per day
}

export enum DayType {
  WEEKDAY = 'WEEKDAY',
  WEEKEND = 'WEEKEND',
  ALL_DAYS = 'ALL_DAYS'
}

export enum RepeatType {
  ONE_TIME = 'ONE_TIME',
  REPEATING = 'REPEATING'
}

export interface AvailabilityRule {
  id: string
  name: string                    // User-friendly name
  type: RuleType
  priority: number                // Lower = higher priority
  dayType: DayType

  // Time Block / Exception fields
  startTime?: string              // "9:00 AM", "6:00 PM"
  endTime?: string                // "5:00 PM", "8:00 PM"

  // Max Booking fields
  maxBookings?: number            // Max bookings per day

  // Repeat settings
  repeatType: RepeatType
  startDate?: string              // For one-time rules
  endDate?: string                // For one-time rules

  enabled: boolean                // Enable/disable without deleting
  createdAt: string
}

export interface TimeSlot {
  id: string
  date: string
  time: string
  available: boolean
  price: number
  isNightTime: boolean // Flag for 8pm bookings
}

// Availability Rules Management
const RULES_KEY = 'instructor_availability_rules'

// Helper: Generate unique ID
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// Helper: Check if a date is a weekend
function isWeekendDay(dateStr: string): boolean {
  const date = new Date(dateStr)
  const dayOfWeek = date.getDay()
  return dayOfWeek === 0 || dayOfWeek === 6
}

// Helper: Check if a date is a weekday
function isWeekdayDay(dateStr: string): boolean {
  return !isWeekendDay(dateStr)
}

// Helper: Check if time falls within a time range
function isTimeInRange(time: string, startTime: string, endTime: string): boolean {
  // Convert times to minutes for comparison
  const timeToMinutes = (t: string): number => {
    const [timePart, period] = t.split(' ')
    let [hours, minutes] = timePart.split(':').map(Number)

    if (period === 'PM' && hours !== 12) {
      hours += 12
    } else if (period === 'AM' && hours === 12) {
      hours = 0
    }

    return hours * 60 + minutes
  }

  const timeMin = timeToMinutes(time)
  const startMin = timeToMinutes(startTime)
  const endMin = timeToMinutes(endTime)

  return timeMin >= startMin && timeMin <= endMin
}

// CRUD operations for rules
export function getRules(): AvailabilityRule[] {
  try {
    const stored = localStorage.getItem(RULES_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function addRule(rule: Omit<AvailabilityRule, 'id' | 'createdAt'>): string {
  const rules = getRules()
  const newRule: AvailabilityRule = {
    ...rule,
    id: generateId(),
    createdAt: new Date().toISOString()
  }
  rules.push(newRule)
  localStorage.setItem(RULES_KEY, JSON.stringify(rules))
  return newRule.id
}

export function updateRule(id: string, updates: Partial<AvailabilityRule>): void {
  const rules = getRules()
  const index = rules.findIndex(r => r.id === id)
  if (index !== -1) {
    rules[index] = { ...rules[index], ...updates }
    localStorage.setItem(RULES_KEY, JSON.stringify(rules))
  }
}

export function deleteRule(id: string): void {
  const rules = getRules().filter(r => r.id !== id)
  localStorage.setItem(RULES_KEY, JSON.stringify(rules))
}

export function toggleRule(id: string, enabled: boolean): void {
  updateRule(id, { enabled })
}

// Priority filtering
export function getSortedRules(): AvailabilityRule[] {
  return getRules()
    .filter(rule => rule.enabled)
    .sort((a, b) => a.priority - b.priority) // Lower priority number = higher priority
}

// Get applicable rules for a specific date and time
export function getApplicableRules(date: string, time: string, existingBookings: Booking[] = []): AvailabilityRule[] {
  const sortedRules = getSortedRules()
  return sortedRules.filter(rule => {
    // Check day type
    const appliesToDay =
      rule.dayType === DayType.ALL_DAYS ||
      (rule.dayType === DayType.WEEKDAY && isWeekdayDay(date)) ||
      (rule.dayType === DayType.WEEKEND && isWeekendDay(date))

    if (!appliesToDay) return false

    // For Phase 3a, we only handle TIME_BLOCK and EXCEPTION rules
    // Phase 3b will add date range and max booking logic
    if (rule.type === RuleType.TIME_BLOCK || rule.type === RuleType.EXCEPTION) {
      // Check if time is within the rule's time range
      if (rule.startTime && rule.endTime) {
        return isTimeInRange(time, rule.startTime, rule.endTime)
      }
    }

    // Phase 3b: Handle MAX_BOOKING rules and ONE_TIME date range filtering
    // For Phase 3a, we only support TIME_BLOCK and EXCEPTION rules
    return false
  })
}

// Determine if a slot should be blocked based on rules
export function shouldBlockSlot(date: string, time: string, existingBookings: Booking[] = []): boolean {
  const applicableRules = getApplicableRules(date, time, existingBookings)

  if (applicableRules.length === 0) {
    return false
  }

  // Check rules in priority order (already sorted by priority)
  for (const rule of applicableRules) {
    if (rule.type === RuleType.TIME_BLOCK) {
      // Check if there's an exception with higher priority (lower number)
      const hasException = applicableRules.some(
        r => r.type === RuleType.EXCEPTION &&
             r.priority < rule.priority &&
             isTimeInRange(time, r.startTime || '', r.endTime || '')
      )

      if (!hasException) {
        return true // Block this slot
      }
    } else if (rule.type === RuleType.EXCEPTION) {
      // Exception slot is available unless blocked by another higher priority rule
      const higherPriorityBlock = applicableRules.some(
        r => r.type === RuleType.TIME_BLOCK && r.priority < rule.priority
      )

      if (!higherPriorityBlock) {
        return false // This is an exception, make it available
      }
    } else if (rule.type === RuleType.MAX_BOOKING) {
      // Phase 3b: Will handle max booking limit
      // For Phase 3a, max booking rules are not yet implemented
    }
  }

  // If no rules explicitly block the slot, it's available
  return false
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
  archived?: boolean // Archive status (default: false)
  packageId?: string // ID to group individual bookings from a package
  packageLessonIndex?: number // Index of this lesson within a package (0-based)
}

export interface LessonSlot {
  date: string
  time: string
  isNightTime: boolean
}

// Explicit Booking type export (redundant but explicit for clarity)
export type BookingRequest = Omit<Booking, 'id' | 'status' | 'createdAt'>

// Generate time slots for next 28 days (4 weeks)
export function generateTimeSlots(): TimeSlot[] {
  const slots: TimeSlot[] = []
  const today = new Date()

  for (let i = 1; i <= 28; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    const dateString = date.toISOString().split('T')[0]
    const dayOfWeek = date.getDay() // 0 = Sunday, 6 = Saturday
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6

    let timeOptions: string[]

    if (isWeekend) {
      // Weekend: 8am to 7pm (every hour EXCEPT 12pm)
      timeOptions = [
        '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
        '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM'
      ]
    } else {
      // Weekday: 9am to 8pm (every hour EXCEPT 12pm)
      timeOptions = [
        '9:00 AM', '10:00 AM', '11:00 AM',
        '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM'
      ]
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

  // Mark slots as unavailable based on availability rules
  slots.forEach(slot => {
    if (shouldBlockSlot(date, slot.time, existingBookings)) {
      slot.available = false
    }
  })

  // Mark slots as unavailable based on existing bookings
  if (existingBookings && existingBookings.length > 0) {
    existingBookings
      .filter(booking => booking.status !== 'cancelled')
      .forEach(booking => {
        // With new structure: each booking (even packages) has its own date and time
        // Packages are split into individual bookings, so we just check booking.date and booking.time
        if (booking.date === date) {
          const bookedSlotIndex = slots.findIndex(slot => slot.time === booking.time)
          if (bookedSlotIndex !== -1) {
            slots[bookedSlotIndex].available = false
          }
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
    'single': 50,
  }
  return prices[lessonType] || 50
}

// Get lesson type display name
export function getLessonTypeName(lessonType: string): string {
  const names: Record<string, string> = {
    'single': 'Single Lesson (60 min)',
  }
  return names[lessonType] || 'Single Lesson (60 min)'
}

// Get lesson type options
export function getLessonTypes() {
  return [
    { id: 'single', name: 'Single Lesson', duration: '60 min', price: 50 },
  ]
}