'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { formatDate, getLessonTypeName, generateTimeSlots, getBlockedSlots, addBlockedSlot, removeBlockedSlot, type Booking, type BlockedSlot } from '@/lib/booking-utils'

type TabType = 'today' | 'upcoming' | 'all' | 'availability'

export default function InstructorPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [selectedTab, setSelectedTab] = useState<TabType>('today')
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [blockedSlots, setBlockedSlots] = useState<BlockedSlot[]>([])
  const [selectedBlockDate, setSelectedBlockDate] = useState<string>('')
  const [selectedBlockTimes, setSelectedBlockTimes] = useState<string[]>([])
  
  // Bulk blocking state
  const [bulkMode, setBulkMode] = useState<'none' | 'weekdays' | 'weekends' | 'daterange'>('none')
  const [bulkStartDate, setBulkStartDate] = useState<string>('')
  const [bulkEndDate, setBulkEndDate] = useState<string>('')

  useEffect(() => {
    try {
      const storedBookings = localStorage.getItem('bookings')
      if (storedBookings) {
        setBookings(JSON.parse(storedBookings))
      }
    } catch (error) {
      console.error('Error loading bookings:', error)
      setBookings([])
    }
    setBlockedSlots(getBlockedSlots())
  }, [])

  const today = new Date().toISOString().split('T')[0]
  const todayBookings = bookings.filter(b => b.date === today && b.status !== 'cancelled')
  const upcomingBookings = bookings.filter(b => b.date > today && (b.status === 'pending' || b.status === 'confirmed'))
  const allBookings = bookings.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const getFilteredBookings = () => {
    if (selectedTab === 'today') return todayBookings
    if (selectedTab === 'upcoming') return upcomingBookings
    if (selectedTab === 'all') return allBookings
    return []
  }

  const updateBookingStatus = (bookingId: string, newStatus: Booking['status']) => {
    try {
      const updatedBookings = bookings.map(b => b.id === bookingId ? { ...b, status: newStatus } : b)
      setBookings(updatedBookings)
      localStorage.setItem('bookings', JSON.stringify(updatedBookings))
      alert(`Booking status updated to: ${newStatus}`)
    } catch (error) {
      console.error('Error updating booking status:', error)
      alert('Error updating booking status. Please try again.')
    }
  }

  const getTotalRevenue = () => bookings.filter(b => b.status === 'completed').reduce((sum, b) => sum + b.price, 0)
  const getPendingRevenue = () => bookings.filter(b => b.status !== 'cancelled').reduce((sum, b) => sum + b.price, 0)

  const handleBlockSlot = () => {
    if (!selectedBlockDate || selectedBlockTimes.length === 0) {
      alert('Please select a date and at least one time slot to block')
      return
    }
    try {
      selectedBlockTimes.forEach(time => addBlockedSlot(selectedBlockDate, time))
      setBlockedSlots(getBlockedSlots())
      setSelectedBlockTimes([])
      alert(`Blocked ${selectedBlockTimes.length} time slot(s) successfully`)
    } catch (error) {
      console.error('Error blocking slots:', error)
      alert('Error blocking slots. Please try again.')
    }
  }

  const handleUnblockSlot = (date: string, time: string) => {
    try {
      removeBlockedSlot(date, time)
      setBlockedSlots(getBlockedSlots())
    } catch (error) {
      console.error('Error unblocking slot:', error)
      alert('Error unblocking slot. Please try again.')
    }
  }

  const handleBulkBlock = () => {
    if (bulkMode === 'none') return
    
    try {
      const slots = generateTimeSlots()
      let blockedCount = 0
      
      if (bulkMode === 'weekdays') {
        // Block all weekdays EXCEPT 6pm, 7pm, 8pm
        const allowedTimes = ['6:00 PM', '7:00 PM', '8:00 PM']
        slots.forEach(slot => {
          const dateObj = new Date(slot.date)
          const dayOfWeek = dateObj.getDay()
          const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
          
          if (!isWeekend && !allowedTimes.includes(slot.time)) {
            addBlockedSlot(slot.date, slot.time)
            blockedCount++
          }
        })
      } else if (bulkMode === 'weekends') {
        // Block all weekends EXCEPT 6pm, 7pm, 8pm
        const allowedTimes = ['6:00 PM', '7:00 PM', '8:00 PM']
        slots.forEach(slot => {
          const dateObj = new Date(slot.date)
          const dayOfWeek = dateObj.getDay()
          const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
          
          if (isWeekend && !allowedTimes.includes(slot.time)) {
            addBlockedSlot(slot.date, slot.time)
            blockedCount++
          }
        })
      } else if (bulkMode === 'daterange') {
        if (!bulkStartDate || !bulkEndDate) {
          alert('Please select start and end dates')
          return
        }
        // Block all slots in range EXCEPT 6pm, 7pm, 8pm
        const allowedTimes = ['6:00 PM', '7:00 PM', '8:00 PM']
        slots.forEach(slot => {
          if (slot.date >= bulkStartDate && slot.date <= bulkEndDate) {
            if (!allowedTimes.includes(slot.time)) {
              addBlockedSlot(slot.date, slot.time)
              blockedCount++
            }
          }
        })
      }
      
      setBlockedSlots(getBlockedSlots())
      alert(`Blocked ${blockedCount} time slot(s). Remaining slots: 6pm, 7pm, 8pm.`)
      setBulkMode('none')
    } catch (error) {
      console.error('Error in bulk block:', error)
      alert('Error blocking slots. Please try again.')
    }
  }

  const getTimeSlotsForDate = (date: string): string[] => {
    return generateTimeSlots().filter(slot => slot.date === date).map(slot => slot.time)
  }

  const isSlotBlocked = (date: string, time: string): boolean => {
    return blockedSlots.some(b => b.date === date && b.time === time)
  }

  const renderAvailabilityTab = () => (
    <div>
      <h2 className="text-2xl font-bold mb-6">Manage Your Availability</h2>
      <p className="text-gray-600 mb-6">
        Students can only book slots that you have not blocked. Use bulk blocking to quickly set your availability, then fine-tune individual days.
      </p>

      {/* Bulk Blocking Section */}
      <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">⚡ Quick Block</h3>
        <p className="text-sm text-gray-600 mb-4">
          Block multiple slots at once. This will block all slots EXCEPT 6pm, 7pm, and 8pm.
        </p>
        
        <div className="grid md:grid-cols-4 gap-4 mb-4">
          <button
            onClick={() => { setBulkMode('weekdays'); handleBulkBlock() }}
            className="px-4 py-3 bg-white border-2 border-purple-300 rounded-lg hover:border-purple-500 transition text-left"
          >
            <span className="font-semibold block">All Weekdays</span>
            <span className="text-xs text-gray-500">Block 9am-5pm (keep 6-8pm)</span>
          </button>
          <button
            onClick={() => { setBulkMode('weekends'); handleBulkBlock() }}
            className="px-4 py-3 bg-white border-2 border-purple-300 rounded-lg hover:border-purple-500 transition text-left"
          >
            <span className="font-semibold block">All Weekends</span>
            <span className="text-xs text-gray-500">Block 8am-5pm (keep 6-8pm)</span>
          </button>
          <div className="px-4 py-3 bg-white border-2 border-purple-300 rounded-lg">
            <span className="font-semibold block mb-2">Date Range</span>
            <div className="flex gap-2 mb-2">
              <input
                type="date"
                value={bulkStartDate}
                onChange={(e) => setBulkStartDate(e.target.value)}
                className="text-sm px-2 py-1 border rounded w-full"
                min={today}
              />
              <input
                type="date"
                value={bulkEndDate}
                onChange={(e) => setBulkEndDate(e.target.value)}
                className="text-sm px-2 py-1 border rounded w-full"
                min={bulkStartDate || today}
              />
            </div>
            <button
              onClick={() => { setBulkMode('daterange'); handleBulkBlock() }}
              disabled={!bulkStartDate || !bulkEndDate}
              className="w-full text-xs px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Apply
            </button>
          </div>
          <button
            onClick={() => {
              if (confirm('This will unblock ALL slots. Continue?')) {
                blockedSlots.forEach(b => removeBlockedSlot(b.date, b.time))
                setBlockedSlots(getBlockedSlots())
                alert('All slots unblocked!')
              }
            }}
            className="px-4 py-3 bg-red-50 border-2 border-red-300 rounded-lg hover:border-red-500 transition text-left"
          >
            <span className="font-semibold text-red-700 block">Unblock All</span>
            <span className="text-xs text-red-500">Reset to all available</span>
          </button>
        </div>
      </div>

      {/* Individual Day Blocking */}
      <div className="bg-gray-50 rounded-xl p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">Block Slots for Specific Day</h3>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
            <input
              type="date"
              value={selectedBlockDate}
              onChange={(e) => { setSelectedBlockDate(e.target.value); setSelectedBlockTimes([]) }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              min={today}
            />
          </div>
          {selectedBlockDate && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">Select Times to Block</label>
                <button
                  onClick={() => {
                    const available = getTimeSlotsForDate(selectedBlockDate).filter(t => !isSlotBlocked(selectedBlockDate, t))
                    setSelectedBlockTimes(available)
                  }}
                  className="text-xs text-primary hover:underline"
                >
                  Select all available
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto">
                {getTimeSlotsForDate(selectedBlockDate).map(time => (
                  <label
                    key={time}
                    className={`flex items-center p-2 border rounded cursor-pointer ${
                      isSlotBlocked(selectedBlockDate, time)
                        ? 'bg-red-100 border-red-300 text-red-700'
                        : 'bg-white hover:bg-gray-100'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedBlockTimes.includes(time)}
                      disabled={isSlotBlocked(selectedBlockDate, time)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedBlockTimes([...selectedBlockTimes, time])
                        } else {
                          setSelectedBlockTimes(selectedBlockTimes.filter(t => t !== time))
                        }
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm">{time}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleBlockSlot}
            disabled={!selectedBlockDate || selectedBlockTimes.length === 0}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              selectedBlockDate && selectedBlockTimes.length > 0
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Block {selectedBlockTimes.length > 0 ? `${selectedBlockTimes.length} Slot(s)` : 'Selected'}
          </button>
          {selectedBlockTimes.length > 0 && (
            <button
              onClick={() => setSelectedBlockTimes([])}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Clear Selection
            </button>
          )}
        </div>
      </div>

      {/* Currently Blocked Slots */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Currently Blocked ({blockedSlots.length})</h3>
        {blockedSlots.length === 0 ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <div className="text-4xl mb-2">✅</div>
            <p className="text-green-800 font-semibold">No blocked slots</p>
            <p className="text-green-600 text-sm">All time slots are available for booking</p>
          </div>
        ) : (
          <div className="space-y-2">
            {Object.entries(
              blockedSlots.reduce((acc, slot) => {
                if (!acc[slot.date]) acc[slot.date] = []
                acc[slot.date].push(slot)
                return acc
              }, {} as Record<string, BlockedSlot[]>)
            ).map(([date, slots]) => (
              <div key={date} className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <p className="font-semibold text-red-800">{formatDate(date)}</p>
                  <button
                    onClick={() => slots.forEach(s => handleUnblockSlot(s.date, s.time))}
                    className="text-sm text-red-600 hover:text-red-800 underline"
                  >
                    Unblock all
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {slots.map((slot, idx) => (
                    <span key={idx} className="inline-flex items-center px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                      {slot.time}
                      <button onClick={() => handleUnblockSlot(slot.date, slot.time)} className="ml-2 text-red-600 hover:text-red-800 font-bold">×</button>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )

  const renderBookingList = () => {
    const filtered = getFilteredBookings()
    if (filtered.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-semibold mb-2">No Bookings Found</h3>
          <p className="text-gray-600">Bookings will appear here once students schedule lessons</p>
        </div>
      )
    }
    return filtered.map((booking) => (
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
            <p className="text-sm text-gray-600 mb-1">Status</p>
            <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
              booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800'
              : booking.status === 'confirmed' ? 'bg-green-100 text-green-800'
              : booking.status === 'completed' ? 'bg-blue-100 text-blue-800'
              : 'bg-gray-100 text-gray-800'
            }`}>
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </span>
            {booking.status === 'pending' && (
              <button
                onClick={(e) => { e.stopPropagation(); updateBookingStatus(booking.id, 'confirmed') }}
                className="block mt-1 text-primary hover:text-secondary text-sm font-semibold"
              >
                Confirm
              </button>
            )}
          </div>
        </div>
      </div>
    ))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-primary">🚗 Drive With Bui</Link>
            <div className="flex space-x-4">
              <Link href="/dashboard" className="px-4 py-2 border-2 border-primary text-primary rounded-lg hover:bg-blue-50 transition">Student View</Link>
              <Link href="/" className="text-gray-700 hover:text-primary transition">Home</Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Instructor Portal</h1>
          <p className="text-gray-600">Manage your schedule and student bookings</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-3xl mb-2">📅</div>
            <div className="text-3xl font-bold text-primary">{todayBookings.length}</div>
            <p className="text-gray-600">Todays Lessons</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-3xl mb-2">🗓️</div>
            <div className="text-3xl font-bold text-blue-600">{upcomingBookings.length}</div>
            <p className="text-gray-600">Upcoming</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-3xl mb-2">✅</div>
            <div className="text-3xl font-bold text-green-600">${getTotalRevenue()}</div>
            <p className="text-gray-600">Revenue</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-3xl mb-2">💰</div>
            <div className="text-3xl font-bold text-accent">${getPendingRevenue()}</div>
            <p className="text-gray-600">Pending</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg mb-8">
          <div className="border-b">
            <div className="flex">
              <button
                className={`flex-1 px-6 py-4 font-semibold transition ${selectedTab === 'today' ? 'border-b-2 border-primary text-primary' : 'text-gray-600 hover:text-gray-800'}`}
                onClick={() => setSelectedTab('today')}
              >Today ({todayBookings.length})</button>
              <button
                className={`flex-1 px-6 py-4 font-semibold transition ${selectedTab === 'upcoming' ? 'border-b-2 border-primary text-primary' : 'text-gray-600 hover:text-gray-800'}`}
                onClick={() => setSelectedTab('upcoming')}
              >Upcoming ({upcomingBookings.length})</button>
              <button
                className={`flex-1 px-6 py-4 font-semibold transition ${selectedTab === 'all' ? 'border-b-2 border-primary text-primary' : 'text-gray-600 hover:text-gray-800'}`}
                onClick={() => setSelectedTab('all')}
              >All ({allBookings.length})</button>
              <button
                className={`flex-1 px-6 py-4 font-semibold transition ${selectedTab === 'availability' ? 'border-b-2 border-primary text-primary' : 'text-gray-600 hover:text-gray-800'}`}
                onClick={() => setSelectedTab('availability')}
              >🚫 Availability</button>
            </div>
          </div>
          <div className="p-6">
            {selectedTab === 'availability' ? renderAvailabilityTab() : renderBookingList()}
          </div>
        </div>

        {selectedBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Booking Details</h2>
                <button onClick={() => setSelectedBooking(null)} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
              </div>
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div><p className="text-sm text-gray-600 mb-1">Booking ID</p><p className="font-semibold">{selectedBooking.id}</p></div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Status</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                      selectedBooking.status === 'pending' ? 'bg-yellow-100 text-yellow-800'
                      : selectedBooking.status === 'confirmed' ? 'bg-green-100 text-green-800'
                      : selectedBooking.status === 'completed' ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                    </span>
                  </div>
                  <div><p className="text-sm text-gray-600 mb-1">Student Name</p><p className="font-semibold">{selectedBooking.studentName}</p></div>
                  <div><p className="text-sm text-gray-600 mb-1">Email</p><p className="font-semibold">{selectedBooking.email}</p></div>
                  <div><p className="text-sm text-gray-600 mb-1">Phone</p><p className="font-semibold">{selectedBooking.phone}</p></div>
                  <div><p className="text-sm text-gray-600 mb-1">Lesson Type</p><p className="font-semibold">{getLessonTypeName(selectedBooking.lessonType)}</p></div>
                  <div><p className="text-sm text-gray-600 mb-1">Date</p><p className="font-semibold">{formatDate(selectedBooking.date)}</p></div>
                  <div><p className="text-sm text-gray-600 mb-1">Time</p><p className="font-semibold">{selectedBooking.time}</p></div>
                  <div><p className="text-sm text-gray-600 mb-1">Price</p><p className="font-semibold text-2xl text-primary">${selectedBooking.price}</p></div>
                  <div><p className="text-sm text-gray-600 mb-1">Booked On</p><p className="font-semibold">{new Date(selectedBooking.createdAt).toLocaleDateString()}</p></div>
                </div>
                <div className="border-t pt-6">
                  <p className="text-sm text-gray-600 mb-4">Update Status</p>
                  <div className="flex flex-wrap gap-3">
                    {selectedBooking.status !== 'confirmed' && (
                      <button onClick={() => { updateBookingStatus(selectedBooking.id, 'confirmed'); setSelectedBooking(null) }} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">Confirm Booking</button>
                    )}
                    {selectedBooking.status !== 'completed' && (
                      <button onClick={() => { updateBookingStatus(selectedBooking.id, 'completed'); setSelectedBooking(null) }} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition">Mark as Completed</button>
                    )}
                    {selectedBooking.status !== 'cancelled' && (
                      <button onClick={() => { updateBookingStatus(selectedBooking.id, 'cancelled'); setSelectedBooking(null) }} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">Cancel Booking</button>
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
