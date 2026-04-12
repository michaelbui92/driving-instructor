import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'

const AUTH_COOKIE_NAME = 'instructor_session'
const INSTRUCTOR_AUTH_TABLE = 'instructor_auth'

/**
 * GET /api/instructor/auth/session
 * Check if instructor session is valid AND if PIN is set in database
 */
export async function GET() {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get(AUTH_COOKIE_NAME)

    // Check if PIN exists in database
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ isAuthenticated: false, hasPinSet: false })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    const { data, error } = await supabase
      .from(INSTRUCTOR_AUTH_TABLE)
      .select('pin_hash')
      .eq('id', 1)
      .single()

    const hasPinInDatabase = !error && data && data.pin_hash

    if (!session) {
      return NextResponse.json({ 
        isAuthenticated: false, 
        hasPinSet: hasPinInDatabase 
      })
    }

    return NextResponse.json({
      isAuthenticated: true,
      hasPinSet: hasPinInDatabase,
    })
  } catch (err) {
    console.error('Session check error:', err)
    return NextResponse.json({ isAuthenticated: false, hasPinSet: false })
  }
}
