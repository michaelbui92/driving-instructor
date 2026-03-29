'use client'

import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function DrivingTestPrepArticle() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="mb-8">
          <Link href="/blog" className="inline-flex items-center gap-2 text-primary hover:underline mb-6">
            ← Back to Blog
          </Link>
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
            <span>📅 February 28, 2026</span>
            <span>•</span>
            <span>⏱️ 6 min read</span>
            <span>•</span>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">Test Preparation</span>
          </div>
        </div>

        <article className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <h1 className="text-4xl font-bold mb-6" data-aos="fade-up">How to Prepare for Your Driving Test</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 text-lg mb-8" data-aos="fade-up" data-aos-delay="100">
              Nervous about your upcoming driving test? You're not alone. With proper preparation and the right mindset, you can approach your test with confidence. Here's my comprehensive guide based on years of helping students pass their NSW driving tests.
            </p>

            <div className="mb-10" data-aos="fade-up" data-aos-delay="200">
              <h2 className="text-2xl font-bold mb-4">1. Know What to Expect</h2>
              
              <div className="bg-blue-50 rounded-xl p-6 mb-6">
                <h3 className="text-xl font-bold mb-3">NSW Driving Test Structure:</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold mb-2">Test Duration:</h4>
                    <ul className="space-y-1">
                      <li>• Approximately 45 minutes</li>
                      <li>• Includes pre-drive checks</li>
                      <li>• Various road conditions</li>
                      <li>• Parking maneuvers</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold mb-2">What's Assessed:</h4>
                    <ul className="space-y-1">
                      <li>• Vehicle control</li>
                      <li>• Road rule knowledge</li>
                      <li>• Hazard perception</li>
                      <li>• Decision making</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-10" data-aos="fade-up" data-aos-delay="300">
              <h2 className="text-2xl font-bold mb-4">2. Common Reasons for Failing</h2>
              
              <div className="space-y-6">
                <div className="bg-red-50 rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-3">Immediate Failures (Critical Errors)</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-bold mb-2">Safety Errors:</h4>
                      <ul className="space-y-1">
                        <li>• Exceeding speed limit</li>
                        <li>• Failing to stop at stop sign</li>
                        <li>• Not giving way to pedestrians</li>
                        <li>• Dangerous lane change</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold mb-2">Control Errors:</h4>
                      <ul className="space-y-1">
                        <li>• Mounting kerb</li>
                        <li>• Stalling repeatedly</li>
                        <li>• Losing control of vehicle</li>
                        <li>• Causing other driver to brake</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-3">Common Non-Critical Errors</h3>
                  <p>You can make up to 15 non-critical errors before failing:</p>
                  <div className="mt-3 grid md:grid-cols-2 gap-4">
                    <div>
                      <ul className="space-y-1">
                        <li>• Hesitation at intersections</li>
                        <li>• Incorrect mirror checks</li>
                        <li>• Rough gear changes</li>
                        <li>• Poor positioning</li>
                      </ul>
                    </div>
                    <div>
                      <ul className="space-y-1">
                        <li>• Late signaling</li>
                        <li>• Incorrect speed for conditions</li>
                        <li>• Not checking blind spots</li>
                        <li>• Poor observation</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-10" data-aos="fade-up" data-aos-delay="400">
              <h2 className="text-2xl font-bold mb-4">3. 4-Week Preparation Plan</h2>
              
              <div className="space-y-6">
                <div className="bg-green-50 rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-3">Week 1: Foundation Skills</h3>
                  <ul className="space-y-2">
                    <li>• Practice all basic maneuvers</li>
                    <li>• Master mirror and blind spot checks</li>
                    <li>• Work on smooth acceleration/braking</li>
                    <li>• Practice in quiet areas first</li>
                  </ul>
                </div>

                <div className="bg-blue-50 rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-3">Week 2: Complex Skills</h3>
                  <ul className="space-y-2">
                    <li>• Practice test routes (ask your instructor)</li>
                    <li>• Master roundabouts and intersections</li>
                    <li>• Work on lane changing and merging</li>
                    <li>• Practice in busier traffic</li>
                  </ul>
                </div>

                <div className="bg-purple-50 rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-3">Week 3: Test Simulation</h3>
                  <ul className="space-y-2">
                    <li>• Mock tests with instructor</li>
                    <li>• Focus on weak areas</li>
                    <li>• Practice under test conditions</li>
                    <li>• Work on test anxiety</li>
                  </ul>
                </div>

                <div className="bg-yellow-50 rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-3">Week 4: Final Preparation</h3>
                  <ul className="space-y-2">
                    <li>• Light practice only</li>
                    <li>• Mental preparation</li>
                    <li>• Rest and relaxation</li>
                    <li>• Test day logistics</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mb-10" data-aos="fade-up" data-aos-delay="500">
              <h2 className="text-2xl font-bold mb-4">4. Test Day Checklist</h2>
              
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-bold mb-3">Before the Test:</h3>
                    <ul className="space-y-2">
                      <li>✅ Get a good night's sleep</li>
                      <li>✅ Eat a light, healthy meal</li>
                      <li>✅ Arrive 15 minutes early</li>
                      <li>✅ Bring required documents</li>
                      <li>✅ Use bathroom before test</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold mb-3">During the Test:</h3>
                    <ul className="space-y-2">
                      <li>✅ Breathe deeply and stay calm</li>
                      <li>✅ Verbalize your observations</li>
                      <li>✅ Don't rush - take your time</li>
                      <li>✅ Ask for clarification if needed</li>
                      <li>✅ Focus on safety above all</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-10" data-aos="fade-up" data-aos-delay="600">
              <h2 className="text-2xl font-bold mb-4">5. Mental Preparation Tips</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-xl p-5">
                  <h3 className="font-bold mb-2">Mindset Shifts:</h3>
                  <ul className="space-y-2">
                    <li>• It's a demonstration, not an exam</li>
                    <li>• You're showing skills you already have</li>
                    <li>• Everyone gets nervous - it's normal</li>
                    <li>• The tester wants you to pass safely</li>
                  </ul>
                </div>
                <div className="bg-gray-50 rounded-xl p-5">
                  <h3 className="font-bold mb-2">Anxiety Management:</h3>
                  <ul className="space-y-2">
                    <li>• Practice deep breathing</li>
                    <li>• Visualize success</li>
                    <li>• Focus on the driving, not the outcome</li>
                    <li>• Remember it's okay to retake if needed</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-8 mt-12" data-aos="fade-up" data-aos-delay="700">
              <h2 className="text-2xl font-bold mb-4">Remember: Preparation is Key</h2>
              <p className="mb-4">The students who pass their driving tests are usually the ones who have prepared thoroughly. They've practiced the skills, know what to expect, and approach the test with confidence rather than fear.</p>
              <p className="font-semibold">Your driving instructor is your best resource. Use their experience and knowledge to prepare effectively.</p>
            </div>
          </div>
        </article>

        <div className="mt-12 text-center">
          <Link
            href="/book"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-semibold rounded-xl hover:bg-secondary transition hover-lift"
          >
            🎯 Book a Test Preparation Lesson
          </Link>
          <p className="mt-4 text-gray-600">
            Get personalized coaching for your driving test. Book your preparation lesson today!
          </p>
        </div>
      </div>
    </div>
  )
}