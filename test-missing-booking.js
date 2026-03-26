const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://cxmpdqsqbwmelywssuew.supabase.co'
const supabaseKey = 'sb_secret_O_Z2BOCiq4F2FbfFXj1HWA_XTNQfL-2' // Your key

const client = createClient(supabaseUrl, supabaseKey)

async function findMissingBooking() {
  console.log('🔍 Finding missing booking...')
  
  // Get ALL bookings from database
  const { data: allBookings, error } = await client
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Database error:', error)
    return
  }
  
  console.log(`📊 Database has ${allBookings.length} bookings`)
  
  // Check each booking
  allBookings.forEach((b, i) => {
    console.log(`\n${i+1}. ${b.id.substring(0, 8)}...`)
    console.log(`   Email: ${b.email}`)
    console.log(`   Date: ${b.date}`)
    console.log(`   Status: ${b.status}`)
    console.log(`   Created: ${b.created_at}`)
    console.log(`   Student name: "${b.student_name}"`)
    console.log(`   Phone: "${b.phone}"`)
    console.log(`   Lesson type: ${b.lesson_type}`)
    
    // Check for potential issues
    const issues = []
    if (!b.email) issues.push('NO EMAIL')
    if (!b.date) issues.push('NO DATE')
    if (!b.status) issues.push('NO STATUS')
    if (b.student_name === '') issues.push('EMPTY STUDENT NAME')
    if (b.phone === '') issues.push('EMPTY PHONE')
    
    if (issues.length > 0) {
      console.log(`   ⚠️  ISSUES: ${issues.join(', ')}`)
    }
  })
  
  // Check API
  console.log('\n🌐 Checking API...')
  try {
    const apiRes = await fetch('https://drivewithbui.com/api/bookings?t=' + Date.now())
    const apiData = await apiRes.json()
    
    const apiIds = (apiData.bookings || []).map(b => b.id)
    console.log(`API returns ${apiIds.length} bookings`)
    
    // Find missing
    const dbIds = allBookings.map(b => b.id)
    const missing = dbIds.filter(id => !apiIds.includes(id))
    
    if (missing.length > 0) {
      console.log(`\n❌ MISSING IN API: ${missing.length} bookings`)
      missing.forEach(id => {
        const booking = allBookings.find(b => b.id === id)
        console.log(`   - ${id.substring(0, 8)}: ${booking?.email} | ${booking?.date} | ${booking?.status}`)
      })
    } else {
      console.log('✅ All bookings appear in API!')
    }
  } catch (apiErr) {
    console.error('API check failed:', apiErr.message)
  }
}

findMissingBooking().catch(console.error)