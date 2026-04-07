/**
 * API Authentication for Instructor Routes
 * 
 * Uses a simple API key system for server-side verification.
 * The instructor portal passes the API key in headers when calling APIs.
 */

import { NextRequest, NextResponse } from 'next/server'

// Environment variable for the API key (server-side only)
// Generate a secure random key: openssl rand -hex 32
const INSTRUCTOR_API_KEY = process.env.INSTRUCTOR_API_KEY

/**
 * Validate API key from request headers
 */
export function validateApiKey(request: NextRequest): boolean {
  if (!INSTRUCTOR_API_KEY) {
    console.warn('INSTRUCTOR_API_KEY not configured - API authentication disabled')
    return true // Allow in development if not configured
  }

  const apiKey = request.headers.get('x-instructor-api-key')
  
  if (!apiKey) {
    return false
  }

  // Constant-time comparison to prevent timing attacks
  if (apiKey.length !== INSTRUCTOR_API_KEY.length) {
    return false
  }

  let result = 0
  for (let i = 0; i < apiKey.length; i++) {
    result |= apiKey.charCodeAt(i) ^ INSTRUCTOR_API_KEY.charCodeAt(i)
  }
  
  return result === 0
}

/**
 * Create authentication response for invalid API key
 */
export function unauthorizedResponse(): NextResponse {
  return NextResponse.json(
    { error: 'Unauthorized - Invalid or missing API key' },
    { status: 401 }
  )
}

/**
 * Hash a string using SHA-256 (for client-side key storage)
 */
export async function hashString(input: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(input)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

/**
 * Input sanitization helpers
 */

// Maximum lengths for various fields
export const MAX_LENGTHS = {
  studentName: 100,
  email: 255,
  phone: 20,
  notes: 500,
  address: 200,
  lessonType: 50,
  date: 10,  // YYYY-MM-DD
  time: 20,
  status: 20,
}

/**
 * Sanitize a string input
 */
export function sanitizeString(input: unknown, maxLength: number): string {
  if (typeof input !== 'string') return ''
  return input.trim().slice(0, maxLength).replace(/[<>]/g, '')
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length <= MAX_LENGTHS.email
}

/**
 * Validate phone number (basic validation)
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\d\s\-+()]{8,20}$/
  return phoneRegex.test(phone)
}

/**
 * Validate date format (YYYY-MM-DD)
 */
export function isValidDate(date: string): boolean {
  if (!date || typeof date !== 'string') return false
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/
  if (!dateRegex.test(date)) return false
  
  const parsed = new Date(date)
  return !isNaN(parsed.getTime())
}

/**
 * Validate time format (various formats accepted)
 */
export function isValidTime(time: string): boolean {
  if (!time || typeof time !== 'string') return false
  // Accept: "9:00 AM", "09:00", "9:00", "09:00:00"
  const timePatterns = [
    /^\d{1,2}:\d{2}\s*(AM|PM)?$/i,
    /^\d{1,2}:\d{2}:\d{2}\s*(AM|PM)?$/i,
  ]
  return timePatterns.some(pattern => pattern.test(time.trim()))
}

/**
 * Sanitize booking input data
 */
export function sanitizeBookingInput(input: Record<string, unknown>): {
  studentName: string
  email: string
  phone: string
  date: string
  time: string
  lessonType: string
  notes?: string
  address?: string
} {
  return {
    studentName: sanitizeString(input.studentName, MAX_LENGTHS.studentName),
    email: sanitizeString(input.email, MAX_LENGTHS.email).toLowerCase(),
    phone: sanitizeString(input.phone, MAX_LENGTHS.phone),
    date: sanitizeString(input.date, MAX_LENGTHS.date),
    time: sanitizeString(input.time, MAX_LENGTHS.time),
    lessonType: sanitizeString(input.lessonType, MAX_LENGTHS.lessonType),
    notes: input.notes ? sanitizeString(input.notes, MAX_LENGTHS.notes) : undefined,
    address: input.address ? sanitizeString(input.address, MAX_LENGTHS.address) : undefined,
  }
}

/**
 * Validate booking required fields
 */
export function validateBookingInput(data: ReturnType<typeof sanitizeBookingInput>): string[] {
  const errors: string[] = []

  if (!data.studentName) {
    errors.push('Student name is required')
  }

  if (!data.email) {
    errors.push('Email is required')
  } else if (!isValidEmail(data.email)) {
    errors.push('Invalid email format')
  }

  if (!data.phone) {
    errors.push('Phone number is required')
  } else if (!isValidPhone(data.phone)) {
    errors.push('Invalid phone number format')
  }

  if (!data.date) {
    errors.push('Date is required')
  } else if (!isValidDate(data.date)) {
    errors.push('Invalid date format (use YYYY-MM-DD)')
  }

  if (!data.time) {
    errors.push('Time is required')
  } else if (!isValidTime(data.time)) {
    errors.push('Invalid time format')
  }

  const validLessonTypes = ['single', 'casual', 'test', 'package']
  if (!data.lessonType || !validLessonTypes.includes(data.lessonType)) {
    errors.push('Invalid lesson type')
  }

  return errors
}
