import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-primary">🚗 Driving Instructor</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <Link href="#services" className="text-gray-700 hover:text-primary transition">Services</Link>
              <Link href="#pricing" className="text-gray-700 hover:text-primary transition">Pricing</Link>
              <Link href="#about" className="text-gray-700 hover:text-primary transition">About</Link>
              <Link href="#contact" className="text-gray-700 hover:text-primary transition">Contact</Link>
            </div>
            <Link
              href="/book"
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-secondary transition"
            >
              Book Now
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Get Your License With <span className="text-primary">Confidence</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Professional driving lessons tailored to your learning style. Learn to drive safely and pass your test the first time.
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

          {/* Test Preparation */}
          <div className="mt-12 bg-white rounded-xl shadow-lg p-8 text-center max-w-xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Test Preparation</h3>
            <div className="text-4xl font-bold text-accent mb-4">$50</div>
            <p className="text-gray-600 mb-6">90-minute intensive session focused on test-day success</p>
            <Link
              href="/book"
              className="inline-block bg-accent text-white px-8 py-3 rounded-lg hover:bg-orange-600 transition"
            >
              Book Test Prep
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-white py-16" id="about">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why Choose Us?</h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex items-start">
                <span className="text-3xl mr-4">✓</span>
                <div>
                  <h3 className="text-xl font-bold mb-2">Experienced Instructor</h3>
                  <p className="text-gray-600">Years of experience helping students pass their driving tests</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-3xl mr-4">✓</span>
                <div>
                  <h3 className="text-xl font-bold mb-2">Patient & Supportive</h3>
                  <p className="text-gray-600">Learn at your pace in a stress-free environment</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-3xl mr-4">✓</span>
                <div>
                  <h3 className="text-xl font-bold mb-2">High Pass Rate</h3>
                  <p className="text-gray-600">Our students consistently pass their driving tests</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-3xl mr-4">✓</span>
                <div>
                  <h3 className="text-xl font-bold mb-2">Flexible Scheduling</h3>
                  <p className="text-gray-600">Book lessons that fit your schedule</p>
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
            Book your first lesson today and start your journey to becoming a confident driver
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
              <h3 className="text-xl font-bold mb-4">Driving Instructor</h3>
              <p className="text-gray-400">Professional driving lessons for everyone</p>
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
              <p className="text-gray-400 mb-2">📞 (02) 1234-5678</p>
              <p className="text-gray-400">✉️ hello@drivinginstructor.com</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2026 Driving Instructor. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}