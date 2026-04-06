import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { studentName, email, oldDate, oldTime, newDate, newTime, lessonType } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const apiKey = process.env.NEXT_PUBLIC_AGENTMAIL_API_KEY
    if (!apiKey) {
      console.error('AgentMail API key not configured')
      return NextResponse.json({ error: 'Email service not configured' }, { status: 500 })
    }

    // Format dates nicely
    const formatDate = (dateStr: string) => {
      const dateObj = new Date(dateStr)
      return dateObj.toLocaleDateString('en-AU', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
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
          to: [email],
          subject: `🔄 Reschedule Request Submitted — Awaiting Confirmation`,
          text: `
Hi ${studentName},

You have requested to reschedule your booking! ⏳

📅 **Original Booking:**
- Date: ${formatDate(oldDate)}
- Time: ${oldTime}

📅 **Requested New Time:**
- Date: ${formatDate(newDate)}
- Time: ${newTime}
- Lesson Type: ${lessonType === 'single' ? 'Single Lesson' : 'Casual Driving'}

⏳ **What's Next?**
Your reschedule request has been submitted and is pending confirmation from your instructor.
You'll receive another email once your instructor confirms the new time.

— Michael
Drive with Bui
          `.trim(),
        }),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Failed to send reschedule email:', response.status, errorText)
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Reschedule email error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
