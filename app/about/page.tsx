'use client'

import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/Navbar'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-4xl font-bold mb-6" data-aos="fade-up">
              Meet Your Driving Instructor
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8" data-aos="fade-up" data-aos-delay="100">
              Professional, patient, and passionate about helping you become a confident, safe driver.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Introduction */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-12" data-aos="fade-up">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Hi, I'm Michael</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Your patient and professional driving instructor in the Lidcombe area. I specialize in creating a supportive, stress-free learning environment for international students and nervous drivers.
                </p>
                <p>
                  My teaching approach focuses on practical skills, safety awareness, and building your confidence step by step. Whether you're a complete beginner or just need to sharpen your skills, I'm here to guide you every step of the way.
                </p>
                <div className="flex flex-wrap gap-4 mt-6">
                  <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
                    <span className="text-green-600">✓</span>
                    <span className="font-medium">Fully Insured</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                    <span className="text-blue-600">✓</span>
                    <span className="font-medium">Licensed Instructor</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 border border-purple-200 rounded-lg">
                    <span className="text-purple-600">✓</span>
                    <span className="font-medium">Dual Control Vehicle</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-primary to-secondary rounded-2xl p-1 max-w-md mx-auto">
                <div className="bg-white rounded-xl overflow-hidden">
                  <Image
                    src="/images/student-portal-2.png"
                    alt="Student focused approach - Drive With Bui dashboard"
                    width={500}
                    height={300}
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Student-Focused Approach */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-12" data-aos="fade-up">
          <h2 className="text-3xl font-bold mb-8 text-center">Student-Focused Approach</h2>
          <div className="max-w-3xl mx-auto">
            <p className="text-lg text-gray-600 mb-8 text-center">
              I specialize in working with international students, nervous drivers, and those who need extra patience. My goal is to make you feel comfortable and confident behind the wheel.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Patient & Supportive</h3>
                    <p className="text-gray-600">I understand that everyone learns at their own pace. I create a stress-free environment where mistakes are opportunities to learn.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🛡️</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Safety First</h3>
                    <p className="text-gray-600">My primary goal is to teach defensive driving techniques that will keep you safe on the road for years to come.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">📚</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Structured Learning</h3>
                    <p className="text-gray-600">Each lesson builds upon the previous one, ensuring you develop skills progressively and confidently.</p>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🎓</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Real-World Focus</h3>
                    <p className="text-gray-600">I teach practical skills for everyday driving situations, not just test maneuvers.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">💬</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Clear Communication</h3>
                    <p className="text-gray-600">I explain concepts in simple terms and provide constructive feedback to help you improve.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Flexible Approach</h3>
                    <p className="text-gray-600">I adapt my teaching style to match your learning preferences and goals.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Service Area */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-12" data-aos="fade-up">
          <h2 className="text-3xl font-bold mb-8">Service Area</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <p className="text-gray-600 mb-6">
                I provide driving lessons within a 10km radius of Lidcombe. This focused service area ensures I can provide timely, reliable lessons while maintaining quality instruction.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                  <span className="font-medium">Lidcombe</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="font-medium">Auburn</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="font-medium">Homebush</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="font-medium">Strathfield</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="font-medium">Granville</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="font-medium">Olympic Park</span>
                </div>
              </div>
              <p className="mt-6 text-gray-600">
                <strong>Note:</strong> I'm focused on providing quality service within this 10km radius. If you're outside this area, contact me to discuss options. Additional travel fees may apply for locations beyond 10km from Lidcombe.
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
              <div className="text-center">
                <div className="text-6xl mb-4">📍</div>
                <h3 className="text-2xl font-bold mb-2">Pickup Service</h3>
                <p className="text-gray-600 mb-4">I offer convenient pickup from your home, school, or workplace within my service area.</p>
                <div className="inline-block px-4 py-2 bg-primary text-white rounded-lg font-semibold">
                  Free Pickup Within 10km
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* The Training Vehicle */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-12" data-aos="fade-up">
          <h2 className="text-3xl font-bold mb-8">The Training Vehicle</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-4">Modern, Safe & Reliable</h3>
                <p className="text-gray-600">
                  I teach in a reliable Toyota Corolla with dual brake controls. It's a comfortable, easy-to-drive car perfect for learning.
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">🛡️</span>
                  </div>
                  <div>
                    <h4 className="font-bold">Dual Brake</h4>
                    <p className="text-sm text-gray-600">Instructor brake for added safety and confidence</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">🔄</span>
                  </div>
                  <div>
                    <h4 className="font-bold">Automatic Transmission</h4>
                    <p className="text-sm text-gray-600">Easy to learn, focus on road skills rather than gear changes</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">🧼</span>
                  </div>
                  <div>
                    <h4 className="font-bold">Clean & Sanitized</h4>
                    <p className="text-sm text-gray-600">Regularly cleaned for your comfort and safety</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">🔧</span>
                  </div>
                  <div>
                    <h4 className="font-bold">Well-Maintained</h4>
                    <p className="text-sm text-gray-600">Regularly serviced and reliable for all lessons</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8">
              <div className="text-center">
                <div className="text-8xl mb-6">🚙</div>
                <h3 className="text-2xl font-bold mb-2">Toyota Corolla</h3>
                <p className="text-gray-600 mb-4">2012 Model • Automatic • Petrol</p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg">
                  <span className="text-green-600">✓</span>
                  <span className="font-medium">Full Comprehensive Insurance</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center" data-aos="fade-up">
          <Link
            href="/book"
            className="inline-block px-8 py-4 bg-primary text-white text-lg font-semibold rounded-xl hover:bg-secondary transition shadow-lg"
          >
            Book Your First Lesson
          </Link>
          <p className="mt-4 text-gray-600">
            Ready to start your driving journey? Book online in just 2 minutes.
          </p>
        </div>
      </div>
    </div>
  )
}
