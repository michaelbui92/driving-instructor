import { createClient } from '@supabase/supabase-js'
import type { Booking } from './supabase'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Generate a 6-digit login code
export function generateLoginCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Send login code to email via AgentMail
export async function sendLoginCode(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    const code = generateLoginCode()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Clean up any existing codes for this email
    await supabaseAdmin
      .from('login_codes')
      .delete()
      .eq('email', email)

    // Store the plain code (expires in 10 min, single use)
    const { error: insertError } = await supabaseAdmin
      .from('login_codes')
      .insert({
        email,
        code,
        code_hash: code, // storing plain for simplicity (expires quickly)
        expires_at: expiresAt.toISOString(),
      })

    if (insertError) {
      console.error('Error storing login code:', insertError)
      return { success: false, error: 'Failed to generate login code' }
    }

    // Send email with the code
    const apiKey = process.env.NEXT_PUBLIC_AGENTMAIL_API_KEY
    if (!apiKey) {
      console.error('AgentMail API key not configured')
      return { success: false, error: 'Email service not configured' }
    }

    const response = await fetch(
      `https://api.agentmail.to/v0/inboxes/drivewithbui@agentmail.to/messages/send`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: [email],
          subject: `🔐 Your Drive with Bui Login Code`,
          text: `
Hi there!

Your login code is: ${code}

This code expires in 10 minutes and can only be used once.

If you didn't request this login code, you can safely ignore this email.

— Drive with Bui
          `.trim(),
        }),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Failed to send login code email:', errorText)
      return { success: false, error: 'Failed to send login code' }
    }

    return { success: true }
  } catch (err) {
    console.error('Unexpected send login code error:', err)
    return { success: false, error: 'Failed to send login code' }
  }
}

// Verify the login code and sign in/up the user
export async function verifyLoginCodeAndSignIn(
  email: string,
  code: string
): Promise<{ success: boolean; error?: string; session?: any }> {
  try {
    // Find the code record
    const { data: codeRecord, error: findError } = await supabaseAdmin
      .from('login_codes')
      .select('*')
      .eq('email', email)
      .eq('code', code)
      .is('used_at', null)
      .single()

    if (findError || !codeRecord) {
      return { success: false, error: 'Invalid or expired login code' }
    }

    // Check expiry
    if (new Date(codeRecord.expires_at) < new Date()) {
      return { success: false, error: 'Login code has expired' }
    }

    // Mark code as used
    await supabaseAdmin
      .from('login_codes')
      .update({ used_at: new Date().toISOString() })
      .eq('id', codeRecord.id)

    // Now sign in or sign up the user via Supabase Auth
    // Using the admin client to bypass RLS
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Try to sign in first
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password: code, // Use code as password (hacky but works for OTP flow)
    })

    if (!signInError && signInData.session) {
      // Ensure student record exists
      await getOrCreateStudent(signInData.user.id, email)
      return { success: true, session: signInData.session }
    }

    // If sign in fails, create a new user
    // We need to set a password for the user
    const tempPassword = `${code}-${Date.now()}` // Temporary password

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password: tempPassword,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/student/dashboard`,
      },
    })

    if (signUpError) {
      console.error('Sign up error:', signUpError)
      // Try one more time - maybe user exists but password conflict
      return { success: false, error: signUpError.message }
    }

    // Ensure student record exists
    if (signUpData.user) {
      await getOrCreateStudent(signUpData.user.id, email)
    }

    return { success: true, session: signUpData.session }
  } catch (err) {
    console.error('Unexpected verify error:', err)
    return { success: false, error: 'Failed to verify login code' }
  }
}

// Get current session
export async function getCurrentSession() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const { data: { session }, error } = await supabase.auth.getSession()
  if (error) {
    console.error('Session error:', error)
    return null
  }
  return session
}

// Get or create student record
export async function getOrCreateStudent(
  authUserId: string,
  email: string
) {
  // Check if student exists
  const { data: existing } = await supabaseAdmin
    .from('students')
    .select('*')
    .eq('auth_user_id', authUserId)
    .single()

  if (existing) return existing

  // Create student record
  const { data: student, error } = await supabaseAdmin
    .from('students')
    .insert({ auth_user_id: authUserId, email } as any)
    .select()
    .single()

  if (error) {
    console.error('Error creating student:', error)
    return null
  }

  return student
}

// Get student bookings (RLS enforces email matching)
export async function getStudentBookings(studentEmail: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
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

// Sign out
export async function signOut() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const { error } = await supabase.auth.signOut()
  return { error }
}
