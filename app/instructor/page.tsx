'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { formatDate, getLessonTypeName, type Booking } from '@/lib/booking-utils'

export default function InstructorPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [selectedTab, setSelectedTab] = useState<'today' | 'upcoming' | 'all'>('today')
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)

  useEffect(() => {
    // Load bookings from localStorage
    const storedBookings = localStorage.getItem('bookings')
    if (storedBookings) {
      setBookings(JSON.parse(storedBookings))
    }
  }, [])

  const get Today's date
  const today = new Date().toISOString().split('T')[0]

  const todayBookings = bookings.filter(b => b.date === today && b.status !== 'cancelled')
  const upcomingBookings = bookings.filter(
    b => b.date > today && (b.status === 'pending' || b.status === 'confirmed')
  )
  const allBookings = bookings.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const getFilteredBookings = () => {
    switch (selectedTab) {
      case 'today':
        return todayBookings
      case 'upcoming':
        return upcomingBookings
      case 'all':
        return allBookings
      default:
        return allBookings
    }
  }

  const updateBookingStatus = (bookingId: string, newStatus: Booking['status']) => {
    const updatedBookings = bookings.map(b =>
      b.id === bookingId ? { ...b, status: newStatus } : b
    )
    setBookings(updatedBookings)
    localStorage.setItem('bookings', JSON.stringify(updatedBookings))
    alert(`Booking status updated to: ${newStatus}`)
  }

  const getTotalRevenue = () => {
    return bookings
      .filter(b => b.status === 'completed')
      .reduce((sum, b) => sum + b.price, 0)
  }

  const getPendingRevenue = () => {
    return bookings
      .filter(b => b.status !== 'cancelled')
      .reduce((sum, b) => sum + b.price, 0)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
      {/* Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-primary">🚗 Driving Instructor</Link>
            <div className="flex space-x-4">
              <Link
                href="/dashboard"
                className="px-4 py-2 border-2 border-primary text-primary rounded-lg hover:bg-blue-50 transition"
              >
                Student View
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
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Instructor Portal</h1>
          <p className="text-gray-600">Manage your schedule and student bookings</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-3xl mb-2">📅</div>
            <div className="text-3xl font-bold text-primary">{todayBookings.length}</div>
            <p className="text-gray-600">Today's Lessons</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-3xl mb-2">🗓️</div>
            <div className="text-3xl font-bold text-blue-600">{upcomingBookings.length}</div>
            <p className="text-gray-600">Upcoming</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-3xl mb-2">✅</div>
            <div className="text-3xl font-bold text-green-600">
              ${getTotalRevenue()}
            </div>
            <p className="text-gray-600">Revenue (Completed)</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-3xl mb-2">💰</div>
            <div className="text-3xl font-bold text-accent">
              ${getPendingRevenue()}
            </div>
            <p className="text-gray-600">Pending Revenue</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-8">
          <div className="border-b">
            <div className="flex">
              <button
                className={`flex-1 px-6 py-4 font-semibold transition ${
                  selectedTab === 'today'
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                onClick={() => setSelectedTab('today')}
              >
                Today ({todayBookings.length})
              </button>
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
                  selectedTab === 'all'
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                onClick={() => setSelectedTab('all')}
              >
                All ({allBookings.length})
              </button>
            </div>
          </div>

          {/* Bookings List */}
          <div className="p-6">
            {getFilteredBookings().length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-xl font-semibold mb-2">No Bookings Found</h3>
                <p className="text-gray-600">Bookings will appear here once students schedule lessons</p>
              </div>
            )}

            {getFilteredBookings().map((booking) => (
              <div
                key={booking.id}
                className="border rounded-lg p-6 mb-4 hover:shadow-md transition cursor-pointer"
                onClick={() => setSelectedBooking(booking)}
              >
                <div className="grid md:grid-cols-5 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Date & Time</p>
                    <p className="font-semibold">{formatDate(booking.date)}</p>
                    <p className="text-gray-600">{booking.time}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Student</p>
                    <p className="font-semibold">{booking.studentName}</p>
                    <p className="text-gray-600 text-sm">{booking.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Phone</p>
                    <p className="font-semibold">{booking.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Lesson Type</p>
                    <p className="font-semibold">{getLessonTypeName(booking.lessonType)}</p>
                    <p className="text-primary font-bold">${booking.price}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Status / Action</p>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                        booking.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : booking.status === 'confirmed'
                          ? 'bg-green-100 text-green-800'
                          : booking.status === 'completed'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                      {booking.status === 'pending' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            updateBookingStatus(booking.id, 'confirmed')
                          }}
                          className="text-primary hover:text-secondary text-sm font-semibold"
                        >
                          Confirm
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Booking Detail Modal */}
        {selectedBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Booking Details</h2>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Booking ID</p>
                    <p className="font-semibold">{selectedBooking.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Status</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                      selectedBooking.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : selectedBooking.status === 'confirmed'
                        ? 'bg-green-100 text-green-800'
                        : selectedBooking.status === 'completed'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Student Name</p>
                    <p className="font-semibold">{selectedBooking.studentName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Email</p>
                    <p className="font-semibold">{selectedBooking.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Phone</p>
                    <p className="font-semibold">{selectedBooking.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Lesson Type</p>
                    <p className="font-semibold">{getLessonTypeName(selectedBooking.lessonType)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Date</p>
                    <p className="font-semibold">{formatDate(selectedBooking.date)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Time</p>
                    <p className="font-semibold">{selectedBooking.time}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Price</p>
                    <p className="font-semibold text-2xl text-primary">${selectedBooking.price}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Booked On</p>
                    <p className="font-semibold">{new Date(selectedBooking.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="border-t pt-6">
                  <p className="text-sm text-gray-600 mb-4">Update Status</p>
                  <div className="flex flex-wrap gap-3">
                    {selectedBooking.status !== 'confirmed' && (
                      <button
                        onClick={() => {
                          updateBookingStatus(selectedBooking.id, 'confirmed')
                          setSelectedBooking(null)
                        }}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                      >
                        Confirm Booking
                      </button>
                    )}
                    {selectedBooking.status !== 'completed' && (
                      <button
                        onClick={() => {
                          updateBookingStatus(selectedBooking.id, 'completed')
                          setSelectedBooking(null)
                        }}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition"
                      >
                        Mark as Completed
                      </button>
                    )}
                    {selectedBooking.status !== 'cancelled' && (
                      <button
                        onClick={() => {
                          updateBookingStatus(selectedBooking.id, 'cancelled')
                          setSelectedBooking(null)
                        }}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                      >
                        Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}