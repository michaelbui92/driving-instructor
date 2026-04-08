import { createClient } from '@supabase/supabase-js'

// Send booking confirmation email via AgentMail
export async function sendBookingConfirmationEmail(
  booking: {
    studentName: string
    email: string
    date: string
    time: string
    lessonType: 'single' | 'casual'
    price: number
    address?: string
  }
): Promise<{ success: boolean; error?: string }> {
  console.log('[Booking Confirm Email] Starting...', booking)
  try {
    const apiKey = process.env.AGENTMAIL_API_KEY
    if (!apiKey) {
      console.error('[Booking Confirm Email] API key missing!')
      return { success: false, error: 'Email service not configured' }
    }

    console.log('[Booking Confirm Email] Sending to:', booking.email)

    // Format date nicely
    const dateObj = new Date(booking.date)
    const formattedDate = dateObj.toLocaleDateString('en-AU', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    // Format time nicely
    const formattedTime = booking.time.replace(' AM', 'am').replace(' PM', 'pm')

    // Determine lesson type display
    const lessonTypeDisplay = booking.lessonType === 'single' ? 'Single Lesson' : 'Casual Driving'

    const response = await fetch(
      `https://api.agentmail.to/v0/inboxes/drivewithbui@agentmail.to/messages/send`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: [booking.email],
          subject: `📋 Thanks for your booking — Pending Confirmation`,
          text: `
Hi ${booking.studentName},

Thanks for your booking! 🎉

📅 **Booking Details:**
- Date: ${formattedDate}
- Time: ${formattedTime}
- Lesson Type: ${lessonTypeDisplay}
- Price: $${booking.price}
${booking.address ? `- Pickup Address: ${booking.address}\n` : ''}

⏳ **What's Next?**
Your booking has been submitted and is pending confirmation from your instructor.
You'll receive another email once your instructor confirms your lesson.

📍 **Location:**
Pickup from your specified address${booking.address ? ` (${booking.address})` : ''}. Please be ready 5 minutes before your scheduled time.

📱 **Need to make changes?**
You can view, reschedule, or cancel your booking by logging into your student portal:
https://drivewithbui.com/student/dashboard

❓ **Questions?**
If you have any questions or need to contact your instructor, please reply to this email.

We look forward to helping you become a confident, safe driver!

— Michael
Drive with Bui
          `.trim(),
        }),
      }
    )

    console.log('[Booking Confirm Email] Response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[Booking Confirm Email] Failed:', response.status, errorText)
      return { success: false, error: 'Failed to send confirmation email' }
    }

    console.log('[Booking Confirm Email] Success!')
    return { success: true }
  } catch (err) {
    console.error('[Booking Confirm Email] Unexpected error:', err)
    return { success: false, error: 'Failed to send confirmation email' }
  }
}

// Send booking cancellation email
export async function sendBookingCancellationEmail(
  booking: {
    studentName: string
    email: string
    date: string
    time: string
    lessonType: 'single' | 'casual'
  }
): Promise<{ success: boolean; error?: string }> {
  console.log('[Cancellation Email] Starting...', booking)
  try {
    const apiKey = process.env.AGENTMAIL_API_KEY
    if (!apiKey) {
      console.error('[Cancellation Email] API key missing!')
      return { success: false, error: 'Email service not configured' }
    }

    console.log('[Cancellation Email] Sending to:', booking.email)

    // Format date nicely
    const dateObj = new Date(booking.date)
    const formattedDate = dateObj.toLocaleDateString('en-AU', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    const response = await fetch(
      `https://api.agentmail.to/v0/inboxes/drivewithbui@agentmail.to/messages/send`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: [booking.email],
          subject: `❌ Your Driving Lesson Has Been Cancelled`,
          text: `
Hi ${booking.studentName},

Your driving lesson has been cancelled as requested.

📅 **Cancelled Booking:**
- Date: ${formattedDate}
- Time: ${booking.time}
- Lesson Type: ${booking.lessonType === 'single' ? 'Single Lesson' : 'Casual Driving'}

💡 **Need to book again?**
You can book a new lesson anytime through our online booking system:
https://drivewithbui.com/book

If you have any questions or need assistance, please reply to this email.

We hope to see you again soon!

— Michael
Drive with Bui
          `.trim(),
        }),
      }
    )

    console.log('[Cancellation Email] Response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[Cancellation Email] Failed:', response.status, errorText)
      return { success: false, error: 'Failed to send cancellation email' }
    }

    console.log('[Cancellation Email] Success!')
    return { success: true }
  } catch (err) {
    console.error('[Cancellation Email] Unexpected error:', err)
    return { success: false, error: 'Failed to send cancellation email' }
  }
}

// Send booking reschedule request email (pending confirmation)
export async function sendBookingRescheduleEmail(
  booking: {
    studentName: string
    email: string
    oldDate: string
    oldTime: string
    newDate: string
    newTime: string
    lessonType: 'single' | 'casual'
  }
): Promise<{ success: boolean; error?: string }> {
  console.log('[Reschedule Email] Starting...', booking)
  try {
    const apiKey = process.env.AGENTMAIL_API_KEY
    if (!apiKey) {
      console.error('[Reschedule Email] API key missing!')
      return { success: false, error: 'Email service not configured' }
    }

    console.log('[Reschedule Email] API key found, sending to:', booking.email)

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
          to: [booking.email],
          subject: `🔄 Reschedule Request Submitted — Awaiting Confirmation`,
          text: `
Hi ${booking.studentName},

You have requested to reschedule your booking! ⏳

📅 **Original Booking:**
- Date: ${formatDate(booking.oldDate)}
- Time: ${booking.oldTime}

📅 **Requested New Time:**
- Date: ${formatDate(booking.newDate)}
- Time: ${booking.newTime}
- Lesson Type: ${booking.lessonType === 'single' ? 'Single Lesson' : 'Casual Driving'}

⏳ **What's Next?**
Your reschedule request has been submitted and is pending confirmation from your instructor.
You'll receive another email once your instructor confirms the new time.

📱 **Need to make further changes?**
You can view or manage your booking by logging into your student portal:
https://drivewithbui.com/student/dashboard

If you have any questions or need to cancel this request, please reply to this email.

— Michael
Drive with Bui
          `.trim(),
        }),
      }
    )

    console.log('[Reschedule Email] Response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[Reschedule Email] Failed:', response.status, errorText)
      return { success: false, error: 'Failed to send reschedule email' }
    }

    console.log('[Reschedule Email] Success!')
    return { success: true }
  } catch (err) {
    console.error('[Reschedule Email] Unexpected error:', err)
    return { success: false, error: 'Failed to send reschedule email' }
  }
}