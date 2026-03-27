import { Pool } from 'pg'

// Neon connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  max: 5, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 5000, // Return an error after 5 seconds if connection could not be established
})

// Helper function to query Neon
export async function queryNeon(text: string, params?: any[]) {
  const client = await pool.connect()
  try {
    const result = await client.query(text, params)
    return result
  } finally {
    client.release()
  }
}

// Get all bookings
export async function getAllBookings() {
  const result = await queryNeon(`
    SELECT 
      id,
      student_name,
      email,
      phone,
      date,
      time,
      lesson_type,
      status,
      created_at,
      updated_at,
      archived
    FROM bookings
    ORDER BY updated_at DESC, created_at DESC
  `)
  return result.rows
}

// Update booking status
export async function updateBookingStatus(bookingId: string, status: 'pending' | 'confirmed' | 'cancelled') {
  const result = await queryNeon(`
    UPDATE bookings 
    SET status = $1, updated_at = NOW()
    WHERE id = $2
    RETURNING *
  `, [status, bookingId])
  return result.rows[0]
}

// Create booking
export async function createBooking(booking: {
  student_name: string
  email: string
  phone: string
  date: string
  time: string
  lesson_type: string
}) {
  const result = await queryNeon(`
    INSERT INTO bookings (student_name, email, phone, date, time, lesson_type, status)
    VALUES ($1, $2, $3, $4, $5, $6, 'pending')
    RETURNING *
  `, [
    booking.student_name,
    booking.email,
    booking.phone,
    booking.date,
    booking.time,
    booking.lesson_type
  ])
  return result.rows[0]
}

// Test connection
export async function testConnection() {
  try {
    const result = await queryNeon('SELECT NOW() as current_time')
    return { success: true, time: result.rows[0].current_time }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}