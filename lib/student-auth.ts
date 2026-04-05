import { createClient } from '@supabase/supabase-js'
import type { Booking } from './supabase'

// Lazy-initialized admin client (requires SUPABASE_SERVICE_ROLE_KEY)
function getSupabaseAdmin() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not configured')
  }
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

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
    await getSupabaseAdmin()
      .from('login_codes')
      .delete()
      .eq('email', email)

    // Store the plain code (expires in 10 min, single use)
    const { error: insertError } = await getSupabaseAdmin()
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
    const { data: codeRecord, error: findError } = await getSupabaseAdmin()
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
    await getSupabaseAdmin()
      .from('login_codes')
      .update({ used_at: new Date().toISOString() })
      .eq('id', codeRecord.id)

    // Use admin client to create or get user
    const adminClient = getSupabaseAdmin()

    // Try to get existing user by email
    const { data: users, error: listError } = await adminClient.auth.admin.listUsers()
    let user = users?.users.find(u => u.email === email)

    // If user doesn't exist, create one with the code as password
    if (!user) {
      const { data: newUser, error: createError } = await adminClient.auth.admin.createUser({
        email,
        password: code, // Use the OTP code as password
        email_confirm: true,
      })

      if (createError) {
        console.error('Create user error:', createError)
        return { success: false, error: 'Failed to create user account' }
      }

      user = newUser.user
    }

    // Ensure student record exists
    await getOrCreateStudent(user!.id, email)

    // Now sign in with the code (works because we just set password to code)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { data: sessionData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password: code,
    })

    if (signInError) {
      console.error('Sign in error:', signInError)
      // User exists but password doesn't match - update password
      const { error: updateError } = await adminClient.auth.admin.updateUserById(user!.id, {
        password: code,
      })

      if (updateError) {
        return { success: false, error: 'Failed to update password' }
      }

      // Try signing in again
      const retryResult = await supabase.auth.signInWithPassword({
        email,
        password: code,
      })

      if (retryResult.error) {
        return { success: false, error: 'Failed to sign in after password update' }
      }

      return { success: true, session: retryResult.data.session }
    }

    return { success: true, session: sessionData.session }
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
  const { data: existing } = await getSupabaseAdmin()
    .from('students')
    .select('*')
    .eq('auth_user_id', authUserId)
    .single()

  if (existing) return existing

  // Create student record
  const { data: student, error } = await getSupabaseAdmin()
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
    .from('bookings_new')
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
