const fs = require('fs')
const path = require('path')

// Simple JSON database
const dbPath = path.join(__dirname, 'local-db.json')

// Initial data
const initialData = {
  bookings: [
    {
      id: 'test-001',
      student_name: 'Test Student',
      email: 'test@example.com',
      phone: '0412345678',
      date: '2026-04-01',
      time: '10:00:00',
      lesson_type: 'single',
      status: 'pending',
      created_at: new Date().toISOString()
    },
    {
      id: 'test-002',
      student_name: 'Another Student',
      email: 'another@example.com',
      phone: '0498765432',
      date: '2026-04-02',
      time: '14:00:00',
      lesson_type: 'casual',
      status: 'confirmed',
      created_at: new Date().toISOString()
    },
    {
      id: 'test-003',
      student_name: 'Cancelled Student',
      email: 'cancelled@example.com',
      phone: '0411111111',
      date: '2026-04-03',
      time: '16:00:00',
      lesson_type: 'single',
      status: 'cancelled',
      created_at: new Date().toISOString()
    }
  ]
}

// Write to file
fs.writeFileSync(dbPath, JSON.stringify(initialData, null, 2))

console.log('🗄️ JSON database created:', dbPath)
console.log(`✅ ${initialData.bookings.length} test bookings created:`)

initialData.bookings.forEach(b => {
  console.log(`  - ${b.id}: ${b.student_name} | ${b.email} | ${b.date} | ${b.status}`)
})

// Simple API server for testing
console.log('\n🚀 To test with a local API server:')
console.log('1. Create a simple Node.js server that reads/writes to this JSON file')
console.log('2. Update your app to point to http://localhost:3001/api/bookings')
console.log('3. Test booking creation and retrieval locally')

// Create a simple test API
const testApiCode = `
const express = require('express')
const fs = require('fs')
const path = require('path')

const app = express()
app.use(express.json())

const dbPath = path.join(__dirname, 'local-db.json')

// GET all bookings
app.get('/api/bookings', (req, res) => {
  const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'))
  res.json({ bookings: data.bookings })
})

// Create booking
app.post('/api/bookings', (req, res) => {
  const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'))
  const newBooking = {
    id: 'local-' + Date.now(),
    ...req.body,
    status: 'pending',
    created_at: new Date().toISOString()
  }
  data.bookings.push(newBooking)
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2))
  res.json({ success: true, booking: newBooking })
})

app.listen(3001, () => {
  console.log('Local API running on http://localhost:3001')
})
`

fs.writeFileSync(path.join(__dirname, 'local-api-server.js'), testApiCode)
console.log('\n📁 Created local-api-server.js - run: node local-api-server.js')
console.log('🌐 Then test with: curl http://localhost:3001/api/bookings')