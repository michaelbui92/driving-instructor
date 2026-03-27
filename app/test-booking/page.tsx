'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

interface Booking {
  id: string
  studentName: string
  date: string
  time: string
  status: 'pending' | 'confirmed' | 'cancelled'
  createdAt: string
}

export default function TestBookingPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [studentName, setStudentName] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [loading, setLoading] = useState(false)

  // Load bookings from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('test-bookings')
    if (saved) {
      try {
        setBookings(JSON.parse(saved))
      } catch (e) {
        console.error('Error loading bookings:', e)
      }
    }
  }, [])

  // Save bookings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('test-bookings', JSON.stringify(bookings))
  }, [bookings])

  const createBooking = () => {
    if (!studentName.trim()) {
      alert('Please enter a name')
      return
    }

    if (!date) {
      alert('Please select a date')
      return
    }

    if (!time) {
      alert('Please select a time')
      return
    }

    setLoading(true)

    const newBooking: Booking = {
      id: `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      studentName: studentName.trim(),
      date,
      time,
      status: 'pending',
      createdAt: new Date().toISOString()
    }

    setBookings(prev => [newBooking, ...prev])
    
    // Reset form
    setStudentName('')
    setDate('')
    setTime('')
    
    setLoading(false)
    alert(`Booking created for ${newBooking.studentName} on ${newBooking.date} at ${newBooking.time}`)
  }

  const updateStatus = (bookingId: string, newStatus: 'confirmed' | 'cancelled') => {
    setBookings(prev => 
      prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: newStatus }
          : booking
      )
    )
  }

  const deleteBooking = (bookingId: string) => {
    if (confirm('Delete this booking?')) {
      setBookings(prev => prev.filter(booking => booking.id !== bookingId))
    }
  }

  const clearAllBookings = () => {
    if (confirm('Clear ALL test bookings? This cannot be undone.')) {
      setBookings([])
      localStorage.removeItem('test-bookings')
    }
  }

  // Generate tomorrow's date as default
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const defaultDate = tomorrow.toISOString().split('T')[0]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar showLocation={false} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Test Booking System</h1>
          <p className="text-gray-600">
            Local storage booking system - no Supabase, no replication lag
          </p>
          <div className="mt-4 flex gap-4">
            <Link
              href="/bookings/public"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              ← Back to Public Bookings
            </Link>
            <button
              onClick={clearAllBookings}
              className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
            >
              Clear All Test Data
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left: Create Booking Form */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Create Test Booking</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Student Name
                </label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Enter student name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={date || defaultDate}
                  onChange={(e) => setDate(e.target.value)}
                  min={defaultDate}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time
                </label>
                <select
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select time</option>
                  <option value="09:00">09:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="12:00">12:00 PM</option>
                  <option value="13:00">01:00 PM</option>
                  <option value="14:00">02:00 PM</option>
                  <option value="15:00">03:00 PM</option>
                  <option value="16:00">04:00 PM</option>
                  <option value="17:00">05:00 PM</option>
                  <option value="18:00">06:00 PM</option>
                  <option value="19:00">07:00 PM</option>
                  <option value="20:00">08:00 PM</option>
                </select>
              </div>

              <button
                onClick={createBooking}
                disabled={loading}
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-semibold"
              >
                {loading ? 'Creating...' : 'Create Test Booking'}
              </button>
            </div>

            <div className="mt-8 pt-6 border-t">
              <h3 className="text-lg font-semibold mb-3">How This Works</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Uses browser localStorage (no Supabase)</li>
                <li>• No replication lag - changes are immediate</li>
                <li>• Data persists only in this browser</li>
                <li>• Perfect for testing booking flows</li>
                <li>• Clear data with "Clear All Test Data" button</li>
              </ul>
            </div>
          </div>

          {/* Right: Bookings List */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Test Bookings</h2>
              <div className="text-sm text-gray-500">
                {bookings.length} booking{bookings.length !== 1 ? 's' : ''}
              </div>
            </div>

            {bookings.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold mb-2">No Test Bookings</h3>
                <p className="text-gray-500">
                  Create your first test booking using the form
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {bookings.map((booking) => (
                  <div key={booking.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{booking.studentName}</h3>
                        <p className="text-sm text-gray-600">
                          {booking.date} at {booking.time}
                        </p>
                        <p className="text-xs text-gray-500">
                          Created: {new Date(booking.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {booking.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="mt-4 flex gap-2">
                      {booking.status === 'pending' && (
                        <>
                          <button
                            onClick={() => updateStatus(booking.id, 'confirmed')}
                            className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
                          >
                            ✓ Confirm
                          </button>
                          <button
                            onClick={() => updateStatus(booking.id, 'cancelled')}
                            className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium"
                          >
                            ✗ Cancel
                          </button>
                        </>
                      )}
                      {booking.status === 'confirmed' && (
                        <button
                          onClick={() => updateStatus(booking.id, 'cancelled')}
                          className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium"
                        >
                          ✗ Cancel
                        </button>
                      )}
                      <button
                        onClick={() => deleteBooking(booking.id)}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>

                    <div className="mt-2 text-xs text-gray-400">
                      ID: {booking.id.substring(0, 8)}...
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Stats */}
            {bookings.length > 0 && (
              <div className="mt-6 pt-6 border-t">
                <h3 className="text-lg font-semibold mb-3">Status Summary</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-700">
                      {bookings.filter(b => b.status === 'pending').length}
                    </div>
                    <div className="text-sm text-yellow-600">Pending</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-700">
                      {bookings.filter(b => b.status === 'confirmed').length}
                    </div>
                    <div className="text-sm text-green-600">Confirmed</div>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-700">
                      {bookings.filter(b => b.status === 'cancelled').length}
                    </div>
                    <div className="text-sm text-red-600">Cancelled</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Debug Info */}
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <h3 className="font-semibold mb-2">Debug Information</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <div>• LocalStorage key: <code>test-bookings</code></div>
            <div>• Bookings stored: {bookings.length}</div>
            <div>• Last updated: {new Date().toLocaleTimeString()}</div>
            <div>• Data location: Browser localStorage only</div>
          </div>
        </div>
      </div>
    </div>
  )
}