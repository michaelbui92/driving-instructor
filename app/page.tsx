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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          <div className="flex-1 text-center lg:text-left" data-aos="fade-right">
            <div className="min-h-[4rem] md:min-h-[5rem] flex items-center justify-center lg:justify-start">
              <DynamicHeadline />
            </div>
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

      {/* Why Choose Drive With Bui? */}
      <section className="bg-white py-16" id="why-choose">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" data-aos="fade-up">Why Drive With Bui?</h2>
          <div className="grid md:grid-cols-2 gap-8">
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

      {/* Latest from the Blog */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2" data-aos="fade-up">Latest from the Blog</h2>
              <p className="text-gray-600" data-aos="fade-up" data-aos-delay="100">
                Driving tips and advice to help you become a safer driver
              </p>
            </div>
            <Link
              href="/blog"
              className="hidden md:inline-flex items-center gap-2 px-6 py-3 bg-white text-primary font-semibold rounded-xl hover:bg-gray-50 transition shadow-md"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              View All Posts →
            </Link>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Post 1 */}
            <Link href="/blog/three-second-rule" className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition hover-lift group" data-aos="fade-up" data-aos-delay="0">
              <div className="bg-gradient-to-br from-blue-100 to-indigo-100 h-40 flex items-center justify-center">
                <span className="text-5xl group-hover:scale-110 transition">⏱️</span>
              </div>
              <div className="p-6">
                <div className="bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full inline-block mb-3">
                  Safety Tips
                </div>
                <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition">
                  The 3-Second Rule: How Much Space Do You Really Need?
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  Understanding safe stopping distances, rolling stops vs abrupt braking, and progressive braking technique.
                </p>
                <span className="text-primary text-sm font-semibold group-hover:underline">
                  Read more →
                </span>
              </div>
            </Link>

            {/* Post 2 */}
            <Link href="/blog/scanning-hazards" className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition hover-lift group" data-aos="fade-up" data-aos-delay="100">
              <div className="bg-gradient-to-br from-amber-100 to-orange-100 h-40 flex items-center justify-center">
                <span className="text-5xl group-hover:scale-110 transition">👁️</span>
              </div>
              <div className="p-6">
                <div className="bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full inline-block mb-3">
                  Safety Tips
                </div>
                <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition">
                  Scanning for Hazards: Stay One Step Ahead
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  Learn essential hazard scanning techniques every driver should master. From reversing out of driveways to spotting children near parks.
                </p>
                <span className="text-primary text-sm font-semibold group-hover:underline">
                  Read more →
                </span>
              </div>
            </Link>

            {/* Post 3 */}
            <Link href="/blog/night-driving" className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition hover-lift group" data-aos="fade-up" data-aos-delay="200">
              <div className="bg-gradient-to-br from-indigo-100 to-purple-100 h-40 flex items-center justify-center">
                <span className="text-5xl group-hover:scale-110 transition">🌙</span>
              </div>
              <div className="p-6">
                <div className="bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full inline-block mb-3">
                  Night Driving
                </div>
                <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition">
                  Night Driving: Essential Tips for Safety
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  Everything you need to know about driving safely after dark, from proper headlight use to managing glare.
                </p>
                <span className="text-primary text-sm font-semibold group-hover:underline">
                  Read more →
                </span>
              </div>
            </Link>
          </div>

          <div className="mt-8 text-center md:hidden">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary font-semibold rounded-xl hover:bg-gray-50 transition shadow-md"
            >
              View All Posts →
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-white py-16" id="testimonials">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center" data-aos="fade-up">
            What Students Say
          </h2>
          <div className="max-w-3xl mx-auto">
            {/* Testimonial 1 - Jihee */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 md:p-10 shadow-lg" data-aos="fade-up">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-3xl text-white">
                  👩
                </div>
                <div>
                  <p className="text-2xl font-bold">Jihee</p>
                  <p className="text-gray-600 text-sm">지희</p>
                </div>
              </div>
              <blockquote className="text-lg text-gray-700 leading-relaxed mb-4">
                "I came to Australia as a working holiday student with no driving experience. Through Michael's patient teaching, I learned essential driving skills that gave me confidence on the road. With his guidance, I was able to complete my 2nd visa requirements and even drive to Victoria! Michael's lessons changed my life."
              </blockquote>
              <p className="text-gray-600 italic leading-relaxed mb-6 text-sm">
                저는 운전 경력이 전혀 없는 워킹 홀리데이 학생으로 호주에 왔습니다. Michael님의 인내심 있는 가르침으로 저는 도로에서의 자신감을 준 필수 운전 기술을 배웠습니다. 그의 안내로 저는 2번째 비자 요건을 완료하고 빅토리아까지 운전할 수 있었습니다! Michael님의 수업은 제 인생을 바꿨습니다.
              </p>
              <div className="flex items-center gap-2 text-yellow-500">
                <span>⭐⭐⭐⭐⭐</span>
                <span className="text-gray-500 text-sm ml-2">Working Holiday Student</span>
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