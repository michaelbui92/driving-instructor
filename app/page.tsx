'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import DynamicHeadline from '@/components/DynamicHeadline'
import StudentUpcomingLessons from '@/components/StudentUpcomingLessons'

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    const checkAuth = async () => {
      const hasLoginCookie = typeof window !== 'undefined' && document.cookie.includes('sb-logged-in')
      
      if (hasLoginCookie) {
        try {
          const res = await fetch('/api/student-auth/verify', {
            method: 'POST',
            credentials: 'include'
          })
          
          if (res.ok) {
            const data = await res.json()
            setIsLoggedIn(true)
            if (data.email) {
              setUserEmail(data.email)
            } else {
              // Fallback to cookie email
              const cookies = document.cookie.split(';')
              for (const cookie of cookies) {
                const [name, value] = cookie.trim().split('=')
                if (name === 'sb-email') {
                  setUserEmail(decodeURIComponent(value))
                  break
                }
              }
            }
          }
        } catch (error) {
          console.error('Error checking auth:', error)
        }
      }
    }
    
    checkAuth()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left" data-aos="fade-right">
            <DynamicHeadline />
            <p className="text-xl text-gray-600 mb-8">
              Professional driving lessons in Western Sydney. Patient, experienced instructor helping you become a confident, safe driver.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/book"
                className="px-8 py-4 bg-primary text-white text-lg font-semibold rounded-xl hover:bg-secondary transition shadow-lg shimmer-btn"
              >
                Book a Lesson
              </Link>
              <Link
                href="/about"
                className="px-8 py-4 bg-white text-primary text-lg font-semibold rounded-xl hover:bg-gray-50 transition shadow-lg border-2 border-primary"
              >
                Learn More
              </Link>
            </div>
          </div>
          <div className="flex-1 relative w-full min-w-0" data-aos="fade-left">
            <div className="relative w-full h-64 md:h-96">
              <Image
                src="/images/mascot-hero.png"
                alt="Chibi Bui - Your friendly driving instructor"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Student Upcoming Lessons Section */}
      <StudentUpcomingLessons isLoggedIn={isLoggedIn} userEmail={userEmail} />

      {/* Why Choose Drive With Bui? */}
      <section className="bg-white py-16" id="why-choose">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" data-aos="fade-up">Why Choose Drive With Bui?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg bg-blue-50 hover:shadow-xl transition hover-lift" data-aos="fade-up" data-aos-delay="0">
              <div className="text-5xl mb-4">🕐</div>
              <h3 className="text-xl font-bold mb-2">Flexible Hours</h3>
              <p className="text-gray-600">Weekdays 9am-8pm, weekends 8am-7pm — lessons that fit around your study or work schedule</p>
            </div>
            <div className="text-center p-6 rounded-lg bg-blue-50 hover:shadow-xl transition hover-lift" data-aos="fade-up" data-aos-delay="100">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-2">Personalized Lessons</h3>
              <p className="text-gray-600">Tailored instruction based on your experience level, from complete beginner to test preparation</p>
            </div>
            <div className="text-center p-6 rounded-lg bg-blue-50 hover:shadow-xl transition hover-lift" data-aos="fade-up" data-aos-delay="200">
              <div className="text-5xl mb-4">🌍</div>
              <h3 className="text-xl font-bold mb-2">International Students Welcome</h3>
              <p className="text-gray-600">Experienced helping students from diverse backgrounds pass their NSW driving test</p>
            </div>
            <div className="text-center p-6 rounded-lg bg-blue-50 hover:shadow-xl transition hover-lift" data-aos="fade-up" data-aos-delay="0">
              <div className="text-5xl mb-4">😌</div>
              <h3 className="text-xl font-bold mb-2">Nervous Driver Friendly</h3>
              <p className="text-gray-600">Patient, supportive approach to help you build confidence behind the wheel</p>
            </div>
            <div className="text-center p-6 rounded-lg bg-blue-50 hover:shadow-xl transition hover-lift" data-aos="fade-up" data-aos-delay="100">
              <div className="text-5xl mb-4">💯</div>
              <h3 className="text-xl font-bold mb-2">No Rushing</h3>
              <p className="text-gray-600">Full 60-minute lessons with your instructor's complete attention — if needed, I'll take you home safely</p>
            </div>
            <div className="text-center p-6 rounded-lg bg-blue-50 hover:shadow-xl transition hover-lift" data-aos="fade-up" data-aos-delay="200">
              <div className="text-5xl mb-4">📱</div>
              <h3 className="text-xl font-bold mb-2">Easy Online Booking</h3>
              <p className="text-gray-600">Book lessons anytime through our simple online system</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16" id="pricing">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Simple, straightforward pricing — no hidden fees.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Single Lesson */}
            <div className="bg-white rounded-2xl shadow-xl p-8" data-aos="fade-up" data-aos-delay="200">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">Single Lesson</h3>
                <div className="text-5xl font-bold text-primary mb-2">$55</div>
                <p className="text-gray-500 mb-6">per 60-minute lesson</p>
                
                <div className="space-y-3 mb-8 text-left">
                  <div className="flex items-start gap-3">
                    <div className="text-green-600 text-xl">✓</div>
                    <p className="text-gray-700">Book lessons as you need them</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="text-green-600 text-xl">✓</div>
                    <p className="text-gray-700">Maximum flexibility</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="text-green-600 text-xl">✓</div>
                    <p className="text-gray-700">Pay as you go</p>
                  </div>
                </div>
                
                <Link
                  href="/book"
                  className="block w-full px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-secondary transition text-center"
                >
                  Book Now
                </Link>
              </div>
            </div>

            {/* Casual Driving */}
            <div className="bg-white rounded-2xl shadow-xl p-8 relative" data-aos="fade-up" data-aos-delay="300">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <span className="inline-block px-4 py-1 bg-accent text-white text-sm font-semibold rounded-full">Best Value</span>
              </div>
              
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">Casual Driving</h3>
                <div className="text-5xl font-bold text-gray-800 mb-2">$45</div>
                <p className="text-gray-500 mb-6">per 60-minute lesson</p>
                
                <div className="space-y-3 mb-8 text-left">
                  <div className="flex items-start gap-3">
                    <div className="text-green-600 text-xl">✓</div>
                    <p className="text-gray-700">Any Drivers welcome</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="text-green-600 text-xl">✓</div>
                    <p className="text-gray-700">Maintenance & practice</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="text-green-600 text-xl">✓</div>
                    <p className="text-gray-700">Stay road-ready</p>
                  </div>
                </div>
                
                <Link
                  href="/book"
                  className="block w-full px-6 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-accent/90 transition text-center"
                >
                  Book Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Your Path to NSW Licence */}
      <section className="bg-white py-16" id="path-to-licence">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div data-aos="fade-right">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Your Path to a NSW Licence</h2>
              <p className="text-xl text-gray-600 mb-8">
                Whether you're an international student, working holiday maker, or just need to build confidence on the road, I'm here to help you every step of the way. Together, we'll work toward getting you safely licensed and road-ready.
              </p>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-secondary transition"
              >
                Learn About My Approach
                <span>→</span>
              </Link>
            </div>
            
            <div data-aos="fade-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl">
                  <div className="text-2xl">✓</div>
                  <div>
                    <h3 className="font-bold mb-1">Safe Driving Skills</h3>
                    <p className="text-gray-600 text-sm">Learn essential skills for navigating Sydney's roads safely and confidently</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-green-50 rounded-xl">
                  <div className="text-2xl">✓</div>
                  <div>
                    <h3 className="font-bold mb-1">Test Preparation</h3>
                    <p className="text-gray-600 text-sm">Mock tests and practice routes to prepare you for your NSW driving test</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-xl">
                  <div className="text-2xl">✓</div>
                  <div>
                    <h3 className="font-bold mb-1">Experienced Instructor</h3>
                    <p className="text-gray-600 text-sm">Years of experience helping students from all backgrounds pass their tests</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-orange-50 rounded-xl">
                  <div className="text-2xl">✓</div>
                  <div>
                    <h3 className="font-bold mb-1">Flexible Scheduling</h3>
                    <p className="text-gray-600 text-sm">Weekdays 9am-8pm, weekends 8am-7pm — lessons that fit around your life</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-pink-50 rounded-xl">
                  <div className="text-2xl">✓</div>
                  <div>
                    <h3 className="font-bold mb-1">Patient & Supportive</h3>
                    <p className="text-gray-600 text-sm">No judgment, just encouragement — everyone learns at their own pace</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-indigo-50 rounded-xl">
                  <div className="text-2xl">✓</div>
                  <div>
                    <h3 className="font-bold mb-1">Dedicated to Your Progress</h3>
                    <p className="text-gray-600 text-sm">Full 60 minutes every lesson — if you need a lift home, I've got you covered</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Instagram Section */}
      <section className="bg-gradient-to-br from-pink-50 to-purple-100 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6" data-aos="fade-up">Follow on Instagram</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="100">
            Get driving tips, updates, and behind-the-scenes content on our Instagram page!
          </p>
          <a
            href="https://instagram.com/drivewithbui"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-lg font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition shadow-lg hover-lift"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            @drivewithbui
          </a>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-primary to-secondary py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6" data-aos="fade-up">Ready to Start Your Driving Journey?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="100">
            Book your first lesson online in just 2 minutes. No phone call needed!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center" data-aos="fade-up" data-aos-delay="200">
            <Link
              href="/book"
              className="px-8 py-4 bg-white text-primary text-lg font-semibold rounded-xl hover:bg-gray-100 transition shadow-lg"
            >
              Book Your First Lesson
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 bg-transparent border-2 border-white text-white text-lg font-semibold rounded-xl hover:bg-white/10 transition"
            >
              Have Questions?
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}