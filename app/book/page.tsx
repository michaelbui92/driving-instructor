'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  generateTimeSlots,
  formatDate,
  getLessonPrice,
  getLessonTypeName,
  validateBooking,
  getLessonTypes,
  isNightTimeSlot,
  getAvailableSlots,
  getRequiredLessons,
  type Booking,
  type TimeSlot,
  type LessonSlot,
} from '@/lib/booking-utils'

export default function BookPage() {
  const [step, setStep] = useState(1)
  const [booking, setBooking] = useState<Partial<Booking>>({
    lessonType: 'single',
  })
  const [selectedSlotIds, setSelectedSlotIds] = useState<string[]>([])
  const [existingBookings, setExistingBookings] = useState<Booking[]>([])

  // Load existing bookings on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('bookings')
      if (stored) {
        setExistingBookings(JSON.parse(stored))
      }
    } catch (error) {
      console.error('Error loading bookings:', error)
      setExistingBookings([])
    }
  }, [])

  // Step 1: Lesson Type Selection
  const lessonTypes = getLessonTypes()
  const requiredLessons = getRequiredLessons(booking.lessonType || 'single')

  // Step 2: Date and Time Selection
  const allSlots = generateTimeSlots()
  const uniqueDates = Array.from(new Set(allSlots.map(slot => slot.date)))

  // Helper functions
  const getSlotsForDate = (date: string) => {
    return getAvailableSlots(date, existingBookings.filter(b =>
      b.status !== 'cancelled' && selectedSlotIds.includes(`${b.date}-${b.time}`)
    ))
  }

  const handleLessonTypeSelect = (typeId: string) => {
    setBooking(prev => ({ ...prev, lessonType: typeId }))
    setSelectedSlotIds([]) // Reset selections when changing package
  }

  const handleSlotToggle = (slot: TimeSlot) => {
    const slotId = slot.id

    if (booking.lessonType === 'single') {
      // Single lesson: select this slot, deselect all others
      setBooking(prev => ({
        ...prev,
        date: slot.date,
        time: slot.time,
        price: getLessonPrice(prev.lessonType || 'single'),
      }))
      setSelectedSlotIds([slotId])
    } else {
      // Package: toggle this slot
      setSelectedSlotIds(prev => {
        if (prev.includes(slotId)) {
          return prev.filter(id => id !== slotId)
        } else if (prev.length < requiredLessons) {
          return [...prev, slotId]
        }
        return prev // Don't exceed required lessons
      })
    }
  }

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBooking(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleNext = () => {
    if (step === 1) {
      if (booking.lessonType) {
        setStep(2)
      }
    } else if (step === 2) {
      const validation = validateBooking(booking, selectedSlotIds)
      if (validation.valid) {
        setStep(3)
      } else {
        alert(validation.errors.join('\n'))
      }
    } else if (step === 3) {
      const validation = validateBooking(booking, selectedSlotIds)
      if (validation.valid) {
        setStep(4)
      } else {
        alert(validation.errors.join('\n'))
      }
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleSubmit = () => {
    // In a real app, this would save to a database
    const newBooking: Booking = {
      id: `BK-${Date.now()}`,
      studentName: booking.studentName || '',
      email: booking.email || '',
      phone: booking.phone || '',
      address: booking.address,
      lessonType: booking.lessonType || 'single',
      date: booking.date || '',
      time: booking.time || '',
      price: booking.price || 0,
      status: 'pending',
      createdAt: new Date().toISOString(),
    }

    // Handle package bookings - convert selected slots to lesson slots
    if (booking.lessonType !== 'single' && selectedSlotIds.length > 0) {
      const lessonSlots: LessonSlot[] = selectedSlotIds.map(slotId => {
        const [date, time] = slotId.split('-')
        return {
          date,
          time: time.replace(/-/g, ':'), // Convert dashes to colons
          isNightTime: time === '8:00 PM',
        }
      })
      newBooking.lessonSlots = lessonSlots
    }

    // Store in localStorage for demo
    const existing = JSON.parse(localStorage.getItem('bookings') || '[]')
    localStorage.setItem('bookings', JSON.stringify([...existing, newBooking]))

    alert('Booking confirmed! A confirmation email will be sent shortly.')
    window.location.href = '/'
  }

  const getSelectedSlots = (): TimeSlot[] => {
    return allSlots.filter(slot => selectedSlotIds.includes(slot.id))
  }

  const getSelectedSlotsDisplay = () => {
    const slots = getSelectedSlots()
    return slots.map(slot => `${formatDate(slot.date)} @ ${slot.time}`).join('\n')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-primary">🚗 Drive With Bui</Link>
            <Link
              href="/"
              className="text-gray-700 hover:text-primary transition"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </nav>

      {/* Progress Bar */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  step >= s ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {s < 4 ? s : '✓'}
                </div>
                {s < 4 && (
                  <div className={`w-24 h-1 mx-2 ${step > s ? 'bg-primary' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>Lesson Type</span>
            <span>Date & Time</span>
            <span>Your Details</span>
            <span>Confirmation</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {step === 1 && (
          <div>
            <h2 className="text-3xl font-bold mb-6">Choose Your Lesson Package</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {lessonTypes.map((type) => (
                <div
                  key={type.id}
                  className={`p-6 rounded-xl border-2 cursor-pointer transition ${
                    booking.lessonType === type.id
                      ? 'border-primary bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-primary'
                  }`}
                  onClick={() => handleLessonTypeSelect(type.id)}
                >
                  <h3 className="text-xl font-bold mb-2">{type.name}</h3>
                  <p className="text-gray-600 mb-4">{type.duration}</p>
                  <div className="text-3xl font-bold text-primary">
                    ${type.price}
                  </div>
                  {type.id === '5-pack' && (
                    <div className="text-green-600 text-sm mt-2">Save $5</div>
                  )}
                  {type.id === '10-pack' && (
                    <div className="text-green-600 text-sm mt-2">Save $20</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-3xl font-bold mb-6">
              {booking.lessonType === 'single'
                ? 'Select Date & Time'
                : `Select ${requiredLessons} Lesson Slots (${selectedSlotIds.length}/${requiredLessons} selected)`
              }
            </h2>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-yellow-800">
                <strong>Availability:</strong> Weekday evenings (6pm-8pm), weekends (8am-7pm). <strong>Note:</strong> If you book 6pm, 7pm is blocked to ensure full dedication to your lesson. 8pm is a night time booking.
                {booking.lessonType !== 'single' && (
                  <> <strong>For packages:</strong> Select multiple dates and times across different days. Use the calendar below to pick your preferred schedule.</>
                )}
              </p>
            </div>

            <div className="space-y-6">
              {/* Date Selection */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Available Dates</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {uniqueDates.slice(0, 14).map((date) => {
                    const slotsForDate = getSlotsForDate(date)
                    const selectedCount = selectedSlotIds.filter(id => id.startsWith(date)).length
                    const isDisabled = slotsForDate.length === 0

                    return (
                      <button
                        key={date}
                        disabled={isDisabled}
                        className={`p-4 rounded-lg border-2 transition ${
                          selectedCount > 0
                            ? 'border-primary bg-blue-50'
                            : isDisabled
                            ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'border-gray-200 bg-white hover:border-primary'
                        }`}
                        onClick={() => setBooking(prev => ({ ...prev, date }))}
                      >
                        <div className="font-semibold">{formatDate(date)}</div>
                        {selectedCount > 0 && (
                          <div className="text-xs text-primary mt-1">{selectedCount} selected</div>
                        )}
                        {isDisabled && (
                          <div className="text-xs text-gray-400 mt-1">Fully booked</div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Time Selection */}
              {booking.date && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">
                    Available Time Slots for {formatDate(booking.date)}
                  </h3>
                  {getSlotsForDate(booking.date).length === 0 ? (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                      <p className="text-gray-600">No time slots available for this date.</p>
                      <p className="text-sm text-gray-500 mt-2">Please select a different date.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {getSlotsForDate(booking.date).map((slot) => (
                        <button
                          key={slot.id}
                          disabled={
                            booking.lessonType === 'single'
                              ? selectedSlotIds.includes(slot.id)
                              : true // Only disable if already selected for single
                          }
                          className={`p-4 rounded-lg border-2 transition ${
                            selectedSlotIds.includes(slot.id)
                              ? 'border-primary bg-blue-50'
                              : slot.isNightTime
                              ? 'border-purple-300 bg-purple-50 hover:border-purple-400'
                              : 'border-gray-200 bg-white hover:border-primary'
                          } ${booking.lessonType === 'single' && selectedSlotIds.includes(slot.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleSlotToggle(slot)
                          }}
                        >
                          <div className="font-semibold">{slot.time}</div>
                          {slot.isNightTime && (
                            <div className="text-xs text-purple-700 mt-1">Night Time</div>
                          )}
                          {selectedSlotIds.includes(slot.id) && (
                            <div className="text-xs text-green-600 mt-1">✓ Selected</div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Selected Slots Summary for Packages */}
              {booking.lessonType !== 'single' && selectedSlotIds.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Selected Lessons ({selectedSlotIds.length}/{requiredLessons}):</h3>
                  <div className="grid md:grid-cols-2 gap-2 text-sm">
                    {getSelectedSlots().map((slot) => (
                      <div key={slot.id} className="flex items-center">
                        <span className="text-blue-600 mr-2">✓</span>
                        <span>{formatDate(slot.date)} @ {slot.time}</span>
                        {slot.isNightTime && <span className="ml-2 text-xs text-purple-600">(Night)</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-3xl font-bold mb-6">Your Details</h2>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="studentName"
                    value={booking.studentName || ''}
                    onChange={handlePersonalInfoChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={booking.email || ''}
                    onChange={handlePersonalInfoChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={booking.phone || ''}
                    onChange={handlePersonalInfoChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="(02) 1234-5678"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pickup/Drop-off Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={booking.address || ''}
                    onChange={handlePersonalInfoChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="123 Main Street, Sydney NSW 2000"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">This will be saved for future bookings</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    name="notes"
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Any specific requirements or preferences?"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 className="text-3xl font-bold mb-6">Confirm Your Booking</h2>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600 text-sm">Lesson Type</p>
                    <p className="font-semibold">{getLessonTypeName(booking.lessonType || '')}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Price</p>
                    <p className="font-semibold text-primary">${booking.price}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-600 text-sm">
                      {booking.lessonType === 'single' ? 'Date & Time' : 'Selected Lessons'}
                    </p>
                    {booking.lessonType === 'single' ? (
                      <div>
                        <p className="font-semibold">{formatDate(booking.date || '')}</p>
                        <p className="text-gray-600">{booking.time}</p>
                      </div>
                    ) : (
                      <div className="grid md:grid-cols-2 gap-2 text-sm">
                        {getSelectedSlots().map((slot) => (
                          <div key={slot.id} className="bg-gray-50 p-2 rounded">
                            <p className="font-semibold">{formatDate(slot.date)}</p>
                            <p className="text-gray-600">{slot.time} {slot.isNightTime && <span className="text-purple-600">(Night)</span>}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Student Name</p>
                    <p className="font-semibold">{booking.studentName}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Email</p>
                    <p className="font-semibold">{booking.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Phone</p>
                    <p className="font-semibold">{booking.phone}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-600 text-sm">Address</p>
                    <p className="font-semibold">{booking.address}</p>
                  </div>
                </div>

                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-3xl font-bold text-primary">${booking.price}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          {step > 1 ? (
            <button
              onClick={handleBack}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              ← Back
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              onClick={handleNext}
              disabled={
                (step === 1 && !booking.lessonType) ||
                (step === 2 && (
                  booking.lessonType === 'single'
                    ? (!booking.date || !booking.time)
                    : selectedSlotIds.length < requiredLessons
                )) ||
                (step === 3 && !validateBooking(booking, selectedSlotIds).valid)
              }
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {step === 3 ? 'Review Booking' : 'Next →'}
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-secondary transition"
            >
              Confirm Booking ✓
            </button>
          )}
        </div>
      </div>
    </div>
  )
}