#!/usr/bin/env python3
"""
Python script to send email via AgentMail API.
Can be called from Next.js API route as a fallback option.
"""

import os
import sys
import json
import base64
from pathlib import Path

# Add the agentmail package to path if needed
try:
    from agentmail import AgentMail
except ImportError:
    print("Error: agentmail package not found. Install with: pip install agentmail")
    sys.exit(1)

def send_contact_email(name: str, email: str, message: str, to_inbox: str = "drivewithbui@agentmail.to"):
    """Send contact form email via AgentMail API."""
    
    # Get API key from environment
    api_key = os.getenv('AGENTMAIL_API_KEY')
    if not api_key:
        print("Error: AGENTMAIL_API_KEY environment variable not set")
        return {"success": False, "error": "Email service is not configured"}
    
    # Format email content
    subject = f"New Contact Form Submission from {name}"
    body = f"""
New contact form submission from the driving instructor website:

Name: {name}
Email: {email}
Message: {message}

Submitted at: {__import__('datetime').datetime.now().isoformat()}
""".strip()
    
    # Initialize client and send email
    try:
        client = AgentMail(api_key=api_key)
        
        response = client.inboxes.messages.send(
            inbox_id=to_inbox,
            to=[to_inbox],  # Send to ourselves
            subject=subject,
            text=body
        )
        
        print(f"Email sent successfully! Message ID: {response.message_id}")
        return {
            "success": True,
            "message": "Email sent successfully",
            "messageId": response.message_id,
            "threadId": response.thread_id
        }
        
    except Exception as e:
        print(f"Failed to send email: {e}")
        return {
            "success": False,
            "error": str(e)
        }

if __name__ == "__main__":
    # Read JSON input from stdin
    if len(sys.argv) > 1 and sys.argv[1] == "--json":
        try:
            input_data = json.loads(sys.stdin.read())
            name = input_data.get("name", "")
            email = input_data.get("email", "")
            message = input_data.get("message", "")
            to_inbox = input_data.get("to", "drivewithbui@agentmail.to")
            
            result = send_contact_email(name, email, message, to_inbox)
            print(json.dumps(result))
            
        except json.JSONDecodeError as e:
            print(json.dumps({"success": False, "error": f"Invalid JSON input: {e}"}))
        except Exception as e:
            print(json.dumps({"success": False, "error": str(e)}))
    else:
        # Command line usage
        if len(sys.argv) < 4:
            print("Usage:")
            print("  python send-email.py <name> <email> <message>")
            print("  echo '{\"name\":\"...\",\"email\":\"...\",\"message\":\"...\"}' | python send-email.py --json")
            sys.exit(1)
        
        name = sys.argv[1]
        email = sys.argv[2]
        message = sys.argv[3]
        
        result = send_contact_email(name, email, message)
        print(json.dumps(result, indent=2))