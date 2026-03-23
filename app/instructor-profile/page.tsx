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
    // Use static profile data since we don't have Supabase table yet
    const staticProfile: InstructorProfile = {
      id: '1',
      bio: "Hi, I'm Michael - your patient and professional driving instructor in the Lidcombe area. With years of experience helping international students and nervous drivers build confidence on Sydney roads, I specialize in creating a supportive, stress-free learning environment. My teaching approach focuses on practical skills, safety awareness, and building your confidence step by step.",
      experience: "Over 10 years of driving experience in Sydney, with specialized training in defensive driving techniques and student-focused instruction. I've helped hundreds of students from diverse backgrounds successfully obtain their NSW driver's license.",
      teaching_philosophy: "I believe everyone learns at their own pace. My approach is patient, encouraging, and tailored to your individual needs. Whether you're a complete beginner or need refresher lessons, I'll work with you to build skills and confidence in a judgment-free environment.",
      car_details: "Modern dual-controlled vehicle with comprehensive insurance for learner drivers. Features include air conditioning, parking sensors, and safety features to ensure a comfortable and secure learning experience.",
      service_area: "Primarily serving Lidcombe and surrounding Western Sydney suburbs including Auburn, Berala, Regents Park, and Homebush. Flexible meeting locations available for your convenience."
    }
    
    setProfile(staticProfile)
    setLoading(false)
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
                  <div className="bg-green-50 border-l-4 border-green-400 p-4 mt-6">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-green-700">
                          <strong>Student-Focused Approach:</strong> I specialize in working with international students, nervous drivers, and those who need extra patience and support. My goal is to make you feel comfortable and confident behind the wheel.
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
