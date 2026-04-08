import { NextRequest, NextResponse } from 'next/server'
import { sendLoginCode } from '@/lib/student-auth'
import { checkRateLimit, getClientIP } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    const ip = getClientIP(request)
    const rateKey = `otp:${ip}:${email}`

    // Check rate limit (max 3 OTP requests per email per 15 minutes)
    const { allowed, retryAfterMs } = checkRateLimit(rateKey, 3, 15 * 60 * 1000, 60 * 1000)
    if (!allowed) {
      return NextResponse.json(
        { error: 'Too many OTP requests. Please wait before requesting another code.' },
        { 
          status: 429,
          headers: { 'Retry-After': String(Math.ceil((retryAfterMs || 60000) / 1000)) }
        }
      )
    }

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      )
    }

    const result = await sendLoginCode(email)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('OTP send error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
