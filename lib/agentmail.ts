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

    // First, get the inbox details to get the pod_id
    let podId = null
    try {
      const inboxResponse = await fetch(`https://api.agentmail.to/v0/inboxes/${encodeURIComponent(params.to)}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      })
      
      if (inboxResponse.ok) {
        const inboxData = await inboxResponse.json()
        podId = inboxData.pod_id
        console.log(`Got pod_id for inbox ${params.to}: ${podId}`)
      }
    } catch (error) {
      console.error('Failed to get inbox details:', error)
    }

    // Try multiple API endpoint patterns
    const endpoints = [
      // Pattern 1: v1 endpoint from task description
      {
        url: 'https://api.agentmail.to/v1/emails/send',
        body: {
          to: params.to,
          subject: params.subject,
          body: params.body,
        }
      },
      // Pattern 2: v0 endpoint with inbox as sender (using email)
      {
        url: `https://api.agentmail.to/v0/inboxes/${encodeURIComponent(params.to)}/messages`,
        body: {
          to: [params.to], // Send to ourselves
          subject: params.subject,
          text: params.body,
        }
      },
      // Pattern 3: v0 endpoint with pod_id as sender (if we got it)
      ...(podId ? [{
        url: `https://api.agentmail.to/v0/inboxes/${encodeURIComponent(podId)}/messages`,
        body: {
          to: [params.to],
          subject: params.subject,
          text: params.body,
        }
      }] : []),
    ]

    let lastError = ''
    
    for (const endpoint of endpoints) {
      try {
        console.log(`Trying AgentMail endpoint: ${endpoint.url}`)
        
        const response = await fetch(endpoint.url, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(endpoint.body),
        })

        if (response.ok) {
          console.log(`✅ AgentMail API call successful to ${endpoint.url}`)
          return {
            success: true,
            message: 'Email sent successfully'
          }
        } else {
          const errorText = await response.text()
          lastError = `Endpoint ${endpoint.url}: ${response.status} - ${errorText}`
          console.error(`AgentMail API error (${endpoint.url}):`, response.status, errorText)
          
          // If it's a 404, try next endpoint
          if (response.status === 404) {
            continue
          }
          
          // For other errors, return immediately
          return {
            success: false,
            error: `Failed to send email: ${response.status}`
          }
        }
      } catch (error) {
        lastError = `Endpoint ${endpoint.url}: ${error instanceof Error ? error.message : 'Unknown error'}`
        console.error(`Network error for ${endpoint.url}:`, error)
        continue // Try next endpoint
      }
    }

    // All endpoints failed
    return {
      success: false,
      error: `All AgentMail API endpoints failed. Last error: ${lastError}`
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