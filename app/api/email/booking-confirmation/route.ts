import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { studentName, email, date, time, lessonType, price, address } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const apiKey = process.env.AGENTMAIL_API_KEY
    if (!apiKey) {
      console.error('AgentMail API key not configured')
      return NextResponse.json({ error: 'Email service not configured' }, { status: 500 })
    }

    // Format date nicely
    const dateObj = new Date(date)
    const formattedDate = dateObj.toLocaleDateString('en-AU', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    // Format time nicely
    const formattedTime = time.replace(' AM', 'am').replace(' PM', 'pm')

    // Determine lesson type display
    const lessonTypeDisplay = lessonType === 'single' ? 'Single Lesson' : 'Casual Driving'

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
          subject: `📋 Thanks for your booking — Pending Confirmation`,
          text: `
Hi ${studentName},

Thanks for your booking! 🎉

📅 **Booking Details:**
- Date: ${formattedDate}
- Time: ${formattedTime}
- Lesson Type: ${lessonTypeDisplay}
- Price: $${price}
${address ? `- Pickup Address: ${address}\n` : ''}

⏳ **What's Next?**
Your booking has been submitted and is pending confirmation from your instructor.
You'll receive another email once your instructor confirms your lesson.

📍 **Location:**
Pickup from your specified address${address ? ` (${address})` : ''}. Please be ready 5 minutes before your scheduled time.

We look forward to helping you become a confident, safe driver!

— Michael
Drive with Bui
          `.trim(),
        }),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Failed to send booking confirmation email:', response.status, errorText)
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Booking confirmation email error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
