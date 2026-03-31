import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { booking } = await request.json()

    if (!booking || !booking.id) {
      return NextResponse.json(
        { error: 'Booking data required' },
        { status: 400 }
      )
    }

    const { student_name, email, date, time, lesson_type } = booking

    // Send reminder email via AgentMail
    const apiKey = process.env.NEXT_PUBLIC_AGENTMAIL_API_KEY
    if (!apiKey) {
      console.error('AgentMail API key not configured')
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      )
    }

    // Format date/time for display
    const dateObj = new Date(date)
    const formattedDate = dateObj.toLocaleDateString('en-AU', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })

    // Email content
    const emailSubject = `⏰ Reminder: Your driving lesson TOMORROW! - ${formattedDate} at ${time}`
    
    const emailBody = `
⏰ REMINDER: Your driving lesson is TOMORROW!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Hi ${student_name},

Just a friendly reminder that your driving lesson is coming up!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LESSON DETAILS:
📅 Date: ${formattedDate}
🕕 Time: ${time}
🚗 Lesson Type: ${lesson_type === 'single' ? 'Single Lesson ($55)' : 'Casual Driving ($45)'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

WHAT TO REMEMBER:

✅ Bring your learner's permit
✅ Wear comfortable clothes
✅ Get a good night's sleep tonight!
✅ Be at pickup location 5 minutes early

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PICKUP LOCATION:

📍 Lidcombe Station (main entrance)
- Look for the silver Toyota with dual controls
- I'll be there 5 minutes before your lesson

If you're unsure, reply to this email and I'll confirm the exact pickup point!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

RUNNING LATE OR NEED TO RESCHEDULE?

Reply to this email ASAP:
- 📧 drivewithbui@agentmail.to
- WhatsApp: Coming soon!

Note: Late arrivals may result in reduced lesson time.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

See you tomorrow!

Best regards,
Michael Bui
Drive With Bui

Drive safe, learn faster!

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
      console.error('Failed to send reminder email:', errorText)
      return NextResponse.json(
        { error: 'Failed to send reminder email' },
        { status: 500 }
      )
    }

    console.log('📧 Reminder email sent:', { 
      to: email,
      date,
      time
    })

    return NextResponse.json({
      success: true,
      message: 'Reminder email sent successfully'
    })
  } catch (error) {
    console.error('Reminder email error:', error)
    return NextResponse.json(
      { error: 'Failed to send reminder email' },
      { status: 500 }
    )
  }
}