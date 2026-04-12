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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Navbar />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          <div className="flex-[3] text-center lg:text-left" data-aos="fade-right">
            <div className="min-h-[4rem] md:min-h-[5rem] flex items-center justify-center lg:justify-start mb-8">
              <DynamicHeadline />
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              Transform from nervous beginner to confident driver with Sydney's most patient instructor.
              Specializing in international students and those who need extra care on the road.
            </p>
            <p className="text-gray-700 dark:text-gray-400 mb-8">
              🚗 <span className="font-semibold">Master Sydney roads</span> with personalized coaching
              <br />
              🌏 <span className="font-semibold">International students welcome</span> - English/Korean support
              <br />
              😌 <span className="font-semibold">Nervous driver friendly</span> - Zero judgment, all patience
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-8">
              <Link
                href="/book"
                className="px-8 py-4 bg-primary text-white text-lg font-semibold rounded-xl hover:bg-secondary transition shadow-lg shimmer-btn dark:shadow-gray-900/50"
              >
                Start Your Driving Journey
              </Link>
              <Link
                href="/about"
                className="px-8 py-4 bg-white dark:bg-gray-800 text-primary dark:text-blue-400 text-lg font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition shadow-lg border-2 border-primary dark:border-blue-500"
              >
                Meet Your Instructor
              </Link>
            </div>
          </div>
          <div className="flex-1 relative w-full min-w-0" data-aos="fade-left">
            <div className="relative w-full h-48 md:h-64">
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

      {/* Why Drive With Bui? - Redesigned */}
      <section className="bg-white dark:bg-gray-900 py-16" id="why-choose">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Why Students Choose Drive With Bui</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              More than just driving lessons - a supportive journey to confidence on Sydney roads
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-blue-100 dark:border-gray-700" data-aos="fade-up" data-aos-delay="0">
              <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🌏</span>
              </div>
              <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">International Focus</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Specialized in helping international students navigate NSW licensing requirements
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-green-100 dark:border-gray-700" data-aos="fade-up" data-aos-delay="100">
              <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">😌</span>
              </div>
              <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">Zero Judgment</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Patient, understanding approach for nervous drivers - everyone starts somewhere
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-purple-100 dark:border-gray-700" data-aos="fade-up" data-aos-delay="200">
              <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">⏱️</span>
              </div>
              <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">Full 60 Minutes</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                No rushing - complete attention for the entire lesson, plus safe ride home if needed
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-amber-100 dark:border-gray-700" data-aos="fade-up" data-aos-delay="300">
              <div className="w-14 h-14 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">Easy Booking</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Simple online scheduling that fits around work, study, or family commitments
              </p>
            </div>
          </div>

          {/* Additional Benefits */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg" data-aos="fade-up" data-aos-delay="0">
              <div className="text-green-500 text-xl">✓</div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Dual Control Vehicle</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Extra safety with instructor controls</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg" data-aos="fade-up" data-aos-delay="100">
              <div className="text-green-500 text-xl">✓</div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Mock tests & practice routes</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Test Preparation</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg" data-aos="fade-up" data-aos-delay="200">
              <div className="text-green-500 text-xl">✓</div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Weekdays & weekends available</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Flexible Scheduling</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-16" id="pricing">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">No hidden fees, no surprises - just quality driving instruction</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Single Lesson */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300" data-aos="fade-up" data-aos-delay="200">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Single Lesson</h3>
                <div className="text-5xl font-bold text-primary mb-2">$55</div>
                <p className="text-gray-500 dark:text-gray-400 mb-6">per 60-minute lesson</p>

                <div className="space-y-3 mb-8 text-left">
                  <div className="flex items-start gap-3">
                    <div className="text-green-600 text-xl">✓</div>
                    <p className="text-gray-700 dark:text-gray-300">Book lessons as you need them</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="text-green-600 text-xl">✓</div>
                    <p className="text-gray-700 dark:text-gray-300">Maximum flexibility</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="text-green-600 text-xl">✓</div>
                    <p className="text-gray-700 dark:text-gray-300">Pay as you go</p>
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
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 relative" data-aos="fade-up" data-aos-delay="300">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <span className="inline-block px-4 py-1 bg-accent text-white text-sm font-semibold rounded-full">Best Value</span>
              </div>
              
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Casual Driving</h3>
                <div className="text-5xl font-bold text-gray-800 dark:text-white mb-2">$45</div>
                <p className="text-gray-500 dark:text-gray-400 mb-6">per 60-minute lesson</p>
                
                <div className="space-y-3 mb-8 text-left">
                  <div className="flex items-start gap-3">
                    <div className="text-green-600 text-xl">✓</div>
                    <p className="text-gray-700 dark:text-gray-300">Any Drivers welcome</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="text-green-600 text-xl">✓</div>
                    <p className="text-gray-700 dark:text-gray-300">Maintenance & practice</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="text-green-600 text-xl">✓</div>
                    <p className="text-gray-700 dark:text-gray-300">Stay road-ready</p>
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

          {/* Pricing Note */}
          <div className="mt-12 text-center" data-aos="fade-up" data-aos-delay="400">
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              <span className="font-semibold text-gray-900 dark:text-white">Note:</span> All lessons include dual-control vehicle,
              comprehensive insurance, and pick-up/drop-off within the Lidcombe area.
              Additional travel fees may apply for locations outside the service area.
            </p>
          </div>
        </div>
      </section>

      {/* Latest from the Blog */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2 text-gray-900 dark:text-white" data-aos="fade-up">Latest from the Blog</h2>
              <p className="text-gray-600 dark:text-gray-300" data-aos="fade-up" data-aos-delay="100">
                Practical driving tips and safety advice from your instructor
              </p>
            </div>
            <Link
              href="/blog"
              className="hidden md:inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 text-primary dark:text-blue-400 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition shadow-md dark:shadow-gray-900/50"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              View All Posts →
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Post 1 */}
            <Link href="/blog/three-second-rule" className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition hover-lift group border border-gray-100 dark:border-gray-700" data-aos="fade-up" data-aos-delay="0">
              <div className="bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 h-40 flex items-center justify-center">
                <span className="text-5xl group-hover:scale-110 transition">⏱️</span>
              </div>
              <div className="p-6">
                <div className="bg-primary/10 dark:bg-blue-900/30 text-primary dark:text-blue-400 text-xs font-semibold px-3 py-1 rounded-full inline-block mb-3">
                  Safety Tips
                </div>
                <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition text-gray-900 dark:text-white">
                  The 3-Second Rule: How Much Space Do You Really Need?
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                  Understanding safe stopping distances, rolling stops vs abrupt braking, and progressive braking technique.
                </p>
                <span className="text-primary dark:text-blue-400 text-sm font-semibold group-hover:underline">
                  Read more →
                </span>
              </div>
            </Link>

            {/* Post 2 */}
            <Link href="/blog/scanning-hazards" className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition hover-lift group border border-gray-100 dark:border-gray-700" data-aos="fade-up" data-aos-delay="100">
              <div className="bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 h-40 flex items-center justify-center">
                <span className="text-5xl group-hover:scale-110 transition">👁️</span>
              </div>
              <div className="p-6">
                <div className="bg-primary/10 dark:bg-blue-900/30 text-primary dark:text-blue-400 text-xs font-semibold px-3 py-1 rounded-full inline-block mb-3">
                  Safety Tips
                </div>
                <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition text-gray-900 dark:text-white">
                  Scanning for Hazards: Stay One Step Ahead
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                  Learn essential hazard scanning techniques every driver should master.
                </p>
                <span className="text-primary dark:text-blue-400 text-sm font-semibold group-hover:underline">
                  Read more →
                </span>
              </div>
            </Link>

            {/* Post 3 */}
            <Link href="/blog/night-driving" className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition hover-lift group border border-gray-100 dark:border-gray-700" data-aos="fade-up" data-aos-delay="200">
              <div className="bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 h-40 flex items-center justify-center">
                <span className="text-5xl group-hover:scale-110 transition">🌙</span>
              </div>
              <div className="p-6">
                <div className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs font-semibold px-3 py-1 rounded-full inline-block mb-3">
                  Night Driving
                </div>
                <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition text-gray-900 dark:text-white">
                  Night Driving: Essential Tips for Safety
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                  Everything you need to know about driving safely after dark.
                </p>
                <span className="text-primary dark:text-blue-400 text-sm font-semibold group-hover:underline">
                  Read more →
                </span>
              </div>
            </Link>
          </div>

          <div className="mt-8 text-center md:hidden">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 text-primary dark:text-blue-400 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition shadow-md dark:shadow-gray-900/50"
            >
              View All Posts →
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-white dark:bg-gray-900 py-16" id="testimonials">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-900 dark:text-white" data-aos="fade-up">
            What Students Say
          </h2>
          <div className="max-w-3xl mx-auto">
            {/* Testimonial 1 - Jihee */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 md:p-10 shadow-lg border border-blue-100 dark:border-gray-700" data-aos="fade-up">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-3xl text-white">
                  👩
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">Jihee</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">지희</p>
                </div>
              </div>
              <blockquote className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                "I came to Australia as a working holiday student with no driving experience. Through Michael's patient teaching, I learned essential driving skills that gave me confidence on the road. With his guidance, I was able to complete my 2nd visa requirements and even drive from Sydney to rural Victoria! Michael's lessons changed my life."
              </blockquote>
              <p className="text-gray-600 dark:text-gray-400 italic leading-relaxed mb-6 text-sm">
                저는 운전 경력이 전혀 없는 워킹 홀리데이 학생으로 호주에 왔습니다. 마이클님의 인내심 있는 가르침으로 저는 도로에서의 자신감을 준 필수 운전 기술을 배웠습니다. 그의 안내로 저는 두 번째 비자 요건을 완료하고 시드니에서 시골 빅토리아까지 운전할 수 있었습니다! 마이클님의 수업은 제 인생을 바꿨습니다.
              </p>
              <div className="flex items-center gap-2 text-yellow-500">
                <span>⭐⭐⭐⭐⭐</span>
                <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">워킹 홀리데이 학생</span>
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
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-700 dark:to-pink-700 text-white text-lg font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 dark:hover:from-purple-800 dark:hover:to-pink-800 transition shadow-lg hover-lift"
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