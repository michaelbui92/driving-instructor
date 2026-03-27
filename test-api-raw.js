#!/usr/bin/env node

// Test what the API actually returns vs what we expect

async function test() {
  console.log('🔍 Testing API Raw Response')
  console.log('='.repeat(60))
  
  // Call the API
  const apiUrl = 'https://driving-instructor-gray.vercel.app/api/bookings?debug=1'
  console.log(`📡 Calling: ${apiUrl}`)
  
  try {
    const response = await fetch(apiUrl)
    const data = await response.json()
    
    console.log(`📊 API Status: ${response.status}`)
    console.log('📦 API Response:', JSON.stringify(data, null, 2))
    
    if (data.bookings && data.bookings.length > 0) {
      const booking = data.bookings[0]
      console.log('\n🔎 First booking analysis:')
      console.log(`   - ID: ${booking.id}`)
      console.log(`   - Status from API: ${booking.status}`)
      console.log(`   - All fields: ${Object.keys(booking).join(', ')}`)
      
      // Check what fields are present
      const expectedFields = ['id', 'studentName', 'email', 'phone', 'date', 'time', 'lessonType', 'status', 'price', 'createdAt']
      expectedFields.forEach(field => {
        console.log(`   - ${field}: ${JSON.stringify(booking[field])} ${booking[field] === undefined ? '❌ MISSING' : ''}`)
      })
    }
    
    // Also check without debug
    console.log('\n' + '='.repeat(40))
    console.log('📡 Calling API without debug:')
    const simpleUrl = 'https://driving-instructor-gray.vercel.app/api/bookings'
    const simpleRes = await fetch(simpleUrl)
    const simpleData = await simpleRes.json()
    
    if (simpleData.bookings && simpleData.bookings.length > 0) {
      console.log(`   Status: ${simpleData.bookings[0].status}`)
      console.log(`   Same as debug? ${simpleData.bookings[0].status === data.bookings?.[0]?.status}`)
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message)
  }
  
  console.log('\n' + '='.repeat(60))
  console.log('💡 If API returns pending but DB has confirmed:')
  console.log('1. Check API logs (should show in debug mode)')
  console.log('2. Check b.status value in mapping function')
  console.log('3. Check if data is being filtered/modified')
}

test().catch(console.error)