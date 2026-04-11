import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

const INSTRUCTOR_AUTH_TABLE = 'instructor_auth'
const AUTH_COOKIE_NAME = 'instructor_session'
const SESSION_DURATION_MS = 8 * 60 * 60 * 1000 // 8 hours

// Simple hash for PIN comparison (not for password storage - PIN is 4-6 digits only)
function hashPin(pin: string): string {
  let hash = 0
  for (let i = 0; i < pin.length; i++) {
    const char = pin.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return hash.toString(36)
}

/**
 * Server-side PIN verification
 * POST /api/instructor/auth/verify-pin
 * Body: { pin: string, action: 'login' | 'setPin' }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { pin, action } = body

    if (!pin || typeof pin !== 'string') {
      return NextResponse.json({ error: 'PIN is required' }, { status: 400 })
    }

    if (!/^\d{4,6}$/.test(pin)) {
      return NextResponse.json({ error: 'PIN must be 4-6 digits' }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    if (action === 'setPin') {
      // Set a new PIN
      const hashedPin = hashPin(pin)
      const { error } = await supabase
        .from(INSTRUCTOR_AUTH_TABLE)
        .upsert({
          id: 1,
          pin_hash: hashedPin,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'id' })

      if (error) {
        console.error('Error setting PIN:', error)
        return NextResponse.json({ error: 'Failed to set PIN' }, { status: 500 })
      }

      // Create session cookie
      const cookieStore = await cookies()
      const expiresAt = new Date(Date.now() + SESSION_DURATION_MS)
      cookieStore.set(AUTH_COOKIE_NAME, 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        expires: expiresAt,
        path: '/',
      })

      return NextResponse.json({ success: true, message: 'PIN set successfully' })
    }

    // Login action - verify PIN
    const { data, error: fetchError } = await supabase
      .from(INSTRUCTOR_AUTH_TABLE)
      .select('pin_hash')
      .eq('id', 1)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching PIN:', fetchError)
      return NextResponse.json({ error: 'Authentication error' }, { status: 500 })
    }

    // No PIN set yet - treat this as first-time setup
    if (!data || !data.pin_hash) {
      return NextResponse.json({ error: 'No PIN set. Use setPin action first.' }, { status: 400 })
    }

    const inputHash = hashPin(pin)
    if (inputHash !== data.pin_hash) {
      return NextResponse.json({ error: 'Invalid PIN' }, { status: 401 })
    }

    // PIN valid - create session cookie
    const cookieStore = await cookies()
    const expiresAt = new Date(Date.now() + SESSION_DURATION_MS)
    cookieStore.set(AUTH_COOKIE_NAME, 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: expiresAt,
      path: '/',
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Verify PIN error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * GET /api/instructor/auth/verify-pin
 * Check current session status
 */
export async function GET() {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get(AUTH_COOKIE_NAME)

    return NextResponse.json({
      isAuthenticated: !!session,
      hasPinSet: true, // We don't expose whether PIN exists for security
    })
  } catch (err) {
    console.error('Session check error:', err)
    return NextResponse.json({ isAuthenticated: false, hasPinSet: false })
  }
}

/**
 * DELETE /api/instructor/auth/verify-pin
 * Logout - clear session cookie
 */
export async function DELETE() {
  try {
    const cookieStore = await cookies()
    cookieStore.delete(AUTH_COOKIE_NAME)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Logout error:', err)
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 })
  }
}
