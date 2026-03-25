'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import { formatDate, getLessonTypeName, type Booking } from '@/lib/booking-utils'

type StudentBooking = {
  id: string
  studentName: string
  email: string
  phone: string
  date: string
  time: string
  lessonType: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  price: number
  createdAt: string
  claimCode?: string
}

type Student = {
  id: string
  email: string
  fullName?: string
  phone?: string
}

export default function StudentDashboardPage() {
  const [bookings, setBookings] = useState<StudentBooking[]>([])
  const [student, setStudent] = useState<Student | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming')
  const [reschedulingBooking, setReschedulingBooking] = useState<StudentBooking | null>(null)
  const [newDate, setNewDate] = useState('')
  const [newTime, setNewTime] = useState('')
  const [actionLoading, setActionLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const router = useRouter()
  const [portalImageIndex, setPortalImageIndex] = useState(0)
  const portalImages = ['/images/student-portal-1.png', '/images/student-portal-2.png']

  // Cycle between portal images every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setPortalImageIndex((prev) => (prev === 0 ? 1 : 0))
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    loadDashboard()
  }, [])

  const loadDashboard = async () => {
    try {
      const res = await fetch('/api/student/dashboard')

      if (!res.ok) {
        if (res.status === 401) {
          router.push('/student/login')
          return
        }
        const data = await res.json()
        throw new Error(data.error || data.details || 'Failed to load dashboard')
      }

      const data = await res.json()
      setStudent(data.student)
      setBookings(data.bookings.all)
    } catch (err: any) {
      console.error('Dashboard load error:', err)
      setMessage({ type: 'error', text: err.message || 'Failed to load dashboard' })
    } finally {
      setLoading(false)
    }
  }

  const upcomingBookings = bookings.filter(b => b.status === 'pending' || b.status === 'confirmed')
  const completedBookings = bookings.filter(b => b.status === 'completed')
  const cancelledBookings = bookings.filter(b => b.status === 'cancelled')

  const handleLogout = async () => {
    try {
      await fetch('/api/student-auth/logout', { method: 'POST' })
      router.push('/student/login')
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  const handleCancel = async (bookingId: string) => {
    setActionLoading(true)
    try {
      const res = await fetch(`/api/student/bookings/${bookingId}/cancel`, {
        method: 'POST',
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to cancel')
      }

      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' } : b))
      )
      setMessage({ type: 'success', text: 'Booking cancelled' })
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message })
    } finally {
      setActionLoading(false)
    }
  }

  const handleReschedule = async (booking: StudentBooking) => {
    if (!newDate || !newTime) {
      setMessage({ type: 'error', text: 'Please select date and time' })
      return
    }

    setActionLoading(true)
    try {
      const res = await fetch(`/api/student/bookings/${booking.id}/reschedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newDate, newTime }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to reschedule')
      }

      setBookings((prev) =>
        prev.map((b) =>
          b.id === booking.id ? { ...b, date: newDate, time: newTime, status: 'confirmed' } : b
        )
      )
      setReschedulingBooking(null)
      setNewDate('')
      setNewTime('')
      setMessage({ type: 'success', text: 'Booking rescheduled!' })
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message })
    } finally {
      setActionLoading(false)
    }
  }

  const getLessonName = (type: string) => {
    const names: Record<string, string> = {
      single: 'Single Lesson',
      package10: '10 Lesson Package',
      package20: '20 Lesson Package',
      test: 'Driving Test Package',
    }
    return names[type] || type
  }

  const filteredBookings = bookings.filter((b) => {
    if (selectedTab === 'upcoming') return b.status === 'pending' || b.status === 'confirmed'
    if (selectedTab === 'completed') return b.status === 'completed'
    if (selectedTab === 'cancelled') return b.status === 'cancelled'
    return true
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navbar showLocation={false} />
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar showLocation={false} />

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2">My Dashboard</h1>
            <p className="text-gray-600">Manage your driving lessons and track your progress</p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/book"
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-secondary transition font-semibold shadow-md hover:-translate-y-0.5"
            >
              📅 Book a Lesson
            </Link>
            {/* Cycling Portal Image */}
            <div className="relative w-32 h-32 md:w-40 md:h-40 flex-shrink-0">
              <Image
                src={portalImages[portalImageIndex]}
                alt="Student Portal"
                fill
                className="object-contain rounded-xl shadow-lg"
                priority
              />
            </div>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-50 text-green-700'
                : 'bg-red-50 text-red-700'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-3xl mb-2">📅</div>
            <div className="text-3xl font-bold text-primary">{upcomingBookings.length}</div>
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
            <div className="flex items-center justify-between px-6 py-3 border-b">
              <div className="flex">
                <button
                  className={`px-4 py-2 font-semibold transition ${
                    selectedTab === 'upcoming'
                      ? 'border-b-2 border-primary text-primary'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                  onClick={() => setSelectedTab('upcoming')}
                >
                  Upcoming ({upcomingBookings.length})
                </button>
                <button
                  className={`px-4 py-2 font-semibold transition ${
                    selectedTab === 'completed'
                      ? 'border-b-2 border-primary text-primary'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                  onClick={() => setSelectedTab('completed')}
                >
                  Completed ({completedBookings.length})
                </button>
                <button
                  className={`px-4 py-2 font-semibold transition ${
                    selectedTab === 'cancelled'
                      ? 'border-b-2 border-red-500 text-red-500'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                  onClick={() => setSelectedTab('cancelled')}
                >
                  Cancelled ({cancelledBookings.length})
                </button>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Filter by email..."
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  disabled
                />
              </div>
            </div>
          </div>

          {/* Bookings List */}
          <div className="p-6">
            {selectedTab === 'upcoming' && upcomingBookings.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📅</div>
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

            {selectedTab === 'cancelled' && cancelledBookings.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">✅</div>
                <h3 className="text-xl font-semibold mb-2">No Cancelled Bookings</h3>
                <p className="text-gray-600">Cancelled bookings will appear here</p>
              </div>
            )}

            {filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className="border rounded-lg p-6 mb-4 hover:shadow-lg transition bg-white last:mb-0"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{getLessonName(booking.lessonType)}</h3>
                      <span
                        className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                          booking.status === 'confirmed'
                            ? 'bg-green-100 text-green-700'
                            : booking.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : booking.status === 'cancelled'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-gray-600">
                      📅 {formatDate(booking.date)} at {booking.time}
                    </p>
                  </div>

                  {selectedTab === 'upcoming' && booking.status !== 'cancelled' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setReschedulingBooking(booking)
                          setNewDate(booking.date)
                          setNewTime(booking.time)
                        }}
                        className="px-4 py-2 border-2 border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50 transition font-medium"
                      >
                        Reschedule
                      </button>
                      <button
                        onClick={() => handleCancel(booking.id)}
                        disabled={actionLoading}
                        className="px-4 py-2 border-2 border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition font-medium disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                {/* Reschedule Modal */}
                {reschedulingBooking?.id === booking.id && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="bg-blue-50 rounded-lg p-4 mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Current booking:</p>
                      <p className="text-gray-600">{formatDate(booking.date)} at {booking.time}</p>
                    </div>
                    <div className="flex gap-4 items-end">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">New Date</label>
                        <input
                          type="date"
                          value={newDate}
                          onChange={(e) => setNewDate(e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">New Time</label>
                        <input
                          type="time"
                          value={newTime}
                          onChange={(e) => setNewTime(e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleReschedule(booking)}
                          disabled={actionLoading || !newDate || !newTime}
                          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition disabled:opacity-50"
                        >
                          {actionLoading ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          onClick={() => {
                            setReschedulingBooking(null)
                            setNewDate('')
                            setNewTime('')
                          }}
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
