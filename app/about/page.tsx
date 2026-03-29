'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/Navbar'

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState('about')

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6" data-aos="fade-up">
              Meet Your Driving Instructor
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8" data-aos="fade-up" data-aos-delay="100">
              Professional, patient, and passionate about helping you become a confident, safe driver.
            </p>
          </div>
        </div>
      </section>

      {/* Tabs Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => setActiveTab('about')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${activeTab === 'about' ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
          >
            About Me
          </button>
          <button
            onClick={() => setActiveTab('approach')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${activeTab === 'approach' ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
          >
            My Approach
          </button>
          <button
            onClick={() => setActiveTab('coverage')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${activeTab === 'coverage' ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
          >
            Coverage Area
          </button>
          <button
            onClick={() => setActiveTab('car')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${activeTab === 'car' ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
          >
            The Car
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {activeTab === 'about' && (
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12" data-aos="fade-up">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold mb-6">Hi, I'm Bui</h2>
                <div className="space-y-4 text-gray-600">
                  <p>
                    With over 10 years of experience as a professional driving instructor, I've helped hundreds of students transform from nervous beginners into confident, skilled drivers.
                  </p>
                  <p>
                    My journey started when I realized how many people struggle with driving anxiety and lack of proper guidance. I made it my mission to create a learning environment that's supportive, patient, and effective.
                  </p>
                  <p>
                    What sets me apart is my focus on <strong>real-world driving skills</strong> rather than just test preparation. I believe in teaching you how to handle any situation on the road, not just pass a test.
                  </p>
                  <p>
                    When I'm not teaching, you'll find me exploring new driving routes, staying updated on road safety regulations, and continuously improving my teaching methods.
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="bg-gradient-to-br from-primary to-secondary rounded-2xl p-1">
                  <div className="bg-white rounded-xl p-4">
                    <div className="aspect-square bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                      <div className="text-center p-8">
                        <div className="text-6xl mb-4">🚗</div>
                        <h3 className="text-2xl font-bold mb-2">10+ Years Experience</h3>
                        <p className="text-gray-600">Professional Driving Instructor</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              <div className="text-center p-6 bg-blue-50 rounded-xl">
                <div className="text-3xl font-bold text-primary mb-2">500+</div>
                <p className="text-gray-600">Students Taught</p>
              </div>
              <div className="text-center p-6 bg-green-50 rounded-xl">
                <div className="text-3xl font-bold text-green-600 mb-2">98%</div>
                <p className="text-gray-600">First-Time Pass Rate</p>
              </div>
              <div className="text-center p-6 bg-purple-50 rounded-xl">
                <div className="text-3xl font-bold text-purple-600 mb-2">10k+</div>
                <p className="text-gray-600">Lessons Completed</p>
              </div>
              <div className="text-center p-6 bg-orange-50 rounded-xl">
                <div className="text-3xl font-bold text-orange-600 mb-2">0</div>
                <p className="text-gray-600">Major Accidents</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'approach' && (
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12" data-aos="fade-up">
            <h2 className="text-4xl font-bold mb-8">My Teaching Philosophy</h2>
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
        )}

        {activeTab === 'coverage' && (
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12" data-aos="fade-up">
            <h2 className="text-4xl font-bold mb-8">Service Area</h2>
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <p className="text-gray-600 mb-6">
                  I provide driving lessons throughout Western Sydney and surrounding areas. Whether you're in the city suburbs or further out, I can come to you.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                    <span className="font-medium">Lidcombe & Surrounds</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="font-medium">Parramatta Area</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="font-medium">Bankstown Region</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span className="font-medium">Liverpool & Campbelltown</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span className="font-medium">Blacktown & Penrith</span>
                  </div>
                </div>
                <p className="mt-6 text-gray-600">
                  <strong>Note:</strong> I'm flexible with locations! If you're outside these areas, contact me to discuss options. Additional travel fees may apply for locations beyond 20km from Lidcombe.
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
                <div className="text-center">
                  <div className="text-6xl mb-4">📍</div>
                  <h3 className="text-2xl font-bold mb-2">Pickup Service</h3>
                  <p className="text-gray-600 mb-4">I offer convenient pickup from your home, school, or workplace within my service area.</p>
                  <div className="inline-block px-4 py-2 bg-primary text-white rounded-lg font-semibold">
                    Free Pickup Within Zone
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'car' && (
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12" data-aos="fade-up">
            <h2 className="text-4xl font-bold mb-8">The Training Vehicle</h2>
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-4">Modern, Safe & Reliable</h3>
                  <p className="text-gray-600">
                    I teach in a well-maintained, dual-controlled vehicle equipped with all the safety features you need to learn confidently.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-xl">🛡️</span>
                    </div>
                    <div>
                      <h4 className="font-bold">Dual Controls</h4>
                      <p className="text-sm text-gray-600">Instructor brake and clutch for added safety</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-xl">📱</span>
                    </div>
                    <div>
                      <h4 className="font-bold">Modern Features</h4>
                      <p className="text-sm text-gray-600">Reverse camera, parking sensors, Bluetooth</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <span className="text-xl">🔄</span>
                    </div>
                    <div>
                      <h4 className="font-bold">Automatic Transmission</h4>
                      <p className="text-sm text-gray-600">Easy to learn, focus on road skills</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <span className="text-xl">🧼</span>
                    </div>
                    <div>
                      <h4 className="font-bold">Clean & Sanitized</h4>
                      <p className="text-sm text-gray-600">Regularly cleaned for your comfort and safety</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8">
                <div className="text-center">
                  <div className="text-8xl mb-6">🚙</div>
                  <h3 className="text-2xl font-bold mb-2">Toyota Corolla</h3>
                  <p className="text-gray-600 mb-4">2023 Model • Automatic • Petrol</p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg">
                    <span className="text-green-600">✓</span>
                    <span className="font-medium">Full Comprehensive Insurance</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 text-center">
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
