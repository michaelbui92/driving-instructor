import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { validateApiKey, unauthorizedResponse, sanitizeBookingInput, validateBookingInput } from '@/lib/api-auth'

// Email sending function
async function sendEmail(to: string, subject: string, body: string): Promise<void> {
  const apiKey = process.env.NEXT_PUBLIC_AGENTMAIL_API_KEY
  if (!apiKey) {
    return
  }

  try {
    await fetch(
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
  } catch {
    // Email failures are non-critical
  }
}

export async function POST(request: NextRequest) {
  try {
    // Validate API key
    if (!validateApiKey(request)) {
      return unauthorizedResponse()
    }

    const body = await request.json()
    
    // Sanitize input
    const sanitized = sanitizeBookingInput(body)
    
    // Validate required fields
    const errors = validateBookingInput(sanitized)
    if (errors.length > 0) {
      return NextResponse.json(
        { error: errors.join(', ') },
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
        student_name: sanitized.studentName,
        email: sanitized.email,
        phone: sanitized.phone,
        date: sanitized.date,
        time: sanitized.time,
        lesson_type: sanitized.lessonType,
        status: 'confirmed',
        address: sanitized.address,
        notes: sanitized.notes,
      }])
      .select()
      .single()

    if (error) {
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

    const lessonNames: Record<string, string> = {
      single: 'Single Lesson ($55)',
      casual: 'Casual Driving ($45)',
      test: 'Driving Test ($75)',
    }
    const lessonName = lessonNames[sanitized.lessonType] || 'Lesson'

    const emailSubject = `✅ Booking Confirmed: ${formatDate(sanitized.date)} at ${sanitized.time}`
    const emailBody = `
Great news, ${sanitized.studentName}!

Your driving lesson has been confirmed by your instructor!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LESSON DETAILS:
📅 Date: ${formatDate(sanitized.date)}
🕕 Time: ${sanitized.time}
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

    // Send email asynchronously
    if (sanitized.email) {
      sendEmail(sanitized.email, emailSubject, emailBody)
    }

    return NextResponse.json({ 
      success: true, 
      booking,
      message: 'Booking created and confirmed! Student has been notified.'
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
