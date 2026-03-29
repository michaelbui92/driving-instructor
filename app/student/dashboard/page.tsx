'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { supabase } from '@/lib/supabase'
import { formatDate, getAvailableSlots, getLessonPrice } from '@/lib/booking-utils'

type BookingType = {
  id: string
  student_name: string
  email: string
  phone: string
  address: string
  date: string
  time: string
  lesson_type: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  created_at: string
}

export default function StudentDashboardPage() {
  const [bookings, setBookings] = useState<BookingType[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming')
  const [reschedulingBooking, setReschedulingBooking] = useState<BookingType | null>(null)
  const [selectedNewDate, setSelectedNewDate] = useState<string>('')
  const [dateHasNoSlots, setDateHasNoSlots] = useState<boolean>(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [userEmail, setUserEmail] = useState<string>('')
  const router = useRouter()

  // Get user email from cookie
  useEffect(() => {
    const cookies = document.cookie.split(';')
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=')
      if (name === 'sb-email') {
        setUserEmail(decodeURIComponent(value))
        break
      }
    }
  }, [])

  // Load bookings on mount and auto-refresh
  useEffect(() => {
    if (!userEmail) return
    
    loadDashboard()
    
    // Auto-refresh every 10 seconds
    const interval = setInterval(() => {
      loadDashboard()
    }, 10000)

    // Real-time subscription
    const channel = supabase
      .channel('student-bookings-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings_new'
        },
        () => {
          console.log('Real-time booking change detected')
          loadDashboard()
        }
      )
      .subscribe()

    return () => {
      clearInterval(interval)
      supabase.removeChannel(channel)
    }
  }, [userEmail])

  const loadDashboard = async () => {
    if (!userEmail) return
    
    try {
      console.log('📊 Loading bookings for:', userEmail)
      
      const { data, error } = await supabase
        .from('bookings_new')
        .select('*')
        .eq('email', userEmail)
        .order('date', { ascending: false })

      if (error) {
        console.error('Error loading bookings:', error)
        throw error
      }

      console.log('✅ Loaded bookings:', data?.length || 0)
      setBookings(data || [])
    } catch (err) {
      console.error('Dashboard load error:', err)
      setMessage({ type: 'error', text: 'Failed to load bookings' })
      setBookings([])
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
      const { error } = await supabase
        .from('bookings_new')
        .update({ status: 'cancelled' })
        .eq('id', bookingId)

      if (error) throw error

      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' as const } : b))
      )
      setMessage({ type: 'success', text: 'Booking cancelled successfully' })
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to cancel' })
    } finally {
      setActionLoading(false)
    }
  }

  const handleReschedule = (booking: BookingType) => {
    setReschedulingBooking(booking)
    setSelectedNewDate(booking.date)
    // Convert to Booking format expected by getAvailableSlots
    const bookingsForCheck = bookings.map(b => ({
      id: b.id,
      studentName: b.student_name,
      email: b.email,
      phone: b.phone,
      date: b.date,
      time: b.time,
      lessonType: b.lesson_type,
      status: b.status,
      price: getLessonPrice(b.lesson_type),
      createdAt: b.created_at,
    }))
    const availableSlots = getAvailableSlots(booking.date, bookingsForCheck.filter(b => b.id !== booking.id))
    setDateHasNoSlots(availableSlots.length === 0)
  }

  const saveReschedule = async () => {
    const newDateSelect = document.getElementById('newDate') as HTMLSelectElement
    const newTimeSelect = document.getElementById('newTime') as HTMLSelectElement
    
    const newDate = newDateSelect?.value || ''
    const newTime = newTimeSelect?.value || ''
    
    if (!newDate || !newTime) {
      alert('Please select date and time')
      return
    }

    if (!newTimeSelect) {
      alert('No available time slots for this date. Please select a different date.')
      return
    }

    setActionLoading(true)
    try {
      const { error } = await supabase
        .from('bookings_new')
        .update({ date: newDate, time: newTime, status: 'pending' })
        .eq('id', reschedulingBooking?.id)

      if (error) throw error

      setBookings((prev) =>
        prev.map((b) =>
          b.id === reschedulingBooking?.id ? { ...b, date: newDate, time: newTime, status: 'pending' as const } : b
        )
      )
      setReschedulingBooking(null)
      setSelectedNewDate('')
      setMessage({ type: 'success', text: 'Booking rescheduled! Awaiting instructor confirmation.' })
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to reschedule' })
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

  const getLessonName = (type: string) => {
    const names: Record<string, string> = {
      single: 'Single Lesson',
      casual: 'Casual Driving',
      package10: '10 Lesson Package',
      package20: '20 Lesson Package',
      test: 'Driving Test Package',
    }
    return names[type] || type
  }

  const getAvailableTimeOptions = (date: string) => {
    if (!date) return []
    // Convert to Booking format expected by getAvailableSlots
    const bookingsForCheck = bookings.map(b => ({
      id: b.id,
      studentName: b.student_name,
      email: b.email,
      phone: b.phone,
      date: b.date,
      time: b.time,
      lessonType: b.lesson_type,
      status: b.status,
      price: getLessonPrice(b.lesson_type),
      createdAt: b.created_at,
    }))
    const existingBookingsExcludingCurrent = bookingsForCheck.filter(b => b.id !== reschedulingBooking?.id)
    const availableSlots = getAvailableSlots(date, existingBookingsExcludingCurrent)
    return availableSlots.map(slot => slot.time)
  }

  const getDatesWithAvailableSlots = () => {
    const dates: {date: string, formatted: string, hasSlots: boolean}[] = []
    const today = new Date()
    
    // Convert to Booking format expected by getAvailableSlots
    const bookingsForCheck = bookings.map(b => ({
      id: b.id,
      studentName: b.student_name,
      email: b.email,
      phone: b.phone,
      date: b.date,
      time: b.time,
      lessonType: b.lesson_type,
      status: b.status,
      price: getLessonPrice(b.lesson_type),
      createdAt: b.created_at,
    }))
    
    for (let i = 1; i <= 28; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      const dateString = date.toISOString().split('T')[0]
      
      const existingBookingsExcludingCurrent = reschedulingBooking 
        ? bookingsForCheck.filter(b => b.id !== reschedulingBooking.id)
        : bookingsForCheck
      const availableSlots = getAvailableSlots(dateString, existingBookingsExcludingCurrent)
      const hasSlots = availableSlots.length > 0
      
      dates.push({
        date: dateString,
        formatted: formatDate(dateString),
        hasSlots
      })
    }
    
    return dates
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    )
  }

  if (!userEmail) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <p className="text-gray-500">Please log in to view your dashboard.</p>
          <Link href="/student/login" className="text-primary hover:underline">Login</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar showLocation={false} />

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2">My Dashboard</h1>
            <p className="text-gray-600">{userEmail}</p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/book"
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-secondary transition font-semibold shadow-md"
            >
              📅 Book a Lesson
            </Link>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-3xl mb-2">📅</div>
            <div className="text-3xl font-bold text-primary">
              {bookings.filter((b) => b.status === 'pending' || b.status === 'confirmed').length}
            </div>
            <p className="text-gray-600">Upcoming Lessons</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-3xl mb-2">✅</div>
            <div className="text-3xl font-bold text-green-600">
              {bookings.filter((b) => b.status === 'completed').length}
            </div>
            <p className="text-gray-600">Completed</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-3xl mb-2">📚</div>
            <div className="text-3xl font-bold text-gray-600">{bookings.length}</div>
            <p className="text-gray-600">Total Bookings</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg">
          <div className="border-b">
            <div className="flex items-center px-6 py-3 border-b">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`px-4 py-2 font-semibold transition ${
                  activeTab === 'upcoming'
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Upcoming ({bookings.filter((b) => b.status === 'pending' || b.status === 'confirmed').length})
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                className={`px-4 py-2 font-semibold transition ${
                  activeTab === 'completed'
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Completed ({bookings.filter((b) => b.status === 'completed').length})
              </button>
              <button
                onClick={() => setActiveTab('cancelled')}
                className={`px-4 py-2 font-semibold transition ${
                  activeTab === 'cancelled'
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Cancelled ({bookings.filter((b) => b.status === 'cancelled').length})
              </button>
            </div>
          </div>

          {/* Bookings List */}
          <div className="p-6">
            {filteredBookings.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">
                  {activeTab === 'upcoming' ? '📅' : activeTab === 'completed' ? '🎯' : '✅'}
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  No {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Bookings
                </h3>
                {activeTab === 'upcoming' && (
                  <>
                    <p className="text-gray-600 mb-6">Book your first lesson to get started</p>
                    <Link
                      href="/book"
                      className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-secondary transition"
                    >
                      Book Now
                    </Link>
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="border rounded-lg p-6 hover:shadow-lg transition bg-white"
                  >
                    <div className="flex items-start justify-between flex-wrap gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg text-gray-900">
                            {getLessonName(booking.lesson_type)}
                          </h3>
                          <span
                            className={`px-3 py-1 text-xs font-semibold rounded-full ${
                              booking.status === 'confirmed'
                                ? 'bg-green-100 text-green-700'
                                : booking.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-700'
                                : booking.status === 'cancelled'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </div>
                        <p className="text-gray-600">
                          📅 {formatDate(booking.date)} at {booking.time}
                        </p>
                        <p className="text-gray-600">
                          💰 ${getLessonPrice(booking.lesson_type)}
                        </p>
                        {booking.address && (
                          <p className="text-gray-500 text-sm mt-1">
                            📍 {booking.address}
                          </p>
                        )}
                      </div>

                      {activeTab === 'upcoming' && booking.status !== 'cancelled' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleReschedule(booking)}
                            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-medium"
                          >
                            Reschedule
                          </button>
                          <button
                            onClick={() => handleCancel(booking.id)}
                            disabled={actionLoading}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium disabled:opacity-50"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
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
                <select
                  id="newDate"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  defaultValue={reschedulingBooking.date}
                  onChange={(e) => {
                    const newDate = e.target.value
                    setSelectedNewDate(newDate)
                    if (newDate) {
                      const bookingsForCheck = bookings.map(b => ({
                        id: b.id,
                        studentName: b.student_name,
                        email: b.email,
                        phone: b.phone,
                        date: b.date,
                        time: b.time,
                        lessonType: b.lesson_type,
                        status: b.status,
                        price: getLessonPrice(b.lesson_type),
                        createdAt: b.created_at,
                      }))
                      const availableSlots = getAvailableSlots(newDate, bookingsForCheck.filter(b => b.id !== reschedulingBooking?.id))
                      setDateHasNoSlots(availableSlots.length === 0)
                    } else {
                      setDateHasNoSlots(false)
                    }
                  }}
                >
                  <option value="">Select a date</option>
                  {getDatesWithAvailableSlots()
                    .filter(d => d.hasSlots)
                    .map(({date, formatted}) => (
                    <option key={date} value={date}>
                      {formatted}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">Only dates with available slots are shown</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-2">New Time:</p>
                {(() => {
                  const availableTimes = getAvailableTimeOptions(selectedNewDate || reschedulingBooking.date)
                  if (availableTimes.length === 0) {
                    return (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
                        No available time slots for this date.
                      </div>
                    )
                  }
                  return (
                    <select
                      id="newTime"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      defaultValue={reschedulingBooking.time}
                    >
                      {availableTimes.map(time => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  )
                })()}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
                <strong>Select a new date and time</strong>
                <br />
                Your booking will be pending until confirmed by the instructor.
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
                onClick={saveReschedule}
                disabled={dateHasNoSlots || !selectedNewDate}
                className={`flex-1 px-4 py-2 rounded-lg transition ${
                  dateHasNoSlots || !selectedNewDate
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-primary text-white hover:bg-secondary'
                }`}
              >
                {dateHasNoSlots ? 'No Slots' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
