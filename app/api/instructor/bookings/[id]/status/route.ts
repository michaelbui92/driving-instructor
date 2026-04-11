import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { validateApiKey, unauthorizedResponse } from '@/lib/api-auth'

export const dynamic = 'force-dynamic'

// Email sending function using AgentMail
async function sendEmail(to: string, subject: string, body: string): Promise<{ success: boolean; error?: string }> {
  try {
    const apiKey = process.env.AGENTMAIL_API_KEY || process.env.NEXT_PUBLIC_AGENTMAIL_API_KEY
    
    if (!apiKey) {
      return { success: false, error: 'Email service not configured' }
    }

    const inboxId = 'drivewithbui@agentmail.to'
    const url = `https://api.agentmail.to/v0/inboxes/${inboxId}/messages/send`
    
    const response = await fetch(url, {
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
    })

    if (response.ok) {
      return { success: true }
    } else {
      const errorText = await response.text()
      return { success: false, error: `Failed to send email: ${response.status}` }
    }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Validate API key
    if (!validateApiKey(request)) {
      return unauthorizedResponse()
    }

    const { id: bookingId } = await params
    const body = await request.json()
    const { status } = body

    // Validate status
    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed']
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    // Validate booking ID format
    if (!bookingId || typeof bookingId !== 'string' || bookingId.length > 100) {
      return NextResponse.json({ error: 'Invalid booking ID' }, { status: 400 })
    }

    const db = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // First, fetch the booking to get student email before updating
    const { data: booking, error: fetchError } = await db
      .from('bookings_new')
      .select('*')
      .eq('id', bookingId)
      .single()

    if (fetchError || !booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    const studentEmail = booking.email || booking.student_email
    const studentName = booking.student_name || 'Student'
    const bookingDate = booking.date
    const bookingTime = booking.time

    // Update the status
    const result = await db
      .from('bookings_new')
      .update({ status })
      .eq('id', bookingId)

    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 500 })
    }

    // Send email notification based on new status
    if (studentEmail && (status === 'confirmed' || status === 'cancelled')) {
      let emailSubject: string
      let emailBody: string

      if (status === 'confirmed') {
        emailSubject = "Your lesson is confirmed! 🚗"
        emailBody = `Great news, ${studentName}!

Your driving lesson on ${bookingDate} at ${bookingTime} has been confirmed by your instructor.

We're looking forward to seeing you!

Best regards,
Drive With Bui`
      } else {
        emailSubject = "Lesson cancelled"
        emailBody = `Hi ${studentName},

Your driving lesson on ${bookingDate} at ${bookingTime} has been cancelled by your instructor.

If you have any questions, please don't hesitate to reach out.

Best regards,
Drive With Bui`
      }

      // Send email asynchronously
      await sendEmail(studentEmail, emailSubject, emailBody)
    }

    return NextResponse.json({ success: true, booking: result.data?.[0] || result.data })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
