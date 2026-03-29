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

      {/* Pricing Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16" id="pricing">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4" data-aos="fade-up">Simple, Transparent Pricing</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="100">
            No hidden fees. No pressure sales. Just quality driving lessons at fair prices.
          </p>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 border-4 border-primary" data-aos="fade-up" data-aos-delay="200">
              <div className="text-center">
                <span className="inline-block px-4 py-1 bg-primary text-white text-sm font-semibold rounded-full mb-4">Most Popular</span>
                <h3 className="text-2xl font-bold mb-2">Single Lesson</h3>
                <p className="text-gray-600 mb-4">60 minute lesson</p>
                <div className="text-5xl font-bold text-primary mb-4">$55</div>
                <p className="text-sm text-gray-500 mb-6">per lesson</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Professional instruction</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Pickup & drop-off included</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Learn essential driving skills</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Road rules & safety</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Parking techniques</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Build confidence</li>
              </ul>
              <Link href="/book" className="block w-full py-3 bg-primary text-white text-center rounded-lg hover:bg-secondary transition font-semibold">
                Book Now
              </Link>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-8" data-aos="fade-up" data-aos-delay="300">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">Casual Driving</h3>
                <p className="text-gray-600 mb-4">60 minute relaxed session</p>
                <div className="text-5xl font-bold text-gray-800 mb-4">$45</div>
                <p className="text-sm text-gray-500 mb-6">per session</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Keep skills up to date</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Practice without pressure</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Various road types</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Relaxed learning</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Test preparation</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Muscle memory building</li>
              </ul>
              <Link href="/book" className="block w-full py-3 border-2 border-primary text-primary text-center rounded-lg hover:bg-primary hover:text-white transition font-semibold">
                Book Now
              </Link>
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
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary">
        <div className="max-w-4xl mx-auto px-4 text-center" data-aos="fade-up">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Get Your NSW Licence?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Contact us to book your driving lessons
          </p>
          <Link
            href="/book"
            className="shimmer-btn inline-block bg-white text-primary px-8 py-3 rounded-lg text-lg hover:bg-gray-100 transition font-semibold"
          >
            Book Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">🚗 Drive With Bui</h3>
              <p className="text-gray-400">Patient, professional driving lessons for international students and working holiday makers in Sydney.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Contact</h3>
              <p className="text-gray-400 mb-2">📍 Lidcombe Area, Sydney NSW</p>
              <p className="text-gray-400 mb-2">✉️ drivewithbui@agentmail.to</p>
              <div className="flex items-center mb-2">
                <svg className="w-5 h-5 mr-2 text-pink-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z"/>
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
