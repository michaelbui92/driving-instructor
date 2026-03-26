const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cxmpdqsqbwmelywssuew.supabase.co'
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4bXBkcXNxYndtZWx5d3NzdWV3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDExOTg1MCwiZXhwIjoyMDg5Njk1ODUwfQ.D_v-rcBYK_H6mAjbRcwaXx5FSAF_HMMrruCnjKM19QY'

const adminClient = createClient(supabaseUrl, serviceRoleKey)

async function checkNow() {
  console.log('Checking database RIGHT NOW...\n')
  
  try {
    // Check for the specific booking ID
    const bookingId = 'bc2b8eeb-c227-4c31-b332-0d334e4dc7df'
    console.log(`1. Looking for booking ${bookingId}...`)
    
    const { data: specificBooking, error: specificError } = await adminClient
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single()
    
    if (specificError) {
      console.log(`   Error: ${specificError.message}`)
    } else if (specificBooking) {
      console.log(`   ✅ FOUND! Booking exists:`)
      console.log(`      Student: ${specificBooking.student_name}`)
      console.log(`      Email: ${specificBooking.email}`)
      console.log(`      Date: ${specificBooking.date}`)
      console.log(`      Status: ${specificBooking.status}`)
      console.log(`      Created: ${specificBooking.created_at}`)
    } else {
      console.log(`   ❌ NOT FOUND`)
    }
    
    // Check all bookings
    console.log('\n2. All bookings in database:')
    const { data: allBookings, error: allError } = await adminClient
      .from('bookings')
      .select('*')
    
    if (allError) {
      console.log(`   Error: ${allError.message}`)
    } else {
      console.log(`   Total: ${allBookings.length} bookings`)
      allBookings.forEach(b => {
        console.log(`   - ${b.id}: ${b.student_name} (${b.email}) - ${b.date} - ${b.status}`)
      })
    }
    
    // Check if maybe it's in a different table?
    console.log('\n3. Checking table structure...')
    const tables = ['bookings', 'booking_claim_codes', 'students']
    
    for (const table of tables) {
      const { error } = await adminClient
        .from(table)
        .select('*')
        .limit(1)
      
      if (error) {
        console.log(`   ${table}: ${error.message}`)
      } else {
        console.log(`   ${table}: Table exists`)
      }
    }
    
  } catch (error) {
    console.error('Error:', error.message)
  }
}

checkNow()