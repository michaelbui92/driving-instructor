const sqlite3 = require('sqlite3').verbose()
const { open } = require('sqlite')
const path = require('path')

async function setupLocalDatabase() {
  console.log('🗄️ Setting up local SQLite database...')
  
  // Open database
  const db = await open({
    filename: path.join(__dirname, 'local-bookings.db'),
    driver: sqlite3.Database
  })
  
  // Create bookings table (simplified for SQLite)
  await db.exec(`
    CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY,
      student_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      lesson_type TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `)
  
  // Create some test data
  const testBookings = [
    {
      id: 'test-001',
      student_name: 'Test Student',
      email: 'test@example.com',
      phone: '0412345678',
      date: '2026-04-01',
      time: '10:00:00',
      lesson_type: 'single',
      status: 'pending'
    },
    {
      id: 'test-002', 
      student_name: 'Another Student',
      email: 'another@example.com',
      phone: '0498765432',
      date: '2026-04-02',
      time: '14:00:00',
      lesson_type: 'casual',
      status: 'confirmed'
    },
    {
      id: 'test-003',
      student_name: 'Cancelled Student',
      email: 'cancelled@example.com',
      phone: '0411111111',
      date: '2026-04-03',
      time: '16:00:00',
      lesson_type: 'single',
      status: 'cancelled'
    }
  ]
  
  // Insert test data
  for (const booking of testBookings) {
    await db.run(
      `INSERT OR IGNORE INTO bookings (id, student_name, email, phone, date, time, lesson_type, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [booking.id, booking.student_name, booking.email, booking.phone, booking.date, 
       booking.time, booking.lesson_type, booking.status]
    )
  }
  
  // Verify data
  const allBookings = await db.all('SELECT * FROM bookings ORDER BY created_at DESC')
  console.log(`✅ Local database created with ${allBookings.length} test bookings`)
  
  allBookings.forEach(b => {
    console.log(`  - ${b.id}: ${b.student_name} | ${b.email} | ${b.date} | ${b.status}`)
  })
  
  await db.close()
  console.log('\n📊 Database file: local-bookings.db')
  console.log('🔧 Next: Update app to use local database for testing')
}

setupLocalDatabase().catch(console.error)