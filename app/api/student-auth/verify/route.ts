import { NextRequest, NextResponse } from 'next/server'
import { verifyOTPAndSignIn, getOrCreateStudent } from '@/lib/student-auth'
import { createClient } from '@supabase/supabase-js'

// Admin client for server-side operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { email, token } = await request.json()

    if (!email || !token) {
      return NextResponse.json(
        { error: 'Email and token are required' },
        { status: 400 }
      )
    }

    // Verify the OTP and sign in
    const result = await verifyOTPAndSignIn(email, token)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    // Ensure student record exists
    await getOrCreateStudent(result.session.user.id, email)

    // Create response with session cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: result.session.user.id,
        email: result.session.user.email,
      },
    })

    // Set session cookie
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

    return response
  } catch (error) {
    console.error('Verify error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
