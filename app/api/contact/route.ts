import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, message } = await request.json()

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      )
    }

    // Log the contact form submission (in production, this would send an email)
    console.log('📬 Contact form submission:', { name, email, phone, message })
    
    // For now, just acknowledge receipt
    // In production, integrate with email service like:
    // - Resend
    // - SendGrid
    // - Supabase Edge Functions with email
    
    return NextResponse.json({
      success: true,
      message: 'Message received! We will get back to you soon.'
    })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}
