import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Email sending function
async function sendEmail(to: string, subject: string, body: string): Promise<void> {
  const apiKey = process.env.NEXT_PUBLIC_AGENTMAIL_API_KEY
  if (!apiKey) {
    console.error('AgentMail API key not configured')
    return
  }

  try {
    const response = await fetch(
      `https://api.agentmail.to/v0/inboxes/drivewithbui@agentmail.to/messages/send`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: [to],
          subject,
          text: body,
        }),
      }
    )

    if (response.ok) {
      console.log(`✅ Booking confirmation email sent to ${to}`)
    } else {
      const errorText = await response.text()
      console.error(`Failed to send booking email:`, response.status, errorText)
    }
  } catch (error) {
    console.error('Error sending booking email:', error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const { studentName, email, phone, date, time, lessonType } = await request.json()

    if (!studentName || !date || !time) {
      return NextResponse.json(
        { error: 'Student name, date, and time are required' },
        { status: 400 }
      )
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Create booking as CONFIRMED (auto-confirm for instructor direct bookings)
    const { data: booking, error } = await supabase
      .from('bookings_new')
      .insert([{
        student_name: studentName,
        email: email || 'guest@example.com',
        phone: phone || '',
        date,
        time,
        lesson_type: lessonType || 'single',
        status: 'confirmed' // Auto-confirm
      }])
      .select()
      .single()

    if (error) {
      console.error('Error creating booking:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Send confirmation email to student
    const formatDate = (dateStr: string) => {
      const dateObj = new Date(dateStr)
      return dateObj.toLocaleDateString('en-AU', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    }

    const lessonName = lessonType === 'single' ? 'Single Lesson ($55)' : 
                      lessonType === 'casual' ? 'Casual Driving ($45)' :
                      lessonType === 'test' ? 'Driving Test ($75)' : 'Lesson'

    const emailSubject = `✅ Booking Confirmed: ${formatDate(date)} at ${time}`
    const emailBody = `
Great news, ${studentName}!

Your driving lesson has been confirmed by your instructor!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LESSON DETAILS:
📅 Date: ${formatDate(date)}
🕕 Time: ${time}
🚗 Lesson Type: ${lessonName}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📍 PICKUP LOCATION
Usually Lidcombe Station (to be confirmed by instructor)

📝 WHAT TO BRING
- Your learner's permit
- Comfortable shoes
- Water bottle (especially in summer)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

NEED TO CHANGE OR CANCEL?
Reply to this email or contact your instructor as soon as possible.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Looking forward to helping you become a confident driver!

Best regards,
Michael Bui
Drive With Bui

Website: drivewithbui.com
    `.trim()

    // Send email asynchronously (don't block response)
    if (email) {
      sendEmail(email, emailSubject, emailBody)
    }

    return NextResponse.json({ 
      success: true, 
      booking,
      message: 'Booking created and confirmed! Student has been notified.'
    })
  } catch (error: any) {
    console.error('Instructor booking creation error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
