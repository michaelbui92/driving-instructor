import { NextRequest, NextResponse } from 'next/server'

interface BookingNotification {
  studentName: string
  email: string
  phone: string
  date: string
  time: string
  lessonType: string
  price: number
  claimCode?: string
}

export async function POST(request: NextRequest) {
  try {
    const booking: BookingNotification = await request.json()

    const apiKey = process.env.NEXT_PUBLIC_AGENTMAIL_API_KEY
    
    if (!apiKey) {
      console.error('AgentMail API key not configured')
      return NextResponse.json({ error: 'Email service not configured' }, { status: 500 })
    }

    const lessonTypeName = booking.lessonType === 'single' ? 'Single Lesson' : 
                          booking.lessonType === 'package10' ? '10 Lesson Package' :
                          booking.lessonType === 'package20' ? '20 Lesson Package' : 'Driving Lesson'
    const formattedDate = new Date(booking.date).toLocaleDateString('en-AU', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    // Send confirmation email to student
    if (booking.email && booking.claimCode) {
      const studentSubject = `📋 Booking Received - ${formattedDate} at ${booking.time}`
      const studentName = booking.studentName || booking.email.split('@')[0] || 'there'
      const studentBody = `
Hi ${studentName},

Your driving lesson booking has been received and is pending instructor confirmation!

━━━━━━━━━━━━━━━━━━━━━━━━━━━
📅 Date: ${formattedDate}
🕐 Time: ${booking.time}
📚 Lesson: ${lessonTypeName}
💰 Price: $${booking.price}
🔖 Booking Ref: ${booking.claimCode}
━━━━━━━━━━━━━━━━━━━━━━━━━━━

⏳ Status: Pending Confirmation

You will receive another email once the instructor confirms your booking.

Need to reschedule or cancel? Log in to your student portal:
${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/student/login

See you soon!
Bui
Drive with Bui
`.trim()

      await fetch(
        `https://api.agentmail.to/v0/inboxes/drivewithbui@agentmail.to/messages/send`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: [booking.email],
            subject: studentSubject,
            text: studentBody,
          }),
        }
      )
    }

    // Send notification to instructor
    const instructorSubject = `📅 New Booking Request - ${booking.studentName}`
    const instructorBody = `
New booking request received:

━━━━━━━━━━━━━━━━━━━━━━━━━━━
📛 Student: ${booking.studentName}
📧 Email: ${booking.email}
📱 Phone: ${booking.phone}
━━━━━━━━━━━━━━━━━━━━━━━━━━━
📅 Date: ${formattedDate}
🕐 Time: ${booking.time}
📚 Lesson: ${lessonTypeName}
💰 Price: $${booking.price}
🔖 Booking Ref: ${booking.claimCode || 'N/A'}
━━━━━━━━━━━━━━━━━━━━━━━━━━━

Please log in to the instructor portal to confirm or cancel this booking.

- Auto-notification from Driving Instructor Website
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
          to: ['drivewithbui@agentmail.to'],
          subject: instructorSubject,
          text: instructorBody,
        }),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Failed to send booking notification:', errorText)
      return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error sending booking notification:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
