const { createClient } = require('@supabase/supabase-js')

// These should match your Supabase project
const supabaseUrl = 'https://cxmpdqsqbwmelywssuew.supabase.co'
const anonKey = 'YOUR_ANON_KEY_HERE' // Get from Supabase → Settings → API

async function testBookingFlow() {
  console.log('🔍 Testing Booking Flow...')
  
  // Create client with anon key (subject to RLS)
  const client = createClient(supabaseUrl, anonKey)
  
  // 1. Count bookings via direct query
  const { count: directCount, error: countError } = await client
    .from('bookings')
    .select('*', { count: 'exact', head: true })
  
  if (countError) {
    console.error('❌ Direct query failed (RLS blocking?):', countError.message)
    console.log('Note: Anon key queries are subject to RLS policies')
    return
  }
  
  console.log(`📊 Direct query count: ${directCount} bookings`)
  
  // 2. Get sample of bookings
  const { data: directData, error: queryError } = await client
    .from('bookings')
    .select('id, email, date, status, created_at')
    .order('created_at', { ascending: false })
    .limit(5)
  
  if (queryError) {
    console.error('❌ Query error:', queryError.message)
  } else {
    console.log('📋 Latest bookings (direct query):')
    directData.forEach((b, i) => {
      console.log(`  ${i+1}. ${b.id.substring(0, 8)} | ${b.email} | ${b.date} | ${b.status}`)
    })
  }
  
  // 3. Check API response
  console.log('\n🌐 Checking /api/bookings...')
  try {
    const apiRes = await fetch('https://drivewithbui.com/api/bookings?t=' + Date.now())
    if (!apiRes.ok) {
      console.error(`❌ API failed: ${apiRes.status} ${apiRes.statusText}`)
      return
    }
    
    const apiData = await apiRes.json()
    console.log(`📡 API returns ${apiData.bookings?.length || 0} bookings`)
    
    // Compare counts
    if (directCount !== apiData.bookings?.length) {
      console.log(`❌ COUNT MISMATCH! Direct: ${directCount}, API: ${apiData.bookings?.length}`)
      
      // Find which bookings are missing
      const directIds = directData?.map(b => b.id) || []
      const apiIds = apiData.bookings?.map(b => b.id) || []
      
      const missingInApi = directIds.filter(id => !apiIds.includes(id))
      if (missingInApi.length > 0) {
        console.log(`📝 Missing in API: ${missingInApi.map(id => id.substring(0, 8)).join(', ')}`)
      }
    } else {
      console.log('✅ Counts match!')
    }
  } catch (apiErr) {
    console.error('❌ API check failed:', apiErr.message)
  }
  
  // 4. Check environment
  console.log('\n⚙️ Checking environment...')
  try {
    const envRes = await fetch('https://drivewithbui.com/api/env')
    if (envRes.ok) {
      const envData = await envRes.json()
      console.log('Environment:', {
        supabaseUrl: envData.environment?.supabaseUrl,
        matchesExpected: envData.environment?.supabaseUrl === supabaseUrl
      })
    }
  } catch (envErr) {
    console.error('Env API failed:', envErr.message)
  }
}

// Run test
testBookingFlow().catch(console.error)