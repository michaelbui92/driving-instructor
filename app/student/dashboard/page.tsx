'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { supabase } from '@/lib/supabase'
import { formatDate, getAvailableSlots, getLessonPrice } from '@/lib/booking-utils'
import { sendBookingCancellationEmail } from '@/lib/booking-email'
import ErrorBoundary from '@/components/ErrorBoundary'
import { DashboardSkeleton, StatsSkeleton, BookingListSkeleton } from '@/components/Skeletons'
import { toast } from '@/components/Toast'
import MyDetailsOnboarding from '@/components/MyDetailsOnboarding'
import SkillProgress from '@/components/SkillProgress'

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
  notes?: string
  instructor_notes?: string
  price?: number
  promo_code?: string
  created_at: string
}

type StudentType = {
  id: string
  name: string
  details_completed: boolean
  onboarding_completed: boolean
  onboarding_skipped: boolean
  experience_level?: string
}

export default function StudentDashboardPage() {
  const [bookings, setBookings] = useState<BookingType[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming')
  const [reschedulingBooking, setReschedulingBooking] = useState<BookingType | null>(null)
  const [selectedNewDate, setSelectedNewDate] = useState<string>('')
  const [selectedNewTime, setSelectedNewTime] = useState<string>('')
  const [dateHasNoSlots, setDateHasNoSlots] = useState<boolean>(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [userEmail, setUserEmail] = useState<string>('')
  const [studentId, setStudentId] = useState<string>('')
  const [showDetailsOnboarding, setShowDetailsOnboarding] = useState(false)
  const [showSkillOnboarding, setShowSkillOnboarding] = useState(false)
  const [showSkills, setShowSkills] = useState(false)
  const [student, setStudent] = useState<StudentType | null>(null)
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
      // Load bookings
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings_new')
        .select('*')
        .eq('email', userEmail)
        .order('date', { ascending: false })

      if (bookingsError) throw bookingsError

      setBookings(bookingsData || [])

      // Load or create student info for onboarding check
      let studentData = null
      try {
        // Try to get existing student
        const { data, error } = await supabase
          .from('students')
          .select('id, name, details_completed, onboarding_completed, onboarding_skipped, experience_level')
          .eq('email', userEmail)
          .single()

        if (error && error.code === 'PGRST116') {
          // Student doesn't exist - create one
          const defaultName = userEmail.split('@')[0]
          const { data: newStudent, error: createError } = await supabase
            .from('students')
            .insert({
              email: userEmail,
              name: defaultName,
              details_completed: false,
              onboarding_completed: false,
              onboarding_skipped: false
            })
            .select()
            .single()

          if (createError) {
            console.error('Error creating student:', createError)
          } else {
            studentData = newStudent
          }
        } else if (error) {
          console.error('Error loading student:', error)
        } else {
          studentData = data
        }
      } catch (err) {
        console.error('Error in student load/create:', err)
      }

      if (studentData) {
        setStudentId(studentData.id)
        setStudent(studentData)
        
        // Show combined onboarding if details aren't completed
        // This combines details + skill assessment in one page
        if (!studentData.details_completed) {
          setShowDetailsOnboarding(true)
        }
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to load dashboard' })
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
      // Get booking details before cancelling
      const booking = bookings.find(b => b.id === bookingId)
      if (!booking) throw new Error('Booking not found')

      const { error } = await supabase
        .from('bookings_new')
        .update({ status: 'cancelled' })
        .eq('id', bookingId)

      if (error) throw error

      // Send cancellation email
      const emailResult = await sendBookingCancellationEmail({
        studentName: booking.student_name,
        email: booking.email,
        date: booking.date,
        time: booking.time,
        lessonType: booking.lesson_type as 'single' | 'casual'
      })

      if (!emailResult.success) {
        // Continue anyway - booking was cancelled successfully
      }

      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' as const } : b))
      )
      setMessage({ type: 'success', text: 'Booking cancelled successfully' })
      toast('success', 'Booking cancelled successfully')
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to cancel' })
      toast('error', err.message || 'Failed to cancel booking')
    } finally {
      setActionLoading(false)
    }
  }

  const handleReschedule = (booking: BookingType) => {
    setReschedulingBooking(booking)
    setSelectedNewDate(booking.date)
    setSelectedNewTime(booking.time)
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
    const newDate = selectedNewDate
    const newTime = selectedNewTime
    
    if (!newDate || !newTime) {
      toast('warning', 'Please select date and time')
      return
    }

    setActionLoading(true)
    try {
      if (!reschedulingBooking) throw new Error('No booking selected for rescheduling')

      const { error } = await supabase
        .from('bookings_new')
        .update({ date: newDate, time: newTime, status: 'pending' })
        .eq('id', reschedulingBooking.id)

      if (error) throw error

      // Send reschedule email via server-side API route
      await fetch('/api/email/reschedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: reschedulingBooking.student_name,
          email: reschedulingBooking.email,
          oldDate: reschedulingBooking.date,
          oldTime: reschedulingBooking.time,
          newDate,
          newTime,
          lessonType: reschedulingBooking.lesson_type
        })
      })

      setBookings((prev) =>
        prev.map((b) =>
          b.id === reschedulingBooking.id ? { ...b, date: newDate, time: newTime, status: 'pending' as const } : b
        )
      )
      setReschedulingBooking(null)
      setSelectedNewDate('')
      setMessage({ type: 'success', text: 'Booking rescheduled! Awaiting instructor confirmation.' })
      toast('success', 'Booking rescheduled! Awaiting instructor confirmation.')
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to reschedule' })
      toast('error', err.message || 'Failed to reschedule')
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
        <DashboardSkeleton />
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

      {/* Combined My Details + Skill Assessment Modal */}
      {showDetailsOnboarding && studentId && userEmail && (
        <MyDetailsOnboarding
          studentId={studentId}
          email={userEmail}
          onComplete={() => {
            setShowDetailsOnboarding(false)
            // Reload to update student status
            loadDashboard()
          }}
        />
      )}

      <ErrorBoundary section="Student Dashboard">
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

        {/* Booking Cadence Nudge */}
        {(() => {
          const completed = bookings.filter((b) => b.status === 'completed').sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          if (completed.length === 0) return null
          const lastLessonDate = completed[0]?.date
          if (!lastLessonDate) return null
          const daysSince = Math.floor((new Date().getTime() - new Date(lastLessonDate).getTime()) / (1000 * 60 * 60 * 24))
          if (daysSince < 7) return null
          return (
            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm">
              <p className="text-amber-800">
                💡 Your last lesson was <strong>{daysSince} days ago</strong>. Regular lessons help you build muscle memory and progress faster — most students book weekly.
              </p>
            </div>
          )
        })()}

        {/* Skill Progress Section */}
        {studentId && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">My Skill Progress</h2>
              {!student?.onboarding_completed && (
                <button
                  onClick={() => setShowSkillOnboarding(true)}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition text-sm"
                >
                  {student?.onboarding_skipped ? 'Complete Self-Assessment' : 'Complete Self-Assessment'}
                </button>
              )}
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <SkillProgress studentId={studentId} readOnly={true} />
            </div>
          </div>
        )}

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
                            title={
                              booking.status === 'pending'
                                ? 'Awaiting instructor confirmation'
                                : booking.status === 'confirmed'
                                ? 'Instructor confirmed — lesson is going ahead'
                                : booking.status === 'completed'
                                ? 'Lesson completed'
                                : 'Lesson cancelled'
                            }
                          >
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </div>
                        <p className="text-gray-600">
                          📅 {formatDate(booking.date)} at {booking.time}
                        </p>
                        <p className="text-gray-600">
                          💰 ${booking.price ?? getLessonPrice(booking.lesson_type)}
                          {booking.promo_code && (
                            <span className="text-green-600 ml-2">(Promo: ${booking.price ?? 0})</span>
                          )}
                        </p>
                        {booking.status === 'pending' && (
                          <p className="text-amber-600 text-sm mt-1">
                            ⏳ Awaiting instructor confirmation
                          </p>
                        )}
                        {booking.address && (
                          <p className="text-gray-500 text-sm mt-1">
                            📍 {booking.address}
                          </p>
                        )}
                        {booking.instructor_notes && (
                          <div className="mt-2 text-sm bg-blue-50 border border-blue-200 rounded p-2">
                            <span className="font-medium text-blue-800">Instructor notes:</span>
                            <p className="text-blue-700 mt-1">{booking.instructor_notes}</p>
                          </div>
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
      </ErrorBoundary>

      {/* Reschedule Modal */}
      {reschedulingBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <ErrorBoundary section="Reschedule Modal">
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
                      value={selectedNewTime}
                      onChange={(e) => setSelectedNewTime(e.target.value)}
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
                onClick={() => {
                  setReschedulingBooking(null)
                  setSelectedNewDate('')
                  setSelectedNewTime('')
                }}
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
          </ErrorBoundary>
        </div>
      )}
    </div>
  )
}
