import { NextRequest, NextResponse } from 'next/server'
import { sendEmail, formatContactEmail, isValidEmail } from '@/lib/agentmail'
import fs from 'fs'
import path from 'path'

// Directory to store contact form submissions locally
const CONTACT_SUBMISSIONS_DIR = path.join(process.cwd(), 'contact-submissions')

// Ensure directory exists
if (!fs.existsSync(CONTACT_SUBMISSIONS_DIR)) {
  fs.mkdirSync(CONTACT_SUBMISSIONS_DIR, { recursive: true })
}

/**
 * Log contact form submission to a local file
 */
function logSubmissionLocally(name: string, email: string, message: string) {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const filename = `submission-${timestamp}.json`
    const filepath = path.join(CONTACT_SUBMISSIONS_DIR, filename)
    
    const submission = {
      timestamp: new Date().toISOString(),
      name,
      email,
      message,
      source: 'website-contact-form'
    }
    
    fs.writeFileSync(filepath, JSON.stringify(submission, null, 2))
    console.log(`Contact form submission logged locally: ${filepath}`)
    
    return true
  } catch (error) {
    console.error('Failed to log submission locally:', error)
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, message } = body

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Always log submission locally first (as backup)
    const localLogSuccess = logSubmissionLocally(name, email, message)
    
    // Try to send email via AgentMail API
    let agentMailSuccess = false
    let agentMailError = ''
    
    try {
      // Format email content
      const { subject, body: emailBody } = formatContactEmail(name, email, message)

      // Send email via AgentMail API
      const result = await sendEmail({
        to: 'drivewithbui@agentmail.to',
        subject,
        body: emailBody,
      })

      agentMailSuccess = result.success
      agentMailError = result.error || ''
      
      if (result.success) {
        console.log('Contact form submitted via AgentMail API:', { name, email })
      } else {
        console.warn('AgentMail API failed:', result.error)
      }
    } catch (agentMailError) {
      console.error('Error calling AgentMail API:', agentMailError)
      agentMailSuccess = false
      agentMailError = agentMailError instanceof Error ? agentMailError.message : 'Unknown error'
    }

    // Determine response based on what succeeded
    if (agentMailSuccess) {
      // AgentMail succeeded
      return NextResponse.json(
        { 
          success: true, 
          message: 'Message sent successfully!',
          deliveredVia: 'email'
        },
        { status: 200 }
      )
    } else if (localLogSuccess) {
      // AgentMail failed but local log succeeded
      console.log('Contact form submission logged locally (AgentMail API failed):', { 
        name, email,
        agentMailError 
      })
      
      return NextResponse.json(
        { 
          success: true, 
          message: 'Message received! (Note: Email delivery failed, but your message has been logged locally.)',
          deliveredVia: 'local-log',
          warning: 'Email delivery service is temporarily unavailable. Your message has been saved and will be reviewed.'
        },
        { status: 200 }
      )
    } else {
      // Both failed
      console.error('Contact form submission failed completely:', { 
        name, email,
        agentMailError,
        localLogSuccess: false
      })
      
      return NextResponse.json(
        { 
          success: false,
          error: 'Failed to process your message. Please try again or contact us directly.'
        },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Error processing contact form:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}