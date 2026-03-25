'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import { supabase, type Booking as SupabaseBooking } from '@/lib/supabase'
import { formatDate, getLessonTypeName, getRequiredLessons, getAvailableSlots, generateTimeSlots, type Booking } from '@/lib/booking-utils'

export default function DashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [selectedTab, setSelectedTab] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming')
  const [reschedulingBooking, setReschedulingBooking] = useState<Booking | null>(null)
  const [selectedNewDate, setSelectedNewDate] = useState<string>('')
  const [dateHasNoSlots, setDateHasNoSlots] = useState<boolean>(false)
  const [portalImageIndex, setPortalImageIndex] = useState(0)
  const [emailFilter, setEmailFilter] = useState('')
  const portalImages = ['/images/student-portal-1.png', '/images/student-portal-2.png']

  // Cycle between portal images every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setPortalImageIndex((prev) => (prev === 0 ? 1 : 0))
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    async function loadBookings() {
      try {
        const { data, error } = await supabase
          .from('bookings')
          .select('*')
          .order('date', { ascending: false })

        if (error) {
          console.error('Error loading bookings:', error)
          setBookings([])
        } else {
          // Convert Supabase format to app format
          const formatted: Booking[] = (data || []).map((b: SupabaseBooking) => ({
            id: b.id,
            studentName: b.student_name,
            email: b.email,
            phone: b.phone,
            date: b.date,
            time: b.time,
            lessonType: b.lesson_type,
            status: b.status,
            price: 0,
            createdAt: b.created_at,
          }))
          setBookings(formatted)
        }
      } catch (error) {
        console.error('Error loading bookings:', error)
        setBookings([])
      }
    }
    loadBookings()
  }, [])

  const upcomingBookings = bookings.filter(b => 
    (b.status === 'pending' || b.status === 'confirmed') &&
    (!emailFilter || b.email.toLowerCase().includes(emailFilter.toLowerCase()))
  )
  const completedBookings = bookings.filter(b => 
    b.status === 'completed' &&
    (!emailFilter || b.email.toLowerCase().includes(emailFilter.toLowerCase()))
  )
  const cancelledBookings = bookings.filter(b => 
    b.status === 'cancelled' &&
    (!emailFilter || b.email.toLowerCase().includes(emailFilter.toLowerCase()))
  )

  // Group bookings by packageId for display
  const groupedUpcomingBookings = upcomingBookings.reduce((acc, booking) => {
    if (booking.packageId) {
      if (!acc[booking.packageId]) {
        acc[booking.packageId] = []
      }
      acc[booking.packageId].push(booking)
    } else {
      // Non-package bookings get their own group
      if (!acc[booking.id]) {
        acc[booking.id] = []
      }
      acc[booking.id].push(booking)
    }
    return acc
  }, {} as Record<string, Booking[]>)

  const cancelBooking = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId)

      if (error) {
        throw error
      }

      const updatedBookings = bookings.map(b =>
        b.id === bookingId ? { ...b, status: 'cancelled' as const } : b
      )
      setBookings(updatedBookings)
      alert('Booking cancelled successfully')
    } catch (error) {
      console.error('Error cancelling booking:', error)
      alert('Error cancelling booking. Please try again.')
    }
  }

  const deleteBooking = async (bookingId: string) => {
    if (!confirm('Permanently delete this booking? This cannot be undone.')) return
    
    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', bookingId)

      if (error) {
        throw error
      }

      setBookings(bookings.filter(b => b.id !== bookingId))
      alert('Booking deleted successfully')
    } catch (error) {
      console.error('Error deleting booking:', error)
      alert('Error deleting booking. Please try again.')
    }
  }

  const handleReschedule = (booking: Booking) => {
    setReschedulingBooking(booking)
    setSelectedNewDate(booking.date)
    // Check if current date has available slots (excluding current booking)
    const availableSlots = getAvailableSlots(booking.date, bookings.filter(b => b.id !== booking.id))
    setDateHasNoSlots(availableSlots.length === 0)
  }

  const saveReschedule = async (newDate: string, newTime: string) => {
    try {
      // 1. Validate: Cannot book past dates
      const today = new Date()
      today.setHours(0, 0, 0, 0) // Set to start of day for comparison
      const selectedDate = new Date(newDate)
      selectedDate.setHours(0, 0, 0, 0)
      
      if (selectedDate < today) {
        alert('Cannot reschedule to a past date. Please select a future date.')
        return
      }

      // 2. Validate: Check if time slot is already booked (excluding the current booking being rescheduled)
      const existingBookingsForDate = bookings.filter(b => 
        b.date === newDate && 
        b.time === newTime && 
        b.id !== reschedulingBooking?.id && // Exclude the current booking
        (b.status === 'pending' || b.status === 'confirmed') // Only check pending/confirmed bookings
      )

      if (existingBookingsForDate.length > 0) {
        alert('This time slot is already booked. Please select a different time.')
        return
      }

      // 3. Validate: Check if slot is available (using availability rules and blocked slots)
      // We'll use getAvailableSlots to check if the slot would be available
      const availableSlots = getAvailableSlots(newDate, bookings.filter(b => b.id !== reschedulingBooking?.id))
      const isSlotAvailable = availableSlots.some(slot => slot.time === newTime)
      
      if (!isSlotAvailable) {
        alert('This time slot is not available. Please select a different time.')
        return
      }

      // All validation passed, proceed with rescheduling
      const updatedBookings = bookings.map(b => {
        if (b.id === reschedulingBooking?.id) {
          // Track reschedule history
          const rescheduleHistory = b.rescheduleHistory || []
          rescheduleHistory.push({
            date: b.date,
            time: b.time,
            changedAt: new Date().toISOString()
          })
          
          return { 
            ...b, 
            date: newDate, 
            time: newTime, 
            status: 'pending' as const,
            originalDate: b.originalDate || b.date, // Store original date if not already set
            previousDate: b.date, // Store previous date
            rescheduleHistory
          }
        }
        return b
      })
      setBookings(updatedBookings)
      
      // Update in Supabase
      if (reschedulingBooking?.id) {
        await supabase
          .from('bookings')
          .update({ 
            date: newDate, 
            time: newTime, 
            status: 'pending' 
          })
          .eq('id', reschedulingBooking.id)
      }
      
      alert('Booking rescheduled successfully. Instructor confirmation required.')
      setReschedulingBooking(null)
    } catch (error) {
      console.error('Error rescheduling booking:', error)
      alert('Error rescheduling booking. Please try again.')
    }
  }

  const getUpcomingLessonsCount = () => {
    // With new structure, each lesson is a separate booking (packages split into individual bookings)
    // So just count all upcoming bookings
    return upcomingBookings.length
  }

  const getAvailableTimeOptions = (date: string) => {
    if (!date) return []
    
    // Use getAvailableSlots to get only actually available slots
    // Exclude the current booking being rescheduled from the existing bookings check
    const existingBookingsExcludingCurrent = bookings.filter(b => b.id !== reschedulingBooking?.id)
    const availableSlots = getAvailableSlots(date, existingBookingsExcludingCurrent)
    
    // Return just the time strings from available slots
    return availableSlots.map(slot => slot.time)
  }

  // Get dates with available slots for the next 28 days
  const getDatesWithAvailableSlots = () => {
    const dates: {date: string, formatted: string, hasSlots: boolean}[] = []
    const today = new Date()
    
    for (let i = 1; i <= 28; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      const dateString = date.toISOString().split('T')[0]
      
      // Check if this date has any available slots
      // Exclude the current booking being rescheduled (if any)
      const existingBookingsExcludingCurrent = reschedulingBooking 
        ? bookings.filter(b => b.id !== reschedulingBooking.id)
        : bookings
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar showLocation={false} />

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2">Student Dashboard</h1>
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
                  value={emailFilter}
                  onChange={(e) => setEmailFilter(e.target.value)}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                />
                {emailFilter && (
                  <button
                    onClick={() => setEmailFilter('')}
                    className="p-1.5 text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                )}
              </div>
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

            {selectedTab === 'cancelled' && cancelledBookings.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">✅</div>
                <h3 className="text-xl font-semibold mb-2">No Cancelled Bookings</h3>
                <p className="text-gray-600">Cancelled bookings will appear here</p>
              </div>
            )}

            {selectedTab === 'upcoming' ? (
              Object.entries(groupedUpcomingBookings).map(([groupId, groupBookings]) => {
                const isPackage = groupBookings[0].packageId !== undefined
                const packageTotal = getRequiredLessons(groupBookings[0].lessonType)
                const completedInPackage = groupBookings.filter(b => b.status === 'completed').length
                const packageLessonType = groupBookings[0].lessonType

                return (
                  <div
                    key={groupId}
                    className="border rounded-lg p-8 mb-6 hover:shadow-lg transition bg-white"
                  >
                    {isPackage && (
                      <div className="mb-6">
                        <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold">
                          {getLessonTypeName(packageLessonType)} ({groupBookings.length}/{packageTotal} lessons)
                        </span>
                      </div>
                    )}
                    <div className="space-y-4">
                      {groupBookings.map((booking) => (
                        <div key={booking.id} className="grid md:grid-cols-6 gap-6 items-center border-b last:border-0 pb-4 last:pb-0">
                          <div className="md:col-span-2">
                            <p className="text-sm text-gray-600 mb-2">Date & Time</p>
                            <p className="font-semibold text-lg">{formatDate(booking.date)}</p>
                            <p className="text-gray-600">{booking.time}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-2">Lesson Type</p>
                            <p className="font-semibold">{getLessonTypeName(booking.lessonType)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-2">Price</p>
                            <p className="font-semibold text-primary text-lg">${booking.price}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-2">Status</p>
                            <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                              booking.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : booking.status === 'confirmed'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </span>
                          </div>
                          <div className="flex flex-col space-y-3">
                            {selectedTab === 'upcoming' && (
                              <>
                                <button
                                  onClick={() => handleReschedule(booking)}
                                  className="w-full px-4 py-3 border-2 border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50 transition font-medium"
                                >
                                  Reschedule
                                </button>
                                <button
                                  onClick={() => cancelBooking(booking.id)}
                                  className="w-full px-4 py-3 border-2 border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition font-medium"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => deleteBooking(booking.id)}
                                  className="w-full px-4 py-3 border-2 border-gray-700 text-gray-700 rounded-lg hover:bg-gray-700 hover:text-white transition font-medium"
                                >
                                  Delete
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })
            ) : selectedTab === 'cancelled' ? (
              cancelledBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="border rounded-lg p-8 mb-6 hover:shadow-lg transition bg-white"
                >
                  <div className="grid md:grid-cols-5 gap-6">
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-600 mb-2">Date & Time</p>
                      <p className="font-semibold text-lg">{formatDate(booking.date)}</p>
                      <p className="text-gray-600">{booking.time}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Student</p>
                      <p className="font-semibold">{booking.studentName}</p>
                      <p className="text-sm text-gray-500">{booking.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Lesson Type</p>
                      <p className="font-semibold">{getLessonTypeName(booking.lessonType)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Status</p>
                      <span className="inline-block px-4 py-2 rounded-full text-sm font-semibold bg-red-100 text-red-800">
                        Cancelled
                      </span>
                    </div>
                    <div className="flex flex-col space-y-3">
                      <button
                        onClick={() => deleteBooking(booking.id)}
                        className="w-full px-4 py-3 border-2 border-gray-700 text-gray-700 rounded-lg hover:bg-gray-700 hover:text-white transition font-medium"
                      >
                        Delete Permanently
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              completedBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="border rounded-lg p-8 mb-6 hover:shadow-lg transition bg-white"
                >
                  <div className="grid md:grid-cols-5 gap-6">
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-600 mb-2">Date & Time</p>
                      <p className="font-semibold text-lg">{formatDate(booking.date)}</p>
                      <p className="text-gray-600">{booking.time}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Lesson Type</p>
                      <p className="font-semibold">{getLessonTypeName(booking.lessonType)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Price</p>
                      <p className="font-semibold text-primary text-lg">${booking.price}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Status</p>
                      <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                        booking.status === 'completed' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
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
                <input
                  type="date"
                  id="newDate"
                  defaultValue={reschedulingBooking.date}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-2">New Time:</p>
                <input
                  type="time"
                  id="newTime"
                  defaultValue={reschedulingBooking.time}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setReschedulingBooking(null)}
                className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const newDateInput = document.getElementById('newDate') as HTMLInputElement
                  const newTimeInput = document.getElementById('newTime') as HTMLInputElement
                  saveReschedule(newDateInput.value, newTimeInput.value)
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
