import { NextRequest, NextResponse } from 'next/server'
import { sendEmail, formatContactEmail, isValidEmail } from '@/lib/agentmail'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, message } = body

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Format email content
    const { subject, body: emailBody } = formatContactEmail(name, email, message)

    // Send email via AgentMail API
    const result = await sendEmail({
      to: 'drivewithbui@agentmail.to',
      subject,
      body: emailBody,
    })

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to send email' },
        { status: 500 }
      )
    }

    // Log successful submission (for debugging)
    console.log('Contact form submitted successfully:', { name, email })

    return NextResponse.json(
      { success: true, message: 'Message sent successfully!' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error processing contact form:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}