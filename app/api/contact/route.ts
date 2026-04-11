import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json()

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      )
    }

    // Send email via AgentMail
    const apiKey = process.env.AGENTMAIL_API_KEY || process.env.NEXT_PUBLIC_AGENTMAIL_API_KEY
    if (!apiKey) {
      console.error('AgentMail API key not configured')
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      )
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
          to: ['drivewithbui@agentmail.to'],
          subject: `Contact Form ${subject || 'Other'}`,
          text: `
Contact Form ${subject || 'Other'}

Name: ${name}
Email: ${email}

Message:
${message}

---
This message was sent via the contact form on drivewithbui.com
Replies will thread automatically with the sender's email.
          `.trim(),
          // Add headers for email threading
          headers: {
            'Reply-To': email,
            'In-Reply-To': `contact-${Date.now()}@drivewithbui.com`,
            'References': `contact-${Date.now()}@drivewithbui.com`
          }
        }),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Failed to send contact form email:', errorText)
      return NextResponse.json(
        { error: 'Failed to send message' },
        { status: 500 }
      )
    }

    console.log('📬 Contact form submitted:', { name, email, subject })

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully! We will get back to you within 24 hours.'
    })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}