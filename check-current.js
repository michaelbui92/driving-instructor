const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cxmpdqsqbwmelywssuew.supabase.co'
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4bXBkcXNxYndtZWx5d3NzdWV3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDExOTg1MCwiZXhwIjoyMDg5Njk1ODUwfQ.D_v-rcBYK_H6mAjbRcwaXx5FSAF_HMMrruCnjKM19QY'

const adminClient = createClient(supabaseUrl, serviceRoleKey)

async function checkCurrent() {
  console.log('Checking current database state...\n')
  
  try {
    // Check bookings
    console.log('1. Current bookings in database:')
    const { data: bookings, error } = await adminClient
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.log('   Error:', error.message)
    } else {
      console.log(`   Found ${bookings.length} bookings`)
      if (bookings.length > 0) {
        bookings.forEach(b => {
          console.log(`   - ${b.student_name} (${b.email}): ${b.date} ${b.time} - ${b.status}`)
        })
      } else {
        console.log('   Database is empty - no bookings found')
      }
    }
    
    // Check students
    console.log('\n2. Current students in database:')
    const { data: students } = await adminClient
      .from('students')
      .select('*')
    
    console.log(`   Found ${students?.length || 0} students`)
    if (students && students.length > 0) {
      students.forEach(s => {
        console.log(`   - ${s.email} (auth_user_id: ${s.auth_user_id || 'NULL'})`)
      })
    }
    
    // Test what the API would return
    console.log('\n3. Testing API simulation:')
    const testEmail = 'michaelbui@outlook.com.au'
    console.log(`   Query for email: ${testEmail}`)
    
    const { data: testBookings } = await adminClient
      .from('bookings')
      .select('*')
      .eq('email', testEmail)
    
    console.log(`   Would return: ${testBookings?.length || 0} bookings`)
    
  } catch (error) {
    console.error('Error:', error.message)
  }
}

checkCurrent()