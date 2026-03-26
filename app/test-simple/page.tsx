'use client'

import { useState, useEffect } from 'react'

interface Booking {
  id: string
  studentName: string
  email: string
  phone: string
  date: string
  time: string
  lessonType: string
  status: string
  price: number
  createdAt: string
}

export default function TestSimplePage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/bookings?t=${Date.now()}`)
        const data = await res.json()
        console.log('📊 API Response:', data)
        setBookings(data.bookings || [])
      } catch (err) {
        console.error('Error:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <div>Loading...</div>

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Simple Test - Raw API Data</h1>
      <p>Total bookings: {bookings.length}</p>
      
      <div className="mt-4">
        {bookings.map(booking => (
          <div key={booking.id} className="border p-4 mb-2">
            <p><strong>ID:</strong> {booking.id}</p>
            <p><strong>Status:</strong> {booking.status}</p>
            <p><strong>Date:</strong> {booking.date}</p>
            <p><strong>Student:</strong> {booking.studentName || '(empty)'}</p>
            <p><strong>Email:</strong> {booking.email}</p>
            <p><strong>Is pending?</strong> {booking.status === 'pending' ? 'YES' : 'NO'}</p>
            <p><strong>Is upcoming?</strong> {booking.date >= new Date().toISOString().split('T')[0] ? 'YES' : 'NO'}</p>
          </div>
        ))}
      </div>
    </div>
  )
}