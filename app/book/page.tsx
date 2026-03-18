'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  generateTimeSlots,
  formatDate,
  getLessonPrice,
  getLessonTypeName,
  validateBooking,
  type Booking,
  type TimeSlot,
} from '@/lib/booking-utils'

export default function BookPage() {
  const [step, setStep] = useState(1)
  const [booking, setBooking] = useState<Partial<Booking>>({
    lessonType: 'single',
  })

  // Step 1: Lesson Type Selection
  const lessonTypes = [
    { id: 'single', name: 'Single Lesson', duration: '60 min', price: 45 },
    { id: '5-pack', name: '5-Lesson Package', duration: '5 × 60 min', price: 220 },
    { id: '10-pack', name: '10-Lesson Package', duration: '10 × 60 min', price: 430 },
    { id: 'test-prep', name: 'Test Preparation', duration: '90 min', price: 50 },
  ]

  // Step 2: Date and Time Selection
  const allSlots = generateTimeSlots()
  const uniqueDates = Array.from(new Set(allSlots.map(slot => slot.date)))

  // Helper functions
  const getSlotsForDate = (date: string) => {
    return allSlots.filter(slot => slot.date === date)
  }

  const handleLessonTypeSelect = (typeId: string) => {
    setBooking(prev => ({ ...prev, lessonType: typeId }))
  }

  const handleDateTimeSelect = (slot: TimeSlot) => {
    setBooking(prev => ({
      ...prev,
      date: slot.date,
      time: slot.time,
      price: getLessonPrice(prev.lessonType || 'single'),
    }))
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
      if (booking.date && booking.time) {
        setStep(3)
      }
    } else if (step === 3) {
      const validation = validateBooking(booking)
      if (validation.valid) {
        setStep(4)
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
      lessonType: booking.lessonType || 'single',
      date: booking.date || '',
      time: booking.time || '',
      price: booking.price || 0,
      status: 'pending',
      createdAt: new Date().toISOString(),
    }

    // Store in localStorage for demo
    const existingBookings = JSON.parse(localStorage.getItem('bookings') || '[]')
    localStorage.setItem('bookings', JSON.stringify([...existingBookings, newBooking]))

    alert('Booking confirmed! A confirmation email will be sent shortly.')
    window.location.href = '/'
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
            <h2 className="text-3xl font-bold mb-6">Choose Your Lesson Type</h2>
            <div className="grid md:grid-cols-2 gap-4">
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
            <h2 className="text-3xl font-bold mb-6">Select Date & Time</h2>
            
            <div className="space-y-6">
              {/* Date Selection */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Available Dates</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {uniqueDates.slice(0, 8).map((date) => (
                    <button
                      key={date}
                      className={`p-4 rounded-lg border-2 transition ${
                        booking.date === date
                          ? 'border-primary bg-blue-50'
                          : 'border-gray-200 bg-white hover:border-primary'
                      }`}
                      onClick={() => setBooking(prev => ({ ...prev, date }))}
                    >
                      <div className="font-semibold">{formatDate(date)}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Selection */}
              {booking.date && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">Available Time Slots</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {getSlotsForDate(booking.date).map((slot) => (
                      <button
                        key={slot.id}
                        className={`p-4 rounded-lg border-2 transition ${
                          booking.time === slot.time
                            ? 'border-primary bg-blue-50'
                            : 'border-gray-200 bg-white hover:border-primary'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDateTimeSelect(slot)
                        }}
                      >
                        <div className="font-semibold">{slot.time}</div>
                      </button>
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
                  <div>
                    <p className="text-gray-600 text-sm">Date</p>
                    <p className="font-semibold">{formatDate(booking.date || '')}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Time</p>
                    <p className="font-semibold">{booking.time}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Student Name</p>
                    <p className="font-semibold">{booking.studentName}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Email</p>
                    <p className="font-semibold">{booking.email}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-600 text-sm">Phone</p>
                    <p className="font-semibold">{booking.phone}</p>
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
                (step === 2 && (!booking.date || !booking.time)) ||
                (step === 3 && !validateBooking(booking).valid)
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