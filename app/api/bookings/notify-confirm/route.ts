import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { booking, claimCode } = await request.json()

    if (!booking || !booking.id) {
      return NextResponse.json(
        { error: 'Booking data required' },
        { status: 400 }
      )
    }

    const { student_name, email, date, time, lesson_type } = booking

    // Send confirmation email via AgentMail
    const apiKey = process.env.NEXT_PUBLIC_AGENTMAIL_API_KEY
    if (!apiKey) {
      console.error('AgentMail API key not configured')
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      )
    }

    // Format date for display
    const dateObj = new Date(date)
    const formattedDate = dateObj.toLocaleDateString('en-AU', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })

    // Email content
    const emailSubject = `🚗 Booking Confirmed: ${formattedDate} at ${time} - Drive With Bui`
    
    const emailBody = `
🎉 BOOKING CONFIRMED!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Dear ${student_name},

Your driving lesson has been booked successfully!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LESSON DETAILS:
📅 Date: ${formattedDate}
🕕 Time: ${time}
🚗 Lesson Type: ${lesson_type === 'single' ? 'Single Lesson ($55)' : 'Casual Driving ($45)'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

WHAT HAPPENS NEXT?

1. Instructor will confirm your booking within 24 hours
2. You'll receive pickup location details (usually Lidcombe Station)
3. Have your learner's permit ready!
4. Check your email for reminder 24 hours before the lesson

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

NEED TO CHANGE OR CANCEL?

Reply to this email or contact:
- 📧 drivewithbui@agentmail.to
- WhatsApp: Coming soon!

Booking Reference: #${claimCode}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Looking forward to helping you become a confident driver!

Best regards,
Michael Bui
Drive With Bui

Driving lessons in Lidcombe area
Website: drivewithbui.com
Instagram: @drivewithbui

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `.trim()

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
          subject: emailSubject,
          text: emailBody,
          headers: {
            'Reply-To': 'drivewithbui@agentmail.to',
          }
        }),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Failed to send booking confirmation email:', errorText)
      return NextResponse.json(
        { error: 'Failed to send confirmation email' },
        { status: 500 }
      )
    }

    console.log('📧 Booking confirmation email sent:', { 
      to: email,
      date,
      time,
      claimCode
    })

    return NextResponse.json({
      success: true,
      message: 'Confirmation email sent successfully'
    })
  } catch (error) {
    console.error('Booking confirmation email error:', error)
    return NextResponse.json(
      { error: 'Failed to send confirmation email' },
      { status: 500 }
    )
  }
}