import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const AUTH_COOKIE_NAME = 'instructor_session'

/**
 * GET /api/instructor/auth/session
 * Check if instructor session is valid (HttpOnly cookie)
 */
export async function GET() {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get(AUTH_COOKIE_NAME)

    if (!session) {
      return NextResponse.json({ isAuthenticated: false, hasPinSet: false })
    }

    return NextResponse.json({
      isAuthenticated: true,
      hasPinSet: true,
    })
  } catch (err) {
    console.error('Session check error:', err)
    return NextResponse.json({ isAuthenticated: false, hasPinSet: false })
  }
}
