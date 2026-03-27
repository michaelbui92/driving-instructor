#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js')

const SUPABASE_URL = 'https://cxmpdqsqbwmelywssuew.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4bXBkcXNxYndtZWx5d3NzdWV3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDExOTg1MCwiZXhwIjoyMDg5Njk1ODUwfQ.D_v-rcBYK_H6mAjbRcwaXx5FSAF_HMMrruCnjKM19QY'

const client = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async function main() {
  console.log('🔍 Checking Supabase Schema and Data')
  console.log('='.repeat(60))
  
  // 1. Get raw data with ALL fields
  console.log('\n1. 📊 Raw booking data with ALL fields:')
  const { data, error } = await client
    .from('bookings')
    .select('*')
    .limit(1)
  
  if (error) {
    console.log('❌ Error:', error.message)
    return
  }
  
  if (data && data.length > 0) {
    const booking = data[0]
    console.log('   Full booking object:', JSON.stringify(booking, null, 2))
    
    console.log('\n   Field-by-field analysis:')
    Object.keys(booking).forEach(key => {
      console.log(`   - ${key}: ${JSON.stringify(booking[key])} (type: ${typeof booking[key]})`)
    })
    
    // Check specifically for status variations
    console.log('\n   🔎 Status field check:')
    const statusKeys = Object.keys(booking).filter(k => k.toLowerCase().includes('status'))
    if (statusKeys.length > 0) {
      statusKeys.forEach(key => {
        console.log(`   - Found: ${key} = ${booking[key]}`)
      })
    } else {
      console.log('   - No field containing "status" found!')
    }
    
    // Check case variations
    console.log('\n   🔎 Case-sensitive check:')
    const exactKeys = ['status', 'Status', 'STATUS']
    exactKeys.forEach(key => {
      if (booking[key] !== undefined) {
        console.log(`   - booking["${key}"] = ${booking[key]}`)
      }
    })
  }
  
  // 2. Check table schema
  console.log('\n2. 🗃️ Checking table columns...')
  try {
    // Try to get column info via query
    const { data: colData, error: colError } = await client
      .from('bookings')
      .select('*')
      .limit(0)  // Get metadata only
    
    if (!colError) {
      console.log('   ✅ Can query table (schema exists)')
    }
    
    // Try a raw query to check column names
    console.log('\n3. 📝 Sample query with different field names:')
    
    // Try status
    const { data: statusData } = await client
      .from('bookings')
      .select('status')
      .limit(1)
    console.log('   - SELECT status:', statusData?.[0]?.status)
    
    // Try Status (capital S)
    const { data: StatusData } = await client
      .from('bookings')
      .select('Status')
      .limit(1)
    console.log('   - SELECT Status:', StatusData?.[0]?.Status)
    
    // Try all lowercase
    const { data: allData } = await client
      .from('bookings')
      .select('*')
      .limit(1)
    const first = allData?.[0]
    if (first) {
      console.log('   - All fields:', Object.keys(first).join(', '))
    }
    
  } catch (err) {
    console.log('   ❌ Schema check error:', err.message)
  }
  
  console.log('\n' + '='.repeat(60))
  console.log('💡 If status field exists but API shows pending, check:')
  console.log('1. API data transformation (b.status vs b.Status)')
  console.log('2. Default value logic (|| "pending")')
  console.log('3. Field name case sensitivity')
}

main().catch(console.error)