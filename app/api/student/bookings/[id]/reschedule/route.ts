import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Send email notification for reschedule request
async function sendRescheduleEmail(
  studentEmail: string,
  studentName: string,
  oldDate: string,
  oldTime: string,
  newDate: string,
  newTime: string
): Promise<void> {
  const apiKey = process.env.AGENTMAIL_API_KEY
  if (!apiKey) {
    console.error('AgentMail API key not configured')
    return
  }

  const formatDate = (dateStr: string) => {
    const dateObj = new Date(dateStr)
    return dateObj.toLocaleDateString('en-AU', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const emailSubject = `🔄 Reschedule Request Submitted: ${formatDate(newDate)} at ${newTime}`
  const emailBody = `
Hi ${studentName}!

Your reschedule request has been submitted successfully.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

OLD BOOKING:
📅 Date: ${formatDate(oldDate)}
🕕 Time: ${oldTime}

NEW REQUESTED TIME:
📅 Date: ${formatDate(newDate)}
🕕 Time: ${newTime}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⏳ WHAT HAPPENS NEXT?

Your instructor has been notified and will review your reschedule request shortly.
You'll receive another email once the reschedule is confirmed or if there are any issues.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

If you need to cancel this request or have any questions, please reply to this email.

Best regards,
Drive With Bui
  `.trim()

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
          to: [studentEmail],
          subject: emailSubject,
          text: emailBody,
        }),
      }
    )

    if (response.ok) {
      console.log(`✅ Reschedule notification sent to ${studentEmail}`)
    } else {
      const errorText = await response.text()
      console.error(`Failed to send reschedule email:`, response.status, errorText)
    }
  } catch (error) {
    console.error('Error sending reschedule email:', error)
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { newDate, newTime } = await request.json()

    if (!newDate || !newTime) {
      return NextResponse.json(
        { error: 'New date and time are required' },
        { status: 400 }
      )
    }

    const accessToken = request.cookies.get('sb-access-token')?.value
    if (!accessToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Create authenticated client to verify user
    const authClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: { headers: { Authorization: `Bearer ${accessToken}` } },
      }
    )

    // Get current user
    const { data: { user } } = await authClient.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
    }

    // Use admin client for database operations (bypass RLS)
    const adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Get student's email using admin client
    const { data: student } = await adminClient
      .from('students')
      .select('email')
      .eq('auth_user_id', user.id)
      .single()

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    // Fetch the booking to verify ownership and get details
    const { data: booking } = await adminClient
      .from('bookings_new')
      .select('*')
      .eq('id', id)
      .single()

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    if (booking.email !== student.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    if (booking.status === 'cancelled' || booking.status === 'completed') {
      return NextResponse.json(
        { error: 'Cannot reschedule a cancelled or completed booking' },
        { status: 400 }
      )
    }

    const oldDate = booking.date
    const oldTime = booking.time

    // Update the booking to pending - instructor needs to confirm
    const { error: updateError } = await adminClient
      .from('bookings_new')
      .update({ date: newDate, time: newTime, status: 'pending' })
      .eq('id', id)

    if (updateError) {
      console.error('Reschedule error:', updateError)
      return NextResponse.json(
        { error: 'Failed to reschedule booking' },
        { status: 500 }
      )
    }

    // Send reschedule notification email to student
    await sendRescheduleEmail(
      student.email,
      booking.student_name || 'Student',
      oldDate,
      oldTime,
      newDate,
      newTime
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Reschedule booking error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
