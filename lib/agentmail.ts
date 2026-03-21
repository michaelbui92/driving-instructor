/**
 * AgentMail API utility functions
 * 
 * Note: This is a server-side utility. For client-side usage,
 * use the API route (/api/contact) instead.
 */

interface SendEmailParams {
  to: string
  subject: string
  body: string
}

interface SendEmailResponse {
  success: boolean
  message?: string
  error?: string
  messageId?: string
}

/**
 * Send an email using the AgentMail API
 * 
 * @param params - Email parameters
 * @returns Promise with send result
 */
export async function sendEmail(params: SendEmailParams): Promise<SendEmailResponse> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_AGENTMAIL_API_KEY
    
    if (!apiKey) {
      console.error('AgentMail API key is not configured')
      return {
        success: false,
        error: 'Email service is not configured'
      }
    }

    // Use the correct AgentMail API endpoint: POST /v0/inboxes/{inbox_id}/messages/send
    // The inbox_id is the sender's email address (e.g., drivewithbui@agentmail.to)
    // We're sending from and to the same inbox for contact form notifications
    const endpoint = `https://api.agentmail.to/v0/inboxes/${encodeURIComponent(params.to)}/messages/send`
    
    console.log(`Sending email via AgentMail API: ${endpoint}`)
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: [params.to], // Send to ourselves (the inbox)
        subject: params.subject,
        text: params.body,
      }),
    })

    if (response.ok) {
      console.log(`✅ AgentMail API call successful`)
      const data = await response.json()
      return {
        success: true,
        message: 'Email sent successfully',
        messageId: data.message_id
      }
    } else {
      const errorText = await response.text()
      console.error(`AgentMail API error:`, response.status, errorText)
      
      return {
        success: false,
        error: `Failed to send email: ${response.status} - ${errorText}`
      }
    }

  } catch (error) {
    console.error('Error sending email via AgentMail:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Format contact form data into email content
 * 
 * @param name - Sender's name
 * @param email - Sender's email
 * @param message - Message content
 * @returns Formatted email subject and body
 */
export function formatContactEmail(
  name: string,
  email: string,
  message: string
): { subject: string; body: string } {
  const subject = `New Contact Form Submission from ${name}`
  const body = `
New contact form submission from the driving instructor website:

Name: ${name}
Email: ${email}
Message: ${message}

Submitted at: ${new Date().toISOString()}
  `.trim()

  return { subject, body }
}

/**
 * Validate email address format
 * 
 * @param email - Email address to validate
 * @returns Boolean indicating if email is valid
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}