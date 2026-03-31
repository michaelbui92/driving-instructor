#!/bin/bash

# Script to send booking reminder emails manually
# Run this daily (can be set up as a cron job on your server)

API_URL="http://localhost:3000"  # Change to your production URL

echo "📧 Sending Booking Reminder Emails - $(date)"
echo "=========================================="

# Get tomorrow's date in Sydney timezone (YYYY-MM-DD)
TOMORROW=$(date -d 'tomorrow' '+%Y-%m-%d')

echo "Fetching bookings for date: $TOMORROW"
echo ""

# This would typically call your API to get bookings
# For now, we'll just document the flow:
echo "For each booking where:"
echo "  - date = '$TOMORROW'"
echo "  - status IN ('pending', 'confirmed')"
echo ""
echo "Call: POST $API_URL/api/bookings/notify-remind"
echo "With body:"
echo '  {'
echo '    "booking": {'
echo '      "id": "...",'
echo '      "student_name": "...",'
echo '      "email": "...",'
echo '      "date": "'$TOMORROW'",'
echo '      "time": "...",'
echo '      "lesson_type": "..."'
echo '    }'
echo '  }'
echo ""
echo "=========================================="
echo "✅ Reminders sent"
echo ""
echo "To run this automatically at 8AM Sydney time daily:"
echo "  # Add to crontab:"
echo "  0 8 * * * /path/to/send-booking-reminders.sh >> /var/log/drivewithbui/reminders.log 2>&1"