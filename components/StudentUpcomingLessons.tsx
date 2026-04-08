'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { formatDate, getLessonPrice, getLessonTypeName, type Booking } from '@/lib/booking-utils'

interface StudentUpcomingLessonsProps {
  isLoggedIn: boolean
  userEmail?: string
}

export default function StudentUpcomingLessons({ isLoggedIn, userEmail }: StudentUpcomingLessonsProps) {
  const [loading, setLoading] = useState(true)
  const [upcomingLessons, setUpcomingLessons] = useState<Booking[]>([])
  const [error, setError] = useState('')

  // Fetch upcoming lessons when logged in
  useEffect(() => {
    if (isLoggedIn && userEmail) {
      fetchUpcomingLessons()
    } else {
      setLoading(false)
    }
  }, [isLoggedIn, userEmail])

  const fetchUpcomingLessons = async () => {
    if (!userEmail) {
      setLoading(false)
      return
    }

    // Guard: ensure supabase env vars are configured (check env directly to avoid TypeScript private property errors)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (!supabaseUrl || 
        supabaseUrl === 'https://placeholder.supabase.co' ||
        !supabaseUrl.startsWith('https://')) {
      console.warn('Supabase not configured, skipping lesson fetch')
      setLoading(false)
      return
    }

    try {
      const today = new Date().toISOString().split('T')[0]
      
      const { data, error } = await supabase
        .from('bookings_new')
        .select('*')
        .eq('email', userEmail)
        .gte('date', today)
        .not('status', 'eq', 'cancelled')
        .order('date', { ascending: true })

      if (error) {
        console.error('Error fetching upcoming lessons:', error)
        setError('Failed to load your lessons')
        return
      }

      // Convert to app format
      const formatted: Booking[] = (data || []).map((b: any) => ({
        id: b.id,
        studentName: b.student_name || '',
        email: b.email || '',
        phone: b.phone || '',
        date: b.date || '',
        time: b.time || '',
        lessonType: b.lesson_type || 'single',
        status: b.status || 'pending',
        price: getLessonPrice(b.lesson_type || 'single'),
        createdAt: b.created_at || '',
      }))

      setUpcomingLessons(formatted)
    } catch (error) {
      console.error('Error in fetchUpcomingLessons:', error)
      setError('Failed to load your lessons')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your lessons...</p>
          </div>
        </div>
      </section>
    )
  }

  if (!isLoggedIn) {
    return null // Don't show this section if not logged in
  }

  return (
    <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8" data-aos="fade-up">
          📅 Your Upcoming Lessons
        </h2>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-center text-red-700">
            {error}
          </div>
        )}

        {upcomingLessons.length === 0 ? (
          /* No upcoming lessons */
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center" data-aos="fade-up">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-2xl font-bold mb-2">No Lessons Scheduled</h3>
            <p className="text-gray-600 mb-6">
              Ready to start your driving journey?
            </p>
            <Link
              href="/book"
              className="inline-block px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-secondary transition hover-lift"
            >
              Book a Lesson
            </Link>
          </div>
        ) : (
          /* Show upcoming lessons */
          <div className="space-y-6 mb-8">
            {upcomingLessons.slice(0, 2).map((lesson, index) => {
              const isFirst = index === 0
              const borderColor = isFirst ? 'border-primary' : 'border-blue-400'
              const badgeColor = isFirst 
                ? 'bg-primary text-white' 
                : 'bg-blue-100 text-blue-800'
              const badgeText = isFirst ? 'NEXT LESSON' : 'FOLLOWING LESSON'

              return (
                <div 
                  key={lesson.id} 
                  className={`bg-white rounded-2xl shadow-xl p-8 border-l-4 ${borderColor}`}
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className={`text-sm font-semibold ${badgeColor} px-3 py-1 rounded-full`}>
                        {badgeText}
                      </span>
                      <h3 className={`${isFirst ? 'text-2xl' : 'text-xl'} font-bold mt-2`}>
                        {formatDate(lesson.date)}
                      </h3>
                    </div>
                    <span className={`${isFirst ? 'text-2xl' : 'text-xl'} font-bold ${isFirst ? 'text-primary' : 'text-gray-700'}`}>
                      {lesson.time}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-gray-600 font-medium">Lesson Type</p>
                      <p className="font-bold">{getLessonTypeName(lesson.lessonType)}</p>
                      <p className="text-primary font-bold">${lesson.price}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 font-medium">Status</p>
                      <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                        lesson.status === 'confirmed' ? 'bg-green-100 text-green-800'
                        : lesson.status === 'pending' ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                      }`}>
                        {lesson.status.charAt(0).toUpperCase() + lesson.status.slice(1)}
                      </span>
                      <p className="text-gray-600 font-medium mt-2">Pickup Location</p>
                      <p className="font-bold">📍 Lidcombe Station</p>
                      <p className="text-sm text-gray-500">
                        (Confirm when instructor sends confirmation)
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    {isFirst ? (
                      <>
                        <Link
                          href="/student/dashboard"
                          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition font-medium"
                        >
                          View Details
                        </Link>
                        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium">
                          Reschedule
                        </button>
                      </>
                    ) : (
                      <>
                        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium">
                          Reschedule
                        </button>
                        <button className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition font-medium">
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center" data-aos="fade-up" data-aos-delay="200">
          <Link
            href="/book"
            className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-secondary transition hover-lift"
          >
            Book Another Lesson
          </Link>
          <Link
            href="/student/dashboard"
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
          >
            See Full Schedule
          </Link>
        </div>
      </div>
    </section>
  )
}