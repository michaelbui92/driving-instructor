// Simulate the booking flow locally
const fs = require('fs')
const path = require('path')

const dbFile = path.join(__dirname, 'test-local-db.json')

// Reset test database
const initialData = {
  bookings: [
    {
      id: 'local-001',
      student_name: 'Local Test',
      email: 'local@test.com',
      phone: '0411111111',
      date: '2026-04-10',
      time: '10:00:00',
      lesson_type: 'single',
      status: 'pending',
      created_at: new Date().toISOString()
    }
  ]
}

fs.writeFileSync(dbFile, JSON.stringify(initialData, null, 2))

// Simulate API endpoints
function simulateAPI() {
  const data = JSON.parse(fs.readFileSync(dbFile, 'utf8'))
  
  return {
    // GET /api/bookings
    getBookings: () => {
      console.log('📡 API: GET /api/bookings')
      const bookings = data.bookings
      console.log(`   Returns: ${bookings.length} bookings`)
      bookings.forEach(b => console.log(`   - ${b.id}: ${b.status}`))
      return { bookings }
    },
    
    // POST /api/bookings/create
    createBooking: (bookingData) => {
      console.log('📝 API: POST /api/bookings/create')
      const newBooking = {
        id: 'local-' + Date.now(),
        ...bookingData,
        status: 'pending',
        created_at: new Date().toISOString()
      }
      
      data.bookings.push(newBooking)
      fs.writeFileSync(dbFile, JSON.stringify(data, null, 2))
      
      console.log(`   Created: ${newBooking.id}`)
      return { success: true, booking: newBooking }
    },
    
    // Check database directly
    checkDatabase: () => {
      console.log('🗄️ Database check:')
      console.log(`   Total bookings: ${data.bookings.length}`)
      return data.bookings.length
    }
  }
}

// Test the flow
async function testFlow() {
  console.log('🔍 Testing local booking flow...\n')
  
  const api = simulateAPI()
  
  // Step 1: Initial state
  console.log('1. Initial state:')
  api.getBookings()
  const initialCount = api.checkDatabase()
  console.log()
  
  // Step 2: Create a booking
  console.log('2. Creating new booking:')
  const newBooking = {
    student_name: 'New Student',
    email: 'new@test.com',
    phone: '0422222222',
    date: '2026-04-11',
    time: '14:00:00',
    lesson_type: 'casual'
  }
  
  api.createBooking(newBooking)
  console.log()
  
  // Step 3: Check database immediately
  console.log('3. Database after creation:')
  const afterCreateCount = api.checkDatabase()
  console.log()
  
  // Step 4: API response after creation
  console.log('4. API response after creation:')
  api.getBookings()
  console.log()
  
  // Step 5: Analyze
  console.log('5. Analysis:')
  console.log(`   Database count: ${afterCreateCount}`)
  console.log(`   Initial count: ${initialCount}`)
  
  if (afterCreateCount > initialCount) {
    console.log('   ✅ Booking saved to database')
  } else {
    console.log('   ❌ Booking NOT saved to database')
  }
  
  // Simulate the bug: What if API returns old cached data?
  console.log('\n6. Simulating caching bug:')
  console.log('   What if API caches response and returns old data?')
  console.log('   Database has 2 bookings, API returns 1 booking')
  console.log('   This is what you\'re experiencing!')
  
  console.log('\n🎯 Possible causes:')
  console.log('   - Vercel edge caching')
  console.log('   - Browser caching')
  console.log('   - Database replication lag')
  console.log('   - API code bug (filter/limit)')
}

testFlow().catch(console.error)