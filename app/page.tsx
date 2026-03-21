'use client'

import { useState } from 'react'
import Link from 'next/link'
import DynamicHeadline from '@/components/DynamicHeadline'

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-primary">🚗 Drive With Bui</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8 items-center">
              <Link href="#services" className="text-gray-700 hover:text-primary transition">Services</Link>
              <Link href="#pricing" className="text-gray-700 hover:text-primary transition">Pricing</Link>
              <Link href="#about" className="text-gray-700 hover:text-primary transition">About</Link>
              <Link href="#contact" className="text-gray-700 hover:text-primary transition">Contact</Link>
              <Link href="/dashboard" className="px-4 py-2 border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition">Student Portal</Link>
              <Link href="/instructor" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition">Instructor Portal</Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-700 hover:text-primary focus:outline-none"
              >
                {mobileMenuOpen ? (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 space-y-2">
              <Link href="#services" className="block px-4 py-2 text-gray-700 hover:text-primary hover:bg-blue-50">Services</Link>
              <Link href="#pricing" className="block px-4 py-2 text-gray-700 hover:text-primary hover:bg-blue-50">Pricing</Link>
              <Link href="#about" className="block px-4 py-2 text-gray-700 hover:text-primary hover:bg-blue-50">About</Link>
              <Link href="#contact" className="block px-4 py-2 text-gray-700 hover:text-primary hover:bg-blue-50">Contact</Link>
              <Link href="/dashboard" className="block px-4 py-2 text-gray-700 hover:text-primary hover:bg-blue-50">Student Portal</Link>
              <Link href="/instructor" className="block px-4 py-2 text-gray-700 hover:text-primary hover:bg-blue-50">Instructor Portal</Link>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <DynamicHeadline />
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Patient, professional driving lessons tailored for international students and working holiday makers. Build confidence and get your NSW licence with an instructor who understands your needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/book"
              className="bg-primary text-white px-8 py-3 rounded-lg text-lg hover:bg-secondary transition font-semibold"
            >
              Book a Lesson
            </Link>
            <Link
              href="#pricing"
              className="border-2 border-primary text-primary px-8 py-3 rounded-lg text-lg hover:bg-primary hover:text-white transition font-semibold"
            >
              View Packages
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16" id="services">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why Choose Drive With Bui?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg bg-blue-50 hover:shadow-xl transition">
              <div className="text-5xl mb-4">🕐</div>
              <h3 className="text-xl font-bold mb-2">Flexible Hours</h3>
              <p className="text-gray-600">Weekdays 9am-8pm, weekends 8am-7pm — lessons that fit around your study or work schedule</p>
            </div>
            <div className="text-center p-6 rounded-lg bg-blue-50 hover:shadow-xl transition">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-2">Personalized Lessons</h3>
              <p className="text-gray-600">Tailored instruction based on your experience level, from complete beginner to test preparation</p>
            </div>
            <div className="text-center p-6 rounded-lg bg-blue-50 hover:shadow-xl transition">
              <div className="text-5xl mb-4">🌍</div>
              <h3 className="text-xl font-bold mb-2">International Students Welcome</h3>
              <p className="text-gray-600">Experienced helping students from diverse backgrounds pass their NSW driving test</p>
            </div>
            <div className="text-center p-6 rounded-lg bg-blue-50 hover:shadow-xl transition">
              <div className="text-5xl mb-4">😌</div>
              <h3 className="text-xl font-bold mb-2">Nervous Driver Friendly</h3>
              <p className="text-gray-600">Patient, supportive approach to help you build confidence behind the wheel</p>
            </div>
            <div className="text-center p-6 rounded-lg bg-blue-50 hover:shadow-xl transition">
              <div className="text-5xl mb-4">💯</div>
              <h3 className="text-xl font-bold mb-2">No Rushing</h3>
              <p className="text-gray-600">Full 60-minute lessons with your instructor's complete attention — if needed, I'll take you home safely</p>
            </div>
            <div className="text-center p-6 rounded-lg bg-blue-50 hover:shadow-xl transition">
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
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Simple, Transparent Pricing</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">Single lessons for flexibility, or save with a package — no hidden fees.</p>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Single Lesson */}
            <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-gray-200 hover:shadow-2xl transition">
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
                className="block w-full bg-gray-800 text-white text-center py-3 rounded-lg hover:bg-gray-900 transition font-semibold"
              >
                Book Now
              </Link>
            </div>
            {/* Package */}
            <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-primary hover:shadow-2xl transition relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-primary text-white text-xs px-3 py-1 rounded-bl-lg">Best Value</div>
              <h3 className="text-2xl font-bold mb-4">5-Lesson Package</h3>
              <div className="text-4xl font-bold text-primary mb-2">$250</div>
              <p className="text-gray-500 mb-6">$50 per lesson (save $25)</p>
              <ul className="text-gray-600 mb-6 space-y-2">
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> 5 x 60-minute lessons</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Consistent instructor</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Progress tracking</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Ideal for test preparation</li>
              </ul>
              <Link
                href="/book"
                className="block w-full bg-primary text-white text-center py-3 rounded-lg hover:bg-secondary transition font-semibold"
              >
                Book Package
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-white py-16" id="about">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Your Path to a NSW Licence</h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-gray-600 text-center text-lg mb-12">
              Whether you're an international student, working holiday maker, or just need to build confidence on the road, I'm here to help you every step of the way. Together, we'll work toward getting you safely licensed and road-ready.
            </p>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex items-start">
                <span className="text-3xl mr-4">✓</span>
                <div>
                  <h3 className="text-xl font-bold mb-2">Safe Driving Skills</h3>
                  <p className="text-gray-600">Learn essential skills for navigating Sydney's roads safely and confidently</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-3xl mr-4">✓</span>
                <div>
                  <h3 className="text-xl font-bold mb-2">Test Preparation</h3>
                  <p className="text-gray-600">Mock tests and practice routes to prepare you for your NSW driving test</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-3xl mr-4">✓</span>
                <div>
                  <h3 className="text-xl font-bold mb-2">Experienced Instructor</h3>
                  <p className="text-gray-600">Years of experience helping students from all backgrounds pass their tests</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-3xl mr-4">✓</span>
                <div>
                  <h3 className="text-xl font-bold mb-2">Flexible Scheduling</h3>
                  <p className="text-gray-600">Weekdays 9am-8pm, weekends 8am-7pm — lessons that fit around your life</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-3xl mr-4">✓</span>
                <div>
                  <h3 className="text-xl font-bold mb-2">Patient & Supportive</h3>
                  <p className="text-gray-600">No judgment, just encouragement — everyone learns at their own pace</p>
                </div>
              </div>
              <div className="flex items-start">
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

      {/* CTA Section */}
      <section className="py-16 bg-primary">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Get Your NSW Licence?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join hundreds of students who have successfully passed their driving test with Drive With Bui
          </p>
          <Link
            href="/book"
            className="inline-block bg-white text-primary px-8 py-3 rounded-lg text-lg hover:bg-gray-100 transition font-semibold"
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
              <p className="text-gray-400 mb-2">📍 Sydney, NSW, Australia</p>
              <p className="text-gray-400 mb-2">✉️ drivewithbui@gmail.com</p>
              <p className="text-gray-400 mb-2">📸 @DriveWithBui</p>
              <a
                href="https://instagram.com/DriveWithBui"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition"
              >
                Follow us on Instagram
              </a>
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
