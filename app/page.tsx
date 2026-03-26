'use client'

import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import DynamicHeadline from '@/components/DynamicHeadline'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left" data-aos="fade-right">
            <DynamicHeadline />
            <div className="mb-4" data-aos="fade-up" data-aos-delay="100">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                Serving the Lidcombe Area
              </span>
            </div>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto lg:mx-0" data-aos="fade-up" data-aos-delay="200">
              Patient, professional driving lessons tailored for international students and working holiday makers. Build confidence and get your NSW licence with an instructor who understands your needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start" data-aos="fade-up" data-aos-delay="300">
              <Link
                href="/book"
                className="shimmer-btn bg-primary text-white px-8 py-3 rounded-lg text-lg hover:bg-secondary transition font-semibold text-center"
              >
                Book a Lesson
              </Link>
              <Link
                href="#pricing"
                className="border-2 border-primary text-primary px-8 py-3 rounded-lg text-lg hover:bg-primary hover:text-white transition font-semibold text-center"
              >
                View Packages
              </Link>
            </div>
          </div>
          <div className="flex-shrink-0" data-aos="fade-left" data-aos-delay="200">
            <div className="relative w-64 h-64 md:w-80 md:h-80">
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

      {/* Features Section */}
      <section className="bg-white py-16" id="services">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" data-aos="fade-up">Why Choose Drive With Bui?</h2>
          <div className="grid md:grid-cols-3 gap-8">
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
            <div className="text-center p-6 rounded-lg bg-blue-50 hover:shadow-xl transition hover-lift" data-aos="fade-up" data-aos-delay="300">
              <div className="text-5xl mb-4">😌</div>
              <h3 className="text-xl font-bold mb-2">Nervous Driver Friendly</h3>
              <p className="text-gray-600">Patient, supportive approach to help you build confidence behind the wheel</p>
            </div>
            <div className="text-center p-6 rounded-lg bg-blue-50 hover:shadow-xl transition hover-lift" data-aos="fade-up" data-aos-delay="400">
              <div className="text-5xl mb-4">💯</div>
              <h3 className="text-xl font-bold mb-2">No Rushing</h3>
              <p className="text-gray-600">Full 60-minute lessons with your instructor's complete attention — if needed, I'll take you home safely</p>
            </div>
            <div className="text-center p-6 rounded-lg bg-blue-50 hover:shadow-xl transition hover-lift" data-aos="fade-up" data-aos-delay="500">
              <div className="text-5xl mb-4">📱</div>
              <h3 className="text-xl font-bold mb-2">Easy Online Booking</h3>
              <p className="text-gray-600">Book lessons anytime through our simple online system</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-gradient-to-b from-blue-50 to-indigo-100" id="pricing">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4" data-aos="fade-up">Simple, Transparent Pricing</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="100">Simple, straightforward pricing — no hidden fees.</p>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Single Lesson */}
            <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-gray-200 hover:shadow-2xl transition hover-lift" data-aos="fade-up" data-aos-delay="0">
              <h3 className="text-2xl font-bold mb-4">Single Lesson</h3>
              <div className="text-4xl font-bold text-gray-900 mb-2">$55</div>
              <p className="text-gray-500 mb-6">per 60-minute lesson</p>
              <ul className="text-gray-600 mb-6 space-y-2">
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Book lessons as you need them</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Maximum flexibility</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Pay as you go</li>
              </ul>
              <Link
                href="/book"
                className="shimmer-btn block w-full bg-gray-800 text-white text-center py-3 rounded-lg hover:bg-gray-900 transition font-semibold"
              >
                Book Now
              </Link>
            </div>
            {/* Casual Driving - Best Value */}
            <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-gray-200 hover:shadow-2xl transition hover-lift" data-aos="fade-up" data-aos-delay="100">
              <div className="absolute top-0 right-0 bg-primary text-white text-xs px-3 py-1 rounded-bl-lg">Best Value</div>
              <h3 className="text-2xl font-bold mb-4">Casual Driving</h3>
              <div className="text-4xl font-bold text-gray-900 mb-2">$45</div>
              <p className="text-gray-500 mb-6">per 60-minute lesson</p>
              <ul className="text-gray-600 mb-6 space-y-2">
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Any Drivers welcome</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Maintenance & practice</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Stay road-ready</li>
              </ul>
              <Link
                href="/book"
                className="shimmer-btn block w-full bg-gray-800 text-white text-center py-3 rounded-lg hover:bg-gray-900 transition font-semibold"
              >
                Book Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-white py-16" id="about">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" data-aos="fade-up">Your Path to a NSW Licence</h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-gray-600 text-center text-lg mb-12" data-aos="fade-up" data-aos-delay="100">
              Whether you're an international student, working holiday maker, or just need to build confidence on the road, I'm here to help you every step of the way. Together, we'll work toward getting you safely licensed and road-ready.
            </p>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex items-start" data-aos="fade-up" data-aos-delay="0">
                <span className="text-3xl mr-4">✓</span>
                <div>
                  <h3 className="text-xl font-bold mb-2">Safe Driving Skills</h3>
                  <p className="text-gray-600">Learn essential skills for navigating Sydney's roads safely and confidently</p>
                </div>
              </div>
              <div className="flex items-start" data-aos="fade-up" data-aos-delay="100">
                <span className="text-3xl mr-4">✓</span>
                <div>
                  <h3 className="text-xl font-bold mb-2">Test Preparation</h3>
                  <p className="text-gray-600">Mock tests and practice routes to prepare you for your NSW driving test</p>
                </div>
              </div>
              <div className="flex items-start" data-aos="fade-up" data-aos-delay="200">
                <span className="text-3xl mr-4">✓</span>
                <div>
                  <h3 className="text-xl font-bold mb-2">Experienced Instructor</h3>
                  <p className="text-gray-600">Years of experience helping students from all backgrounds pass their tests</p>
                </div>
              </div>
              <div className="flex items-start" data-aos="fade-up" data-aos-delay="300">
                <span className="text-3xl mr-4">✓</span>
                <div>
                  <h3 className="text-xl font-bold mb-2">Flexible Scheduling</h3>
                  <p className="text-gray-600">Weekdays 9am-8pm, weekends 8am-7pm — lessons that fit around your life</p>
                </div>
              </div>
              <div className="flex items-start" data-aos="fade-up" data-aos-delay="400">
                <span className="text-3xl mr-4">✓</span>
                <div>
                  <h3 className="text-xl font-bold mb-2">Patient & Supportive</h3>
                  <p className="text-gray-600">No judgment, just encouragement — everyone learns at their own pace</p>
                </div>
              </div>
              <div className="flex items-start" data-aos="fade-up" data-aos-delay="500">
                <span className="text-3xl mr-4">✓</span>
                <div>
                  <h3 className="text-xl font-bold mb-2">Dedicated to Your Progress</h3>
                  <p className="text-gray-600">Full 60 minutes every lesson — if you need a lift home, I've got you covered</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Links Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center mb-8" data-aos="fade-up">Portal Access</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* Instructor Dashboard */}
            <a
              href="/dashboard"
              className="block bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition hover:-translate-y-1 border-2 border-gray-200 hover:border-primary"
              data-aos="fade-up" data-aos-delay="0"
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">
                  🔧
                </div>
                <h3 className="text-xl font-bold text-gray-900">Instructor Dashboard</h3>
              </div>
              <p className="text-gray-600 text-sm">Manage bookings, availability, and student progress</p>
            </a>

            {/* Student Dashboard */}
            <a
              href="/student/dashboard"
              className="block bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition hover:-translate-y-1 border-2 border-gray-200 hover:border-primary"
              data-aos="fade-up" data-aos-delay="100"
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl">
                  📚
                </div>
                <h3 className="text-xl font-bold text-gray-900">Student Dashboard</h3>
              </div>
              <p className="text-gray-600 text-sm">View and manage your bookings, reschedule lessons</p>
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary">
        <div className="max-w-4xl mx-auto px-4 text-center" data-aos="fade-up">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Get Your NSW Licence?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join hundreds of students who have successfully passed their driving test with Drive With Bui
          </p>
          <Link
            href="/book"
            className="shimmer-btn inline-block bg-white text-primary px-8 py-3 rounded-lg text-lg hover:bg-gray-100 transition font-semibold"
          >
            Book Your First Lesson
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12" id="contact">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">🚗 Drive With Bui</h3>
              <p className="text-gray-400">Patient, professional driving lessons for international students and working holiday makers in Sydney.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#services" className="hover:text-white transition">Services</Link></li>
                <li><Link href="#pricing" className="hover:text-white transition">Pricing</Link></li>
                <li><Link href="#about" className="hover:text-white transition">About</Link></li>
                <li><Link href="/book" className="hover:text-white transition">Book Now</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Contact</h3>
              <p className="text-gray-400 mb-2">📍 Lidcombe Area, Sydney NSW</p>
              <p className="text-gray-400 mb-2">✉️ drivewithbui@agentmail.to</p>
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <svg className="w-5 h-5 mr-2 text-pink-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  <span className="text-gray-400">📸 @DriveWithBui</span>
                </div>
                <a
                  href="https://instagram.com/DriveWithBui"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-pink-400 hover:text-pink-300 transition font-medium"
                >
                  Follow for driving tips & videos
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
                <p className="text-gray-500 text-sm mt-2">Get weekly driving tips, lesson highlights, and student success stories</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2026 Drive With Bui. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
