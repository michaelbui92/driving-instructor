
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
