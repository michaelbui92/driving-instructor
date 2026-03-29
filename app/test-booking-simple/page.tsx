'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/db-client'

export default function TestBookingPage() {
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    studentName: 'Test Student',
    email: 'test@example.com',
    phone: '0412345678',
    date: '2026-04-01',
    time: '09:00',
    lessonType: 'single'
  })

  const supabase = createClient()

  const loadBookings = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('bookings_new')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error loading bookings:', error)
    } else {
      setBookings(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    loadBookings()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const response = await fetch('/api/bookings/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })

    const result = await response.json()
    
    if (result.error) {
      alert('Error: ' + result.error)
    } else {
      alert('Booking created!')
      setForm({
        studentName: 'Test Student',
        email: 'test@example.com',
        phone: '0412345678',
        date: '2026-04-01',
        time: '09:00',
        lessonType: 'single'
      })
      loadBookings()
    }
  }

  const updateStatus = async (id: string, status: string) => {
    const response = await fetch(`/api/bookings/${id}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    })

    const result = await response.json()
    
    if (result.error) {
      alert('Error: ' + result.error)
    } else {
      alert(`Status updated to ${status}`)
      loadBookings()
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Test Booking Page</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Create Booking Form */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Create Booking</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Student Name</label>
              <input
                type="text"
                value={form.studentName}
                onChange={(e) => setForm({...form, studentName: e.target.value})}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({...form, email: e.target.value})}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({...form, phone: e.target.value})}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({...form, date: e.target.value})}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Time</label>
              <input
                type="time"
                value={form.time}
                onChange={(e) => setForm({...form, time: e.target.value})}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Lesson Type</label>
              <select
                value={form.lessonType}
                onChange={(e) => setForm({...form, lessonType: e.target.value})}
                className="w-full p-2 border rounded"
              >
                <option value="single">Single Lesson ($55)</option>
                <option value="casual">Casual Lesson ($45)</option>
              </select>
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Create Booking
            </button>
          </form>
        </div>

        {/* Bookings List */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">
            Bookings ({bookings.length})
            <button 
              onClick={loadBookings}
              className="ml-4 text-sm bg-gray-100 px-3 py-1 rounded hover:bg-gray-200"
            >
              Refresh
            </button>
          </h2>
          
          {loading ? (
            <p>Loading...</p>
          ) : bookings.length === 0 ? (
            <p className="text-gray-500">No bookings yet</p>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div key={booking.id} className="border p-4 rounded">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{booking.student_name || 'Guest'}</p>
                      <p className="text-sm text-gray-600">{booking.email}</p>
                      <p className="text-sm">
                        {booking.date} at {booking.time}
                      </p>
                      <p className="text-sm">
                        {booking.lesson_type === 'single' ? 'Single Lesson ($55)' : 'Casual Lesson ($45)'}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded text-sm ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex gap-2">
                    {booking.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateStatus(booking.id, 'confirmed')}
                          className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => updateStatus(booking.id, 'cancelled')}
                          className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                    {booking.status === 'confirmed' && (
                      <button
                        onClick={() => updateStatus(booking.id, 'cancelled')}
                        className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      >
                        Cancel
                      </button>
                    )}
                    {booking.status === 'cancelled' && (
                      <button
                        onClick={() => updateStatus(booking.id, 'confirmed')}
                        className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                      >
                        Re-confirm
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded">
        <h3 className="font-medium mb-2">Database Info</h3>
        <p className="text-sm">
          This page uses the unified database client. In production with Supabase env vars,
          it uses Supabase. Locally with <code>USE_LOCAL_DB=true</code>, it uses SQLite.
        </p>
        <p className="text-sm mt-2">
          Current mode: <code>{process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Supabase' : 'SQLite (local)'}</code>
        </p>
      </div>
    </div>
  )
}
