'use client'

import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function NightDrivingArticle() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="mb-8">
          <Link href="/blog" className="inline-flex items-center gap-2 text-primary hover:underline mb-6">
            ← Back to Blog
          </Link>
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
            <span>📅 March 5, 2026</span>
            <span>•</span>
            <span>⏱️ 4 min read</span>
            <span>•</span>
            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">Safety</span>
          </div>
        </div>

        <article className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <h1 className="text-4xl font-bold mb-6" data-aos="fade-up">Night Driving Tips for New Drivers</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 text-lg mb-8" data-aos="fade-up" data-aos-delay="100">
              Driving at night requires extra caution and different skills than daytime driving. Reduced visibility, glare from headlights, and fatigue make night driving particularly challenging for new drivers.
            </p>

            <div className="mb-10" data-aos="fade-up" data-aos-delay="200">
              <h2 className="text-2xl font-bold mb-4">Why Night Driving is Different</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-xl p-5">
                  <h3 className="font-bold mb-2">Visibility Challenges:</h3>
                  <ul className="space-y-1">
                    <li>• Reduced depth perception</li>
                    <li>• Limited color recognition</li>
                    <li>• Glare from oncoming headlights</li>
                    <li>• Shadows and dark spots</li>
                  </ul>
                </div>
                <div className="bg-purple-50 rounded-xl p-5">
                  <h3 className="font-bold mb-2">Human Factors:</h3>
                  <ul className="space-y-1">
                    <li>• Fatigue affects reaction time</li>
                    <li>• More impaired drivers at night</li>
                    <li>• Wildlife activity increases</li>
                    <li>• Pedestrians harder to see</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mb-10" data-aos="fade-up" data-aos-delay="300">
              <h2 className="text-2xl font-bold mb-4">Essential Night Driving Skills</h2>
              
              <div className="space-y-6">
                <div className="bg-yellow-50 rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-3">1. Proper Headlight Use</h3>
                  <ul className="space-y-2">
                    <li>• <strong>Low beams</strong> in urban areas</li>
                    <li>• <strong>High beams</strong> on dark country roads</li>
                    <li>• <strong>Dimmer switch</strong> for dashboard lights</li>
                    <li>• <strong>Clean headlights</strong> regularly</li>
                  </ul>
                  <p className="mt-3 text-sm text-gray-600"><strong>Tip:</strong> Dim dashboard lights to reduce eye strain and improve night vision.</p>
                </div>

                <div className="bg-green-50 rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-3">2. Dealing with Glare</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-bold mb-2">Oncoming Headlights:</h4>
                      <ul className="space-y-1">
                        <li>• Look at right edge of road</li>
                        <li>• Don't stare at lights</li>
                        <li>• Use night mode on mirrors</li>
                        <li>• Keep windshield clean</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold mb-2">Following Vehicles:</h4>
                      <ul className="space-y-1">
                        <li>• Adjust rear-view mirror</li>
                        <li>• Increase following distance</li>
                        <li>• Signal early for turns</li>
                        <li>• Stay calm if tailgated</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-3">3. Speed & Following Distance</h3>
                  <p><strong>Golden Rule:</strong> Drive at a speed where you can stop within the distance you can see.</p>
                  <div className="mt-3 grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-bold mb-1">Daytime vs Nighttime:</h4>
                      <p className="text-sm">Increase following distance from 3 seconds to 4+ seconds at night.</p>
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">Speed Reduction:</h4>
                      <p className="text-sm">Reduce speed by 10-20km/h in poor visibility.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-10" data-aos="fade-up" data-aos-delay="400">
              <h2 className="text-2xl font-bold mb-4">Common Night Driving Hazards</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="font-bold mb-2">🦘 Wildlife</h3>
                    <p className="text-sm">Most active at dawn/dusk. Slow down in rural areas and use high beams when safe.</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="font-bold mb-2">🚶 Pedestrians</h3>
                    <p className="text-sm">Wear dark clothing. Be extra cautious near bars, restaurants, and public transport.</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="font-bold mb-2">🚗 Fatigued Drivers</h3>
                    <p className="text-sm">Watch for weaving, inconsistent speed, and delayed reactions from other drivers.</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="font-bold mb-2">🌧️ Weather Conditions</h3>
                    <p className="text-sm">Rain + night = double danger. Reduce speed significantly and increase following distance.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-10" data-aos="fade-up" data-aos-delay="500">
              <h2 className="text-2xl font-bold mb-4">Pre-Night Drive Checklist</h2>
              
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-bold mb-3">Vehicle Preparation:</h3>
                    <ul className="space-y-2">
                      <li>✅ Clean all windows (inside & out)</li>
                      <li>✅ Check headlights and taillights</li>
                      <li>✅ Top up windshield washer fluid</li>
                      <li>✅ Check tire pressure</li>
                      <li>✅ Clean mirrors</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold mb-3">Driver Preparation:</h3>
                    <ul className="space-y-2">
                      <li>✅ Get adequate rest</li>
                      <li>✅ Avoid alcohol completely</li>
                      <li>✅ Plan your route</li>
                      <li>✅ Allow extra travel time</li>
                      <li>✅ Take breaks if tired</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-8 mt-12" data-aos="fade-up" data-aos-delay="600">
              <h2 className="text-2xl font-bold mb-4">Practice Makes Confident</h2>
              <p className="mb-4">The best way to become comfortable with night driving is through gradual exposure. Start with short trips in familiar areas during early evening, then progress to longer drives in different conditions.</p>
              <p className="font-semibold">Remember: It's okay to avoid night driving until you feel ready. Your safety comes first.</p>
            </div>
          </div>
        </article>

        <div className="mt-12 text-center">
          <Link
            href="/book"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-semibold rounded-xl hover:bg-secondary transition hover-lift"
          >
            🌙 Book a Night Driving Lesson
          </Link>
          <p className="mt-4 text-gray-600">
            Build confidence with night driving under expert guidance. Book your lesson today!
          </p>
        </div>
      </div>
    </div>
  )
}