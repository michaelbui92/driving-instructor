const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://cxmpdqsqbwmelywssuew.supabase.co'
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4bXBkcXNxYndtZWx5d3NzdWV3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDExOTg1MCwiZXhwIjoyMDg5Njk1ODUwfQ.D_v-rcBYK_H6mAjbRcwaXx5FSAF_HMMrruCnjKM19QY'

const adminClient = createClient(supabaseUrl, serviceRoleKey)

async function test() {
  console.log('🔍 Direct database test...')
  
  // Count total bookings
  const { count, error: countError } = await adminClient
    .from('bookings')
    .select('*', { count: 'exact', head: true })
  
  if (countError) {
    console.error('Count error:', countError)
    return
  }
  
  console.log(`📊 Database has ${count} total bookings`)
  
  // Get all bookings
  const { data, error } = await adminClient
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Query error:', error)
    return
  }
  
  console.log('\n📋 All bookings:')
  data.forEach((b, i) => {
    console.log(`${i+1}. ${b.id.substring(0, 8)} | ${b.email} | ${b.date} | ${b.status} | ${b.created_at}`)
  })
  
  // Check API
  console.log('\n🌐 Checking /api/bookings...')
  try {
    const apiRes = await fetch('https://drivewithbui.com/api/bookings?t=' + Date.now())
    const apiData = await apiRes.json()
    console.log(`API returns ${apiData.bookings?.length || 0} bookings`)
    
    // Compare
    const dbIds = data.map(b => b.id).sort()
    const apiIds = (apiData.bookings || []).map(b => b.id).sort()
    
    console.log('\n🔍 Comparison:')
    console.log(`Database: ${dbIds.length} bookings`)
    console.log(`API: ${apiIds.length} bookings`)
    
    if (dbIds.length !== apiIds.length) {
      console.log('❌ COUNT MISMATCH!')
      
      // Find missing
      const missingInApi = dbIds.filter(id => !apiIds.includes(id))
      if (missingInApi.length > 0) {
        console.log(`Missing in API: ${missingInApi.map(id => id.substring(0, 8)).join(', ')}`)
        
        // Show details of missing bookings
        const missingBookings = data.filter(b => missingInApi.includes(b.id))
        console.log('\n📝 Missing booking details:')
        missingBookings.forEach(b => {
          console.log(`  - ${b.id.substring(0, 8)}: ${b.email} | ${b.date} | ${b.status}`)
        })
      }
    } else {
      console.log('✅ Counts match!')
    }
  } catch (apiErr) {
    console.error('API check failed:', apiErr.message)
  }
}

test()