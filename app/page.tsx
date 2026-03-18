'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-lg">
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
              <Link href="/dashboard" className="text-gray-700 hover:text-primary transition">Dashboard</Link>
              <Link href="/instructor" className="text-gray-700 hover:text-primary transition">Instructor</Link>
              <Link
                href="/book"
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-secondary transition"
              >
                Book Now
              </Link>
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
              <Link href="/dashboard" className="block px-4 py-2 text-gray-700 hover:text-primary hover:bg-blue-50">Dashboard</Link>
              <Link href="/instructor" className="block px-4 py-2 text-gray-700 hover:text-primary hover:bg-blue-50">Instructor</Link>
              <Link
                href="/book"
                className="block px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition text-center mx-4"
              >
                Book Now
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Drive With Bui to Get Your License
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Professional driving lessons tailored for international students and working holiday makers. Learn safe driving skills to confidently navigate Sydney's roads with patient, experienced instruction perfect for nervous drivers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/book"
              className="bg-primary text-white px-8 py-3 rounded-lg text-lg hover:bg-secondary transition"
            >
              Book a Lesson
            </Link>
            <Link
              href="#pricing"
              className="border-2 border-primary text-primary px-8 py-3 rounded-lg text-lg hover:bg-primary hover:text-white transition"
            >
              View Packages
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16" id="services">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">What We Offer</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg bg-blue-50 hover:shadow-xl transition">
              <div className="text-5xl mb-4">📅</div>
              <h3 className="text-xl font-bold mb-2">24/7 Online Booking</h3>
              <p className="text-gray-600">Book lessons anytime through our easy-to-use online system</p>
            </div>
            <div className="text-center p-6 rounded-lg bg-blue-50 hover:shadow-xl transition">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-2">Personalized Lessons</h3>
              <p className="text-gray-600">Tailored instruction to match your skill level and goals</p>
            </div>
            <div className="text-center p-6 rounded-lg bg-blue-50 hover:shadow-xl transition">
              <div className="text-5xl mb-4">💰</div>
              <h3 className="text-xl font-bold mb-2">Affordable Packages</h3>
              <p className="text-gray-600">Save money with our discounted lesson packages</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-gradient-to-b from-blue-50 to-indigo-100" id="pricing">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Pricing Packages</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Single Lesson */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition">
              <h3 className="text-2xl font-bold mb-4">Single Lesson</h3>
              <div className="text-4xl font-bold text-primary mb-4">$45</div>
              <p className="text-gray-600 mb-6">60 minutes of professional instruction</p>
              <Link
                href="/book"
                className="block w-full border-2 border-primary text-primary text-center py-3 rounded-lg hover:bg-primary hover:text-white transition"
              >
                Book Now
              </Link>
            </div>

            {/* 5 Lesson Pack */}
            <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-primary hover:shadow-2xl transition transform scale-105">
              <div className="bg-primary text-white text-sm px-3 py-1 rounded-full inline-block mb-4">Most Popular</div>
              <h3 className="text-2xl font-bold mb-4">5 Lesson Pack</h3>
              <div className="text-4xl font-bold text-primary mb-4">$220</div>
              <p className="text-gray-600 mb-2">5 × 60-minute lessons</p>
              <p className="text-green-600 mb-6">Save $5</p>
              <Link
                href="/book"
                className="block w-full bg-primary text-white text-center py-3 rounded-lg hover:bg-secondary transition"
              >
                Get Started
              </Link>
            </div>

            {/* 10 Lesson Pack */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition">
              <h3 className="text-2xl font-bold mb-4">10 Lesson Pack</h3>
              <div className="text-4xl font-bold text-primary mb-4">$430</div>
              <p className="text-gray-600 mb-2">10 × 60-minute lessons</p>
              <p className="text-green-600 mb-6">Save $20</p>
              <Link
                href="/book"
                className="block w-full border-2 border-primary text-primary text-center py-3 rounded-lg hover:bg-primary hover:text-white transition"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-white py-16" id="about">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why Drive With Bui?</h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-gray-600 text-center text-lg mb-12">
              Specifically designed for international students and working holiday makers, Drive With Bui provides patient, experienced instruction to help you get your Australian driver's license with confidence. Perfect for nervous drivers who want to build safe driving skills.
            </p>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex items-start">
                <span className="text-3xl mr-4">✓</span>
                <div>
                  <h3 className="text-xl font-bold mb-2">Safe Driving Skills</h3>
                  <p className="text-gray-600">Teach essential skills for a safe driving experience - help nervous drivers confidently navigate Sydney's roads</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-3xl mr-4">✓</span>
                <div>
                  <h3 className="text-xl font-bold mb-2">Perfect for Nervous Drivers</h3>
                  <p className="text-gray-600">Patient, supportive approach to help you overcome anxiety and build confidence behind the wheel</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-3xl mr-4">✓</span>
                <div>
                  <h3 className="text-xl font-bold mb-2">Experienced Instructor</h3>
                  <p className="text-gray-600">Years of experience helping international students pass their driving tests</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-3xl mr-4">✓</span>
                <div>
                  <h3 className="text-xl font-bold mb-2">Flexible Scheduling</h3>
                  <p className="text-gray-600">Weekday evenings 6pm-8pm, weekends 8am-7pm - fits around study or work</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-3xl mr-4">✓</span>
                <div>
                  <h3 className="text-xl font-bold mb-2">International-Friendly</h3>
                  <p className="text-gray-600">Experienced teaching students from diverse backgrounds and cultures</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-3xl mr-4">✓</span>
                <div>
                  <h3 className="text-xl font-bold mb-2">No Rushing</h3>
                  <p className="text-gray-600">If you book 6pm, 7pm is blocked off ensuring I dedicate the full hour to you and take you home if needed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Start Learning?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join other international students and working holiday makers who have passed their tests with Drive With Bui
          </p>
          <Link
            href="/book"
            className="inline-block bg-white text-primary px-8 py-3 rounded-lg text-lg hover:bg-gray-100 transition"
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
              <h3 className="text-xl font-bold mb-4">Drive With Bui</h3>
              <p className="text-gray-400">Professional driving lessons for international students and working holiday makers in Sydney.</p>
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
              <p className="text-gray-400 mb-2">📍 Sydney, Australia</p>
              <p className="text-gray-400 mb-2">✉️ DriveWithBui@agentmail.to</p>
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