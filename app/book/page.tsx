'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  generateTimeSlots,
  formatDate,
  getLessonPrice,
  getLessonTypeName,
  validateStep1,
  validateStep2,
  validateStep3,
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
  const [selectedLessonImage, setSelectedLessonImage] = useState<string>('single')

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
  
  // Hover descriptions for lesson types
  const lessonDescriptions: Record<string, { title: string; description: string }> = {
    'casual': {
      title: 'Casual Driving',
      description: 'Best for students who want to build confidence, take it easy, drive somewhere with an experienced instructor'
    },
    'single': {
      title: 'Single Lesson',
      description: 'Learn practical skills such as parking, driving skills, safety tips and more'
    }
  }

  // Step 2: Date and Time Selection
  const allSlots = generateTimeSlots()
  const uniqueDates = Array.from(new Set(allSlots.map(slot => slot.date)))

  // Helper functions
  const getSlotsForDate = (date: string) => {
    // Get all existing bookings (not cancelled) to check availability
    return getAvailableSlots(date, existingBookings.filter(b => b.status !== 'cancelled'))
  }

  const handleLessonTypeSelect = (typeId: string) => {
    setBooking(prev => ({ ...prev, lessonType: typeId }))
    setSelectedSlotIds([]) // Reset selections
  }

  const handleSlotToggle = (slot: TimeSlot) => {
    const slotId = slot.id

    // Single lesson: select this slot, deselect all others
    setBooking(prev => ({
      ...prev,
      date: slot.date,
      time: slot.time,
      price: getLessonPrice(prev.lessonType || 'single'),
    }))
    setSelectedSlotIds([slotId])
  }

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBooking(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleNext = () => {
    if (step === 1) {
      const validation = validateStep1(booking)
      if (validation.valid) {
        setStep(2)
      } else {
        alert(validation.errors.join('\n'))
      }
    } else if (step === 2) {
      const validation = validateStep2(booking, selectedSlotIds)
      if (validation.valid) {
        setStep(3)
      } else {
        alert(validation.errors.join('\n'))
      }
    } else if (step === 3) {
      const validation = validateStep3(booking)
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
    // Single lesson: Create one booking record
    const totalPrice = getLessonPrice(booking.lessonType || 'single')
    const newBooking: Booking = {
      id: `BK-${Date.now()}`,
      studentName: booking.studentName || '',
      email: booking.email || '',
      phone: booking.phone || '',
      address: booking.address,
      lessonType: booking.lessonType || 'single',
      date: booking.date || '',
      time: booking.time || '',
      price: totalPrice,
      status: 'pending',
      createdAt: new Date().toISOString(),
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
            <h2 className="text-3xl font-bold mb-6">Choose Your Lesson</h2>
            <div className="flex flex-col md:flex-row gap-8">
              {/* LEFT: Two lesson cards stacked */}
              <div className="flex flex-col gap-4 md:w-1/2">
                {lessonTypes.map((type) => {
                  return (
                    <div
                      key={type.id}
                      className={`p-6 rounded-xl border-2 cursor-pointer transition ${
                        booking.lessonType === type.id
                          ? 'border-primary bg-blue-50'
                          : 'border-gray-200 bg-white hover:border-primary'
                      }`}
                      onClick={() => {
                        handleLessonTypeSelect(type.id)
                        setSelectedLessonImage(type.id)
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-bold mb-2">
                            {type.name}
                          </h3>
                          <p className="text-gray-600 mb-4">{type.duration}</p>
                          <div className="text-3xl font-bold text-primary">
                            ${type.price}
                          </div>
                          {type.id === 'casual' && (
                            <p className="text-xs text-green-600 mt-2">Great value!</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* RIGHT: Image on top, description below */}
              <div className="md:w-1/2 flex flex-col gap-4">
                {/* Lesson Image */}
                <div 
                  className="relative w-full h-72 rounded-xl overflow-hidden shadow-xl bg-white border-2 border-gray-200 cursor-pointer"
                  onClick={() => setBooking(prev => ({ ...prev }))}
                >
                  {selectedLessonImage === 'single' ? (
                    <Image src="/images/hover-single.png" alt="Single Lesson" fill className="object-contain" />
                  ) : (
                    <Image src="/images/hover-casual.png" alt="Casual Driving" fill className="object-contain" />
                  )}
                </div>

                {/* Fixed-height Description Box */}
                <div className="bg-white rounded-xl p-5 shadow-lg border-2 border-gray-200 h-56 overflow-y-auto">
                  <h4 className="text-lg font-bold mb-3 text-gray-800">
                    {selectedLessonImage === 'single' ? 'Single Lesson' : 'Casual Driving'}
                  </h4>
                  {selectedLessonImage === 'single' ? (
                    <div className="text-gray-600 text-sm leading-relaxed">
                      <p className="mb-3">Perfect for new students taking their first steps. Learn essential driving skills including:</p>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <span className="text-primary mr-2">→</span>
                          Proper steering and mirror checks
                        </li>
                        <li className="flex items-start">
                          <span className="text-primary mr-2">→</span>
                          Lane changing and merging safely
                        </li>
                        <li className="flex items-start">
                          <span className="text-primary mr-2">→</span>
                          Parking techniques (reversing, 3-point turns)
                        </li>
                        <li className="flex items-start">
                          <span className="text-primary mr-2">→</span>
                          Road rules and situational awareness
                        </li>
                        <li className="flex items-start">
                          <span className="text-primary mr-2">→</span>
                          Building confidence behind the wheel
                        </li>
                      </ul>
                    </div>
                  ) : (
                    <div className="text-gray-600 text-sm leading-relaxed">
                      <p className="mb-3">For students who already know the basics and want to maintain their skills. Practice real-world driving without pressure:</p>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <span className="text-primary mr-2">→</span>
                          Keep skills sharp between lessons
                        </li>
                        <li className="flex items-start">
                          <span className="text-primary mr-2">→</span>
                          Gain experience on various road types
                        </li>
                        <li className="flex items-start">
                          <span className="text-primary mr-2">→</span>
                          Relaxed, stress-free driving practice
                        </li>
                        <li className="flex items-start">
                          <span className="text-primary mr-2">→</span>
                          Prepare for your driving test
                        </li>
                        <li className="flex items-start">
                          <span className="text-primary mr-2">→</span>
                          Build muscle memory and independence
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-3xl font-bold mb-6">Select Date & Time</h2>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-yellow-800">
                <strong>Availability:</strong> Weekday evenings (6pm-8pm), weekends (8am-7pm). <strong>Note:</strong> If you book 6pm, 7pm is blocked to ensure full dedication to your lesson. 8pm is a night time booking. Some days may have limited availability due to max booking rules.
              </p>
            </div>

            <div className="space-y-6">
              {/* Date Selection */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Available Dates</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {uniqueDates.slice(0, 14).map((date) => {
                    const slotsForDate = getSlotsForDate(date)
                    const isSelected = booking.date === date
                    const isDisabled = slotsForDate.length === 0

                    return (
                      <button
                        key={date}
                        disabled={isDisabled}
                        className={`p-4 rounded-lg border-2 transition ${
                          isSelected
                            ? 'border-primary bg-blue-50'
                            : isDisabled
                            ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'border-gray-200 bg-white hover:border-primary'
                        }`}
                        onClick={() => setBooking(prev => ({ ...prev, date }))}
                      >
                        <div className="font-semibold">{formatDate(date)}</div>
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
                          disabled={selectedSlotIds.includes(slot.id)}
                          className={`p-4 rounded-lg border-2 transition ${
                            selectedSlotIds.includes(slot.id)
                              ? 'border-primary bg-blue-50'
                              : slot.isNightTime
                              ? 'border-purple-300 bg-purple-50 hover:border-purple-400'
                              : 'border-gray-200 bg-white hover:border-primary'
                          } ${selectedSlotIds.includes(slot.id) ? 'cursor-not-allowed' : ''}`}
                          onClick={() => handleSlotToggle(slot)}
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
                    <p className="font-semibold">{getLessonTypeName(booking.lessonType || 'single')}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Price</p>
                    <p className="font-semibold text-primary">${getLessonPrice(booking.lessonType || 'single')}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-600 text-sm">Date & Time</p>
                    <div>
                      <p className="font-semibold">{formatDate(booking.date || '')}</p>
                      <p className="text-gray-600">{booking.time}</p>
                    </div>
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
                    <span className="text-3xl font-bold text-primary">${getLessonPrice(booking.lessonType || 'single')}</span>
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
                (step === 3 && !validateStep3(booking).valid)
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