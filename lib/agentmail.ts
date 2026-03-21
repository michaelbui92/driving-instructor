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

    const response = await fetch('https://api.agentmail.to/v1/emails/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('AgentMail API error:', response.status, errorText)
      return {
        success: false,
        error: `Failed to send email: ${response.status}`
      }
    }

    return {
      success: true,
      message: 'Email sent successfully'
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