import { NextRequest, NextResponse } from 'next/server'
import { getDBClient } from '@/lib/db-client'

// Email sending function using AgentMail
async function sendEmail(to: string, subject: string, body: string): Promise<{ success: boolean; error?: string }> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_AGENTMAIL_API_KEY
    
    if (!apiKey) {
      console.warn('AgentMail API key not configured, skipping email')
      return { success: false, error: 'Email service not configured' }
    }

    // Use AgentMail API to send email
    // The inbox_id is the sender's email address
    const endpoint = `https://api.agentmail.to/v0/inboxes/${encodeURIComponent(to)}/messages/send`
    
    const response = await fetch(endpoint, {
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
      console.log(`✅ Email sent successfully to ${to}`)
      return { success: true }
    } else {
      const errorText = await response.text()
      console.error(`AgentMail API error:`, response.status, errorText)
      return { success: false, error: `Failed to send email: ${response.status}` }
    }
  } catch (error) {
    console.error('Error sending email:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: bookingId } = await params
    const { status } = await request.json()

    if (!status || !['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const db = getDBClient()

    // First, fetch the booking to get student email before updating
    const { data: booking, error: fetchError } = await db
      .from('bookings_new')
      .select('*')
      .eq('id', bookingId)
      .single()

    if (fetchError || !booking) {
      console.error('Error fetching booking:', fetchError)
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
      console.error('Error updating booking status:', result.error)
      return NextResponse.json({ error: result.error }, { status: 500 })
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

      // Send email asynchronously (don't block the response)
      sendEmail(studentEmail, emailSubject, emailBody)
        .then(result => {
          if (!result.success) {
            console.warn(`Failed to send status email to ${studentEmail}:`, result.error)
          }
        })
        .catch(err => {
          console.error('Email send error:', err)
        })
    }

    return NextResponse.json({ success: true, booking: result.data?.[0] || result.data })
  } catch (error: any) {
    console.error('Booking status update error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
