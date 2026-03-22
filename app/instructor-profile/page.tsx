'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

interface InstructorProfile {
  id: string
  bio: string
  experience: string
  teaching_philosophy: string
  car_details: string
  service_area: string
}

export default function InstructorProfilePage() {
  const [profile, setProfile] = useState<InstructorProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadProfile() {
      try {
        const { data, error } = await supabase
          .from('instructor_profile')
          .select('*')
          .single()

        if (error) {
          console.error('Error loading profile:', error)
          setError('Failed to load instructor profile')
          setLoading(false)
          return
        }

        setProfile(data)
        setLoading(false)
      } catch (err) {
        console.error('Error:', err)
        setError('Failed to load instructor profile')
        setLoading(false)
      }
    }

    loadProfile()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="text-center py-12">
            <div className="text-2xl text-gray-600">Loading...</div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-2xl text-red-600">{error}</div>
          </div>
        ) : profile ? (
          <>
            {/* Hero Section */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Meet Your Driving Instructor
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Professional, patient, and passionate about teaching safe driving skills
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
              {/* Left Column: Instructor Info */}
              <div className="space-y-8">
                {/* Bio Card */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">About Me</h2>
                  <div className="space-y-4 text-gray-700">
                    <p>{profile.bio}</p>
                  </div>
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-6">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                          <strong>Note:</strong> My driving instructor license is currently pending final approval. 
                          I am fully qualified and experienced, awaiting formal certification completion.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Experience Card */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Experience</h2>
                  <div className="space-y-4 text-gray-700">
                    <p>{profile.experience}</p>
                  </div>
                </div>

                {/* Teaching Philosophy Card */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">My Teaching Philosophy</h2>
                  <div className="space-y-4 text-gray-700">
                    <p>{profile.teaching_philosophy}</p>
                  </div>
                </div>
              </div>

              {/* Right Column: Quick Info & CTA */}
              <div className="space-y-8">
                {/* Instructor Image */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <div className="relative w-full h-64 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-4">🚗</div>
                      <p className="text-gray-600">Your Instructor</p>
                    </div>
                  </div>
                </div>

                {/* Vehicle Info */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">My Vehicle</h2>
                  <div className="space-y-4 text-gray-700">
                    <p>{profile.car_details}</p>
                  </div>
                </div>

                {/* Service Area */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Service Area</h2>
                  <div className="space-y-4 text-gray-700">
                    <p>{profile.service_area}</p>
                  </div>
                </div>

                {/* CTA Card */}
                <div className="bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-lg p-8 text-white">
                  <h2 className="text-2xl font-bold mb-4">Ready to Start?</h2>
                  <p className="mb-6 opacity-90">
                    Book your first lesson today and start your journey to becoming a confident driver.
                  </p>
                  <Link 
                    href="/book"
                    className="block w-full bg-white text-primary text-center py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
                  >
                    Book a Lesson
                  </Link>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-2xl text-gray-600">No instructor profile found</div>
          </div>
        )}
      </main>
    </div>
  )
}
