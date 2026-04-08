import { NextRequest, NextResponse } from 'next/server'
import { verifyLoginCodeAndSignIn } from '@/lib/student-auth'
import { checkRateLimit, getClientIP } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json()
    const ip = getClientIP(request)
    const rateKey = `verify:${ip}:${email}`

    // Check rate limit (max 5 failed attempts per 15 minutes)
    const { allowed, retryAfterMs } = checkRateLimit(rateKey, 5, 15 * 60 * 1000, 30 * 1000)
    if (!allowed) {
      return NextResponse.json(
        { error: 'Too many failed attempts. Please wait 30 seconds and try again.' },
        { 
          status: 429,
          headers: { 'Retry-After': String(Math.ceil((retryAfterMs || 30000) / 1000)) }
        }
      )
    }

    if (!email || !code) {
      return NextResponse.json(
        { error: 'Email and code are required' },
        { status: 400 }
      )
    }

    // Verify the code and sign in
    const result = await verifyLoginCodeAndSignIn(email, code)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    // Create response with session cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: result.session.user.id,
        email: result.session.user.email,
      },
    })

    // Set session cookies
    response.cookies.set('sb-access-token', result.session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    })

    response.cookies.set('sb-refresh-token', result.session.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })

    // Set a visible cookie for client-side auth state checking (navbar dropdown)
    response.cookies.set('sb-logged-in', 'true', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })

    // Also set email cookie for navbar display
    response.cookies.set('sb-email', result.session.user.email, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })

    return response
  } catch (error) {
    console.error('Verify error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
