#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js')

// Supabase credentials
const SUPABASE_URL = 'https://cxmpdqsqbwmelywssuew.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4bXBkcXNxYndtZWx5d3NzdWV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxMTk4NTAsImV4cCI6MjA4OTY5NTg1MH0.TyDqKmGhLA3ut_VqFF5VcQx-x8B6S5rf_g3bIxayWcA'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4bXBkcXNxYndtZWx5d3NzdWV3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDExOTg1MCwiZXhwIjoyMDg5Njk1ODUwfQ.D_v-rcBYK_H6mAjbRcwaXx5FSAF_HMMrruCnjKM19QY'

// Create clients
const anonClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
const serviceClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async function main() {
  console.log('🔍 DEBUG: API vs Database Comparison')
  console.log('='.repeat(60))
  
  // 1. Check website API
  console.log('\n1. 📡 Checking Website API...')
  try {
    const apiRes = await fetch('https://driving-instructor-gray.vercel.app/api/bookings?debug=1&force=1')
    const apiData = await apiRes.json()
    console.log('   API Status:', apiRes.status)
    console.log('   API Response:', JSON.stringify(apiData, null, 2))
    
    if (apiData.bookings) {
      console.log(`   API Bookings: ${apiData.bookings.length}`)
      const statusCounts = apiData.bookings.reduce((acc, b) => {
        acc[b.status] = (acc[b.status] || 0) + 1
        return acc
      }, {})
      console.log('   API Status Counts:', statusCounts)
    }
  } catch (error) {
    console.log('   ❌ API Error:', error.message)
  }
  
  // 2. Check Supabase with ANON key (what website might be using)
  console.log('\n2. 🗄️ Checking Supabase (ANON key)...')
  try {
    const { data: anonData, error: anonError } = await anonClient
      .from('bookings')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
    
    if (anonError) {
      console.log('   ❌ Anon Error:', anonError.message)
    } else {
      console.log(`   Anon Bookings: ${anonData.length}`)
      const statusCounts = anonData.reduce((acc, b) => {
        acc[b.status] = (acc[b.status] || 0) + 1
        return acc
      }, {})
      console.log('   Anon Status Counts:', statusCounts)
      console.log('   First booking sample:', {
        id: anonData[0]?.id,
        status: anonData[0]?.status,
        student_name: anonData[0]?.student_name
      })
    }
  } catch (error) {
    console.log('   ❌ Anon Query Error:', error.message)
  }
  
  // 3. Check Supabase with SERVICE key (what API should be using)
  console.log('\n3. 🔑 Checking Supabase (SERVICE key)...')
  try {
    const { data: serviceData, error: serviceError } = await serviceClient
      .from('bookings')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
    
    if (serviceError) {
      console.log('   ❌ Service Error:', serviceError.message)
    } else {
      console.log(`   Service Bookings: ${serviceData.length}`)
      const statusCounts = serviceData.reduce((acc, b) => {
        acc[b.status] = (acc[b.status] || 0) + 1
        return acc
      }, {})
      console.log('   Service Status Counts:', statusCounts)
      console.log('   First booking sample:', {
        id: serviceData[0]?.id,
        status: serviceData[0]?.status,
        student_name: serviceData[0]?.student_name
      })
    }
  } catch (error) {
    console.log('   ❌ Service Query Error:', error.message)
  }
  
  // 4. Check RLS policies
  console.log('\n4. 🔐 Checking RLS Status...')
  try {
    // Try to query with different permissions
    const { data: rlsTest, error: rlsError } = await anonClient
      .from('bookings')
      .select('id, status')
      .limit(1)
    
    if (rlsError && rlsError.message.includes('row level security')) {
      console.log('   ⚠️ RLS IS ENABLED (blocks anon access)')
    } else if (rlsError) {
      console.log('   ❌ Other RLS Error:', rlsError.message)
    } else {
      console.log('   ✅ RLS appears disabled (anon can read)')
    }
  } catch (error) {
    console.log('   ❌ RLS Check Error:', error.message)
  }
  
  // 5. Direct REST API check
  console.log('\n5. 🌐 Checking Direct REST API...')
  try {
    const restRes = await fetch(`${SUPABASE_URL}/rest/v1/bookings?select=id,status`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    })
    const restData = await restRes.json()
    console.log('   REST Status:', restRes.status)
    console.log(`   REST Bookings: ${Array.isArray(restData) ? restData.length : 'N/A'}`)
    if (Array.isArray(restData) && restData.length > 0) {
      console.log('   First REST booking:', {
        id: restData[0]?.id,
        status: restData[0]?.status
      })
    }
  } catch (error) {
    console.log('   ❌ REST API Error:', error.message)
  }
  
  console.log('\n' + '='.repeat(60))
  console.log('🎯 SUMMARY: Compare Website API vs Supabase Database')
  console.log('If counts differ → RLS or client issue')
  console.log('If statuses differ → API transformation bug')
  console.log('If API empty but Supabase has data → RLS blocking')
}

main().catch(console.error)