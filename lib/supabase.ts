import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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