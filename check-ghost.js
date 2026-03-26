const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://cxmpdqsqbwmelywssuew.supabase.co'
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4bXBkcXNxYndtZWx5d3NzdWV3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDExOTg1MCwiZXhwIjoyMDg5Njk1ODUwfQ.D_v-rcBYK_H6mAjbRcwaXx5FSAF_HMMrruCnjKM19QY'

const adminClient = createClient(supabaseUrl, serviceRoleKey)

async function checkGhost() {
  console.log('🔍 Checking for ghost bookings...')
  
  // Get ALL bookings
  const { data: allBookings, error } = await adminClient
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('❌ Database error:', error)
    return
  }
  
  console.log(`📊 Database has ${allBookings.length} bookings:`)
  allBookings.forEach((b, i) => {
    console.log(`  ${i+1}. ${b.id} - ${b.student_name} - ${b.date} - ${b.status}`)
  })
  
  // Check API response
  console.log('\n🌐 Checking API response...')
  try {
    const apiRes = await fetch('https://drivewithbui.com/api/bookings')
    const apiData = await apiRes.json()
    console.log(`📡 API returns ${apiData.bookings?.length || 0} bookings`)
    
    if (apiData.bookings) {
      apiData.bookings.forEach((b, i) => {
        console.log(`  ${i+1}. ${b.id} - ${b.studentName} - ${b.date} - ${b.status}`)
      })
    }
    
    // Compare
    const dbIds = allBookings.map(b => b.id).sort()
    const apiIds = (apiData.bookings || []).map(b => b.id).sort()
    
    console.log('\n🔍 Comparison:')
    console.log(`Database IDs: ${dbIds.join(', ')}`)
    console.log(`API IDs: ${apiIds.join(', ')}`)
    
    if (JSON.stringify(dbIds) === JSON.stringify(apiIds)) {
      console.log('✅ Database and API match!')
    } else {
      console.log('❌ MISMATCH! Ghost booking detected.')
      
      // Find ghost
      const ghostIds = apiIds.filter(id => !dbIds.includes(id))
      if (ghostIds.length > 0) {
        console.log(`👻 Ghost booking IDs: ${ghostIds.join(', ')}`)
      }
    }
  } catch (apiError) {
    console.error('❌ API check failed:', apiError.message)
  }
}

checkGhost()