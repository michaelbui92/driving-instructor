import { supabase } from './supabase'
import type { Booking } from './supabase'

// Generate a 6-digit booking claim code
export function generateClaimCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Send OTP for login (signs in or creates user)
export async function sendLoginOTP(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // Email template in Supabase should contain this hash check
        shouldCreateUser: true,
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/student/verify`,
      },
    })

    if (error) {
      console.error('OTP send error:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err) {
    console.error('Unexpected OTP error:', err)
    return { success: false, error: 'Failed to send login code' }
  }
}

// Verify OTP and get session
export async function verifyOTPAndSignIn(
  email: string,
  token: string
): Promise<{ success: boolean; error?: string; session?: any }> {
  try {
    // Use verifyOtp for token verification
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    })

    if (error) {
      console.error('OTP verify error:', error)
      return { success: false, error: error.message }
    }

    return { success: true, session: data.session }
  } catch (err) {
    console.error('Unexpected verify error:', err)
    return { success: false, error: 'Failed to verify login code' }
  }
}

// Get current session
export async function getCurrentSession() {
  const { data: { session }, error } = await supabase.auth.getSession()
  if (error) {
    console.error('Session error:', error)
    return null
  }
  return session
}

// Get current student from session
export async function getCurrentStudent() {
  const session = await getCurrentSession()
  if (!session?.user) return null

  const { data: student, error } = await supabase
    .from('students')
    .select('*')
    .eq('auth_user_id', session.user.id)
    .single()

  if (error) {
    console.error('Error fetching student:', error)
    return null
  }

  return student
}

// Get student bookings (RLS enforces email matching)
export async function getStudentBookings(studentEmail: string) {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('email', studentEmail)
    .order('date', { ascending: false })

  if (error) {
    console.error('Error fetching student bookings:', error)
    return []
  }

  return (data || []).map((b: any) => ({
    id: b.id,
    studentName: b.student_name,
    email: b.email,
    phone: b.phone,
    date: b.date,
    time: b.time,
    lessonType: b.lesson_type,
    status: b.status,
    price: 0,
    createdAt: b.created_at,
    claimCode: b.claim_code,
    studentId: b.student_id,
  }))
}

// Create or get student record
export async function getOrCreateStudent(authUserId: string, email: string) {
  // Check if student exists
  const { data: existing } = await supabase
    .from('students')
    .select('*')
    .eq('auth_user_id', authUserId)
    .single()

  if (existing) return existing

  // Create student record
  const { data: student, error } = await supabase
    .from('students')
    .insert({ auth_user_id: authUserId, email })
    .select()
    .single()

  if (error) {
    console.error('Error creating student:', error)
    return null
  }

  return student
}

// Sign out
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}
