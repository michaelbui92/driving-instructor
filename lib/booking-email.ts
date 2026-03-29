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
  try {
    const apiKey = process.env.NEXT_PUBLIC_AGENTMAIL_API_KEY
    if (!apiKey) {
      console.error('AgentMail API key not configured')
      return { success: false, error: 'Email service not configured' }
    }

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
          subject: `✅ Your Driving Lesson Booking Confirmation`,
          text: `
Hi ${booking.studentName},

Your driving lesson has been booked successfully!

📅 **Booking Details:**
- Date: ${formattedDate}
- Time: ${formattedTime}
- Lesson Type: ${lessonTypeDisplay}
- Price: $${booking.price}
${booking.address ? `- Pickup Address: ${booking.address}\n` : ''}

📍 **Location:**
Pickup from your specified address${booking.address ? ` (${booking.address})` : ''}. Please be ready 5 minutes before your scheduled time.

📱 **Need to make changes?**
You can view, reschedule, or cancel your booking by logging into your student portal:
https://drivewithbui.com/student/dashboard

❓ **Questions?**
If you have any questions or need to contact your instructor, please reply to this email or visit our contact page.

We look forward to helping you become a confident, safe driver!

— Michael
Drive with Bui
          `.trim(),
        }),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Failed to send booking confirmation email:', errorText)
      return { success: false, error: 'Failed to send confirmation email' }
    }

    return { success: true }
  } catch (err) {
    console.error('Unexpected booking email error:', err)
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
  try {
    const apiKey = process.env.NEXT_PUBLIC_AGENTMAIL_API_KEY
    if (!apiKey) {
      console.error('AgentMail API key not configured')
      return { success: false, error: 'Email service not configured' }
    }

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

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Failed to send cancellation email:', errorText)
      return { success: false, error: 'Failed to send cancellation email' }
    }

    return { success: true }
  } catch (err) {
    console.error('Unexpected cancellation email error:', err)
    return { success: false, error: 'Failed to send cancellation email' }
  }
}

// Send booking reschedule email
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
  try {
    const apiKey = process.env.NEXT_PUBLIC_AGENTMAIL_API_KEY
    if (!apiKey) {
      console.error('AgentMail API key not configured')
      return { success: false, error: 'Email service not configured' }
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
          to: [booking.email],
          subject: `🔄 Your Driving Lesson Has Been Rescheduled`,
          text: `
Hi ${booking.studentName},

Your driving lesson has been rescheduled successfully!

📅 **Original Booking:**
- Date: ${formatDate(booking.oldDate)}
- Time: ${booking.oldTime}

📅 **New Booking:**
- Date: ${formatDate(booking.newDate)}
- Time: ${booking.newTime}
- Lesson Type: ${booking.lessonType === 'single' ? 'Single Lesson' : 'Casual Driving'}

📍 **Location:**
Pickup from your specified address. Please be ready 5 minutes before your scheduled time.

📱 **Need to make further changes?**
You can view or manage your booking by logging into your student portal:
https://drivewithbui.com/student/dashboard

If you have any questions, please reply to this email.

See you at your lesson!

— Michael
Drive with Bui
          `.trim(),
        }),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Failed to send reschedule email:', errorText)
      return { success: false, error: 'Failed to send reschedule email' }
    }

    return { success: true }
  } catch (err) {
    console.error('Unexpected reschedule email error:', err)
    return { success: false, error: 'Failed to send reschedule email' }
  }
}