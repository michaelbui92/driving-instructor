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
          <div className="flex-1 relative" data-aos="fade-left">
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
