'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { formatDate, getLessonTypeName, type Booking } from '@/lib/booking-utils'

export default function DashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [selectedTab, setSelectedTab] = useState<'upcoming' | 'completed'>('upcoming')
  const [reschedulingBooking, setReschedulingBooking] = useState<Booking | null>(null)

  useEffect(() => {
    try {
      // Load bookings from localStorage
      const storedBookings = localStorage.getItem('bookings')
      if (storedBookings) {
        setBookings(JSON.parse(storedBookings))
      }
    } catch (error) {
      console.error('Error loading bookings:', error)
      setBookings([])
    }
  }, [])

  const upcomingBookings = bookings.filter(b => b.status === 'pending' || b.status === 'confirmed')
  const completedBookings = bookings.filter(b => b.status === 'completed')

  const cancelBooking = (bookingId: string) => {
    try {
      const updatedBookings = bookings.map(b =>
        b.id === bookingId ? { ...b, status: 'cancelled' as const } : b
      )
      setBookings(updatedBookings)
      localStorage.setItem('bookings', JSON.stringify(updatedBookings))
      alert('Booking cancelled successfully')
    } catch (error) {
      console.error('Error cancelling booking:', error)
      alert('Error cancelling booking. Please try again.')
    }
  }

  const completeBooking = (bookingId: string) => {
    try {
      const updatedBookings = bookings.map(b =>
        b.id === bookingId ? { ...b, status: 'completed' as const } : b
      )
      setBookings(updatedBookings)
      localStorage.setItem('bookings', JSON.stringify(updatedBookings))
    } catch (error) {
      console.error('Error completing booking:', error)
      alert('Error updating booking status. Please try again.')
    }
  }

  const handleReschedule = (booking: Booking) => {
    setReschedulingBooking(booking)
  }

  const saveReschedule = (newDate: string, newTime: string) => {
    try {
      const updatedBookings = bookings.map(b =>
        b.id === reschedulingBooking?.id
          ? { ...b, date: newDate, time: newTime }
          : b
      )
      setBookings(updatedBookings)
      localStorage.setItem('bookings', JSON.stringify(updatedBookings))
      alert('Booking rescheduled successfully')
      setReschedulingBooking(null)
    } catch (error) {
      console.error('Error rescheduling booking:', error)
      alert('Error rescheduling booking. Please try again.')
    }
  }

  const getUpcomingLessonsCount = () => {
    // Count all upcoming lessons including those in package bookings
    let count = 0
    upcomingBookings.forEach(b => {
      if (b.lessonSlots && b.lessonSlots.length > 0) {
        count += b.lessonSlots.length
      } else {
        count += 1
      }
    })
    return count
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-primary">🚗 Drive With Bui</Link>
            <div className="flex space-x-4">
              <Link
                href="/book"
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition"
              >
                New Booking
              </Link>
              <Link
                href="/"
                className="text-gray-700 hover:text-primary transition"
              >
                Home
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Student Dashboard</h1>
          <p className="text-gray-600">Manage your driving lessons and track your progress</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-3xl mb-2">📅</div>
            <div className="text-3xl font-bold text-primary">{getUpcomingLessonsCount()}</div>
            <p className="text-gray-600">Upcoming Lessons</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-3xl mb-2">✅</div>
            <div className="text-3xl font-bold text-green-600">{completedBookings.length}</div>
            <p className="text-gray-600">Completed Bookings</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-3xl mb-2">💰</div>
            <div className="text-3xl font-bold text-accent">
              ${upcomingBookings.reduce((sum, b) => sum + b.price, 0)}
            </div>
            <p className="text-gray-600">Upcoming Cost</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg">
          <div className="border-b">
            <div className="flex">
              <button
                className={`flex-1 px-6 py-4 font-semibold transition ${
                  selectedTab === 'upcoming'
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                onClick={() => setSelectedTab('upcoming')}
              >
                Upcoming ({upcomingBookings.length})
              </button>
              <button
                className={`flex-1 px-6 py-4 font-semibold transition ${
                  selectedTab === 'completed'
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                onClick={() => setSelectedTab('completed')}
              >
                Completed ({completedBookings.length})
              </button>
            </div>
          </div>

          {/* Bookings List */}
          <div className="p-6">
            {selectedTab === 'upcoming' && upcomingBookings.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-xl font-semibold mb-2">No Upcoming Lessons</h3>
                <p className="text-gray-600 mb-6">Book your first lesson to get started</p>
                <Link
                  href="/book"
                  className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-secondary transition"
                >
                  Book Now
                </Link>
              </div>
            )}

            {selectedTab === 'completed' && completedBookings.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎯</div>
                <h3 className="text-xl font-semibold mb-2">No Completed Lessons Yet</h3>
                <p className="text-gray-600">Your completed lessons will appear here</p>
              </div>
            )}

            {(selectedTab === 'upcoming' ? upcomingBookings : completedBookings).map((booking) => (
              <div
                key={booking.id}
                className="border rounded-lg p-6 mb-4 hover:shadow-md transition"
              >
                <div className="grid md:grid-cols-6 gap-4">
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600 mb-1">
                      {booking.lessonSlots && booking.lessonSlots.length > 0
                        ? 'Lessons'
                        : 'Date & Time'}
                    </p>
                    {booking.lessonSlots && booking.lessonSlots.length > 0 ? (
                      <div className="space-y-1">
                        {booking.lessonSlots.map((slot, index) => (
                          <div key={index}>
                            <p className="font-semibold">{formatDate(slot.date)}</p>
                            <p className="text-gray-600">{slot.time}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <>
                        <p className="font-semibold">{formatDate(booking.date)}</p>
                        <p className="text-gray-600">{booking.time}</p>
                      </>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Lesson Type</p>
                    <p className="font-semibold">{getLessonTypeName(booking.lessonType)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Price</p>
                    <p className="font-semibold text-primary">${booking.price}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Status</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                      booking.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : booking.status === 'confirmed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-end space-x-2">
                    {selectedTab === 'upcoming' && (
                      <>
                        {booking.lessonSlots && booking.lessonSlots.length === 1 && (
                          <button
                            onClick={() => handleReschedule(booking)}
                            className="flex-1 px-4 py-2 border-2 border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50 transition"
                          >
                            🔄 Reschedule
                          </button>
                        )}
                        {booking.lessonType === 'single' && (
                          <button
                            onClick={() => handleReschedule(booking)}
                            className="flex-1 px-4 py-2 border-2 border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50 transition"
                          >
                            🔄 Reschedule
                          </button>
                        )}
                        <button
                          onClick={() => cancelBooking(booking.id)}
                          className="flex-1 px-4 py-2 border-2 border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => completeBooking(booking.id)}
                          className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition"
                        >
                          Complete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Section */}
        {completedBookings.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-lg mt-8">
            <h2 className="text-2xl font-bold mb-4">Your Progress</h2>
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span className="font-semibold">Lessons Completed</span>
                <span className="font-semibold">{completedBookings.length} bookings</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-primary h-4 rounded-full transition-all"
                  style={{ width: `${Math.min((completedBookings.length / 10) * 100, 100)}%` }}
                />
              </div>
            </div>
            {completedBookings.length >= 5 && (
              <p className="text-green-600 font-semibold">🎉 Great progress! Keep going!</p>
            )}
          </div>
        )}
      </div>

      {/* Reschedule Modal */}
      {reschedulingBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Reschedule Booking</h2>
              <button
                onClick={() => setReschedulingBooking(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">Current Date & Time:</p>
                <p className="font-semibold">{formatDate(reschedulingBooking.date)}</p>
                <p className="text-gray-600">{reschedulingBooking.time}</p>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-gray-600 mb-2">New Date:</p>
                <input
                  type="date"
                  id="newDate"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  defaultValue={reschedulingBooking.date}
                />
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-2">New Time:</p>
                <select
                  id="newTime"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  defaultValue={reschedulingBooking.time}
                >
                  <option value="6:00 PM">6:00 PM</option>
                  <option value="7:00 PM">7:00 PM</option>
                  <option value="8:00 PM">8:00 PM (Night Time)</option>
                  <option value="8:00 AM">8:00 AM</option>
                  <option value="9:00 AM">9:00 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="12:00 PM">12:00 PM</option>
                  <option value="1:00 PM">1:00 PM</option>
                  <option value="2:00 PM">2:00 PM</option>
                  <option value="3:00 PM">3:00 PM</option>
                  <option value="4:00 PM">4:00 PM</option>
                  <option value="5:00 PM">5:00 PM</option>
                  <option value="6:00 PM">6:00 PM</option>
                  <option value="7:00 PM">7:00 PM</option>
                </select>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
                <strong>Note:</strong> If you book 6pm, 7pm is automatically blocked to ensure full dedication to your lesson.
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setReschedulingBooking(null)}
                className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const newDate = (document.getElementById('newDate') as HTMLInputElement)?.value || ''
                  const newTime = (document.getElementById('newTime') as HTMLSelectElement)?.value || ''
                  if (newDate && newTime) {
                    saveReschedule(newDate, newTime)
                  } else {
                    alert('Please select new date and time')
                  }
                }}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}