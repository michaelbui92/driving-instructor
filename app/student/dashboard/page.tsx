'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

type Booking = {
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
  const [student, setStudent] = useState<Student | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming')
  const [reschedulingBooking, setReschedulingBooking] = useState<Booking | null>(null)
  const [newDate, setNewDate] = useState('')
  const [newTime, setNewTime] = useState('')
  const [actionLoading, setActionLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const router = useRouter()

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
        throw new Error('Failed to load dashboard')
      }

      const data = await res.json()
      setStudent(data.student)
      setBookings(data.bookings.all)
    } catch (err) {
      console.error('Dashboard load error:', err)
      setMessage({ type: 'error', text: 'Failed to load dashboard' })
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/student-auth/logout', { method: 'POST' })
      router.push('/student/login')
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  const handleCancel = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return

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
      setMessage({ type: 'success', text: 'Booking cancelled successfully' })
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message })
    } finally {
      setActionLoading(false)
    }
  }

  const handleReschedule = async (booking: Booking) => {
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

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'upcoming') return b.status === 'pending' || b.status === 'confirmed'
    if (activeTab === 'completed') return b.status === 'completed'
    if (activeTab === 'cancelled') return b.status === 'cancelled'
    return true
  })

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00')
    return date.toLocaleDateString('en-AU', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
            <p className="text-gray-600">{student?.email}</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/book"
              className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
            >
              Book New Lesson
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition"
            >
              Log Out
            </button>
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

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-500">Upcoming</p>
            <p className="text-2xl font-bold text-blue-600">
              {bookings.filter((b) => b.status === 'pending' || b.status === 'confirmed').length}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-500">Completed</p>
            <p className="text-2xl font-bold text-green-600">
              {bookings.filter((b) => b.status === 'completed').length}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-500">Total</p>
            <p className="text-2xl font-bold text-gray-600">{bookings.length}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          {(['upcoming', 'completed', 'cancelled'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium capitalize transition ${
                activeTab === tab
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-xl p-8 shadow-sm text-center">
            <p className="text-gray-500 mb-4">No {activeTab} bookings</p>
            {activeTab === 'upcoming' && (
              <Link
                href="/book"
                className="text-blue-600 hover:underline"
              >
                Book your first lesson →
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-xl p-6 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {getLessonName(booking.lessonType)}
                      </h3>
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
                        {booking.status}
                      </span>
                    </div>
                    <p className="text-gray-600">
                      📅 {formatDate(booking.date)} at {booking.time}
                    </p>
                    {booking.claimCode && (
                      <p className="text-sm text-gray-400 mt-1">
                        Booking ref: {booking.claimCode}
                      </p>
                    )}
                  </div>

                  {activeTab === 'upcoming' && booking.status !== 'cancelled' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setReschedulingBooking(booking)}
                        className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                      >
                        Reschedule
                      </button>
                      <button
                        onClick={() => handleCancel(booking.id)}
                        disabled={actionLoading}
                        className="px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                {/* Reschedule Modal */}
                {reschedulingBooking?.id === booking.id && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-sm font-medium text-gray-700 mb-3">Select new date & time:</p>
                    <div className="flex gap-4 items-end">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Date</label>
                        <input
                          type="date"
                          value={newDate}
                          onChange={(e) => setNewDate(e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Time</label>
                        <input
                          type="time"
                          value={newTime}
                          onChange={(e) => setNewTime(e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleReschedule(booking)}
                          disabled={actionLoading || !newDate || !newTime}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                        >
                          Confirm
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
        )}
      </div>
    </div>
  )
}
