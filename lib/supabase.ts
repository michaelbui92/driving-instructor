import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Environment variables are only available in browser/runtime, not during static build
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Only create client if we have real credentials (avoid crashes on mobile with missing env vars)
const hasValidCredentials = supabaseUrl.startsWith('https://') && supabaseAnonKey.length > 0

export const supabase: SupabaseClient = createClient(
  hasValidCredentials ? supabaseUrl : 'https://placeholder.supabase.co',
  hasValidCredentials ? supabaseAnonKey : 'placeholder-key'
)

// Types for our tables
export type Booking = {
  id: string
  student_name: string
  email: string
  phone: string
  date: string
  time: string
  lesson_type: string
  status: 'pending' | 'confirmed' | 'cancelled'
  created_at: string
}

// Alias for Supabase-format bookings (snake_case)
export type SupabaseBooking = Booking

export type AvailabilityRule = {
  id: string
  type: 'weekly' | 'specific_date' | 'recurring'
  day_type: string // 'monday', 'tuesday', etc. or date string
  start_time: string
  end_time: string
  priority: number
  repeat_type?: 'weekly' | 'biweekly' | 'monthly'
}

export type InstructorProfile = {
  id: string
  bio: string
  experience: string
  teaching_philosophy: string
  car_details: string
  service_area: string
}
