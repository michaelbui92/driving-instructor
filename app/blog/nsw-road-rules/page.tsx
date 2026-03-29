'use client'

import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function NSWRoadRulesArticle() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="mb-8">
          <Link href="/blog" className="inline-flex items-center gap-2 text-primary hover:underline mb-6">
            ← Back to Blog
          </Link>
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
            <span>📅 March 10, 2026</span>
            <span>•</span>
            <span>⏱️ 5 min read</span>
            <span>•</span>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Road Rules</span>
          </div>
        </div>

        <article className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <h1 className="text-4xl font-bold mb-6" data-aos="fade-up">Understanding NSW Road Rules: Common Mistakes to Avoid</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 text-lg mb-8" data-aos="fade-up" data-aos-delay="100">
              Many new drivers struggle with specific NSW road rules. As a driving instructor in Sydney, I've identified the most common mistakes students make during lessons and driving tests.
            </p>

            <div className="mb-10" data-aos="fade-up" data-aos-delay="200">
              <h2 className="text-2xl font-bold mb-4">1. Roundabout Rules (Most Common Error)</h2>
              <div className="bg-yellow-50 rounded-xl p-6 mb-6">
                <h3 className="text-xl font-bold mb-3">The Golden Rule: Give Way to Your RIGHT</h3>
                <p>At roundabouts, you must give way to all vehicles already in the roundabout AND any vehicle entering from your right.</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-red-50 rounded-xl p-5">
                  <h3 className="font-bold mb-2">❌ Common Mistakes:</h3>
                  <ul className="space-y-1">
                    <li>• Not signaling when exiting</li>
                    <li>• Changing lanes within roundabout</li>
                    <li>• Stopping when unnecessary</li>
                    <li>• Incorrect lane positioning</li>
                  </ul>
                </div>
                <div className="bg-green-50 rounded-xl p-5">
                  <h3 className="font-bold mb-2">✅ Correct Approach:</h3>
                  <ul className="space-y-1">
                    <li>• Signal left when exiting</li>
                    <li>• Choose correct lane before entering</li>
                    <li>• Maintain safe speed</li>
                    <li>• Check blind spots</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mb-10" data-aos="fade-up" data-aos-delay="300">
              <h2 className="text-2xl font-bold mb-4">2. School Zone Times & Speeds</h2>
              <div className="bg-blue-50 rounded-xl p-6 mb-6">
                <h3 className="text-xl font-bold mb-3">NSW School Zone Times:</h3>
                <ul className="space-y-2">
                  <li>• <strong>8:00–9:30 AM</strong> (mornings)</li>
                  <li>• <strong>2:30–4:00 PM</strong> (afternoons)</li>
                  <li>• School days only (check signs)</li>
                  <li>• <strong>40km/h limit</strong> during these times</li>
                </ul>
              </div>
              <p><strong>Tip:</strong> Many students fail tests for doing 50km/h in school zones. Always check for flashing lights and signs.</p>
            </div>

            <div className="mb-10" data-aos="fade-up" data-aos-delay="400">
              <h2 className="text-2xl font-bold mb-4">3. Merging & Lane Changing Rules</h2>
              
              <div className="space-y-6">
                <div className="bg-purple-50 rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-3">Zip Merging (When Lanes End)</h3>
                  <p>When two lanes become one, use the <strong>"zip merge"</strong> method:</p>
                  <ol className="mt-2 space-y-2">
                    <li>1. Use both lanes until the merge point</li>
                    <li>2. Take turns merging (like a zipper)</li>
                    <li>3. Don't merge early - it causes congestion</li>
                    <li>4. Be courteous and let one car in</li>
                  </ol>
                </div>

                <div className="bg-green-50 rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-3">Lane Changing Rules</h3>
                  <ul className="space-y-2">
                    <li>• <strong>Must signal for 5 seconds</strong> before changing</li>
                    <li>• Check mirrors AND blind spots</li>
                    <li>• Maintain safe gap (3-second rule)</li>
                    <li>• Don't cross solid white lines</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mb-10" data-aos="fade-up" data-aos-delay="500">
              <h2 className="text-2xl font-bold mb-4">4. Pedestrian Crossings & Right of Way</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-red-50 rounded-xl p-5">
                  <h3 className="font-bold mb-2">Pedestrian Priority:</h3>
                  <ul className="space-y-1">
                    <li>• <strong>Must stop</strong> at zebra crossings</li>
                    <li>• Give way when turning at intersections</li>
                    <li>• Watch for children near schools</li>
                    <li>• Elderly pedestrians need more time</li>
                  </ul>
                </div>
                <div className="bg-blue-50 rounded-xl p-5">
                  <h3 className="font-bold mb-2">Common Test Failures:</h3>
                  <ul className="space-y-1">
                    <li>• Not stopping completely</li>
                    <li>• Blocking the crossing</li>
                    <li>• Impatient behavior</li>
                    <li>• Not checking both sides</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mb-10" data-aos="fade-up" data-aos-delay="600">
              <h2 className="text-2xl font-bold mb-4">5. Speed Limits & Fines</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-3 text-left">Area Type</th>
                      <th className="border p-3 text-left">Default Limit</th>
                      <th className="border p-3 text-left">Common Mistakes</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border p-3">Residential streets</td>
                      <td className="border p-3">50km/h</td>
                      <td className="border p-3">Doing 60km/h in 50 zones</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border p-3">School zones</td>
                      <td className="border p-3">40km/h</td>
                      <td className="border p-3">Missing time restrictions</td>
                    </tr>
                    <tr>
                      <td className="border p-3">Shared zones</td>
                      <td className="border p-3">10km/h</td>
                      <td className="border p-3">Not slowing enough</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border p-3">Highways</td>
                      <td className="border p-3">110km/h</td>
                      <td className="border p-3">Speeding in bad weather</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-8 mt-12" data-aos="fade-up" data-aos-delay="700">
              <h2 className="text-2xl font-bold mb-4">Test Preparation Tips</h2>
              <div className="space-y-4">
                <p><strong>Practice with a purpose:</strong> Don't just drive - focus on specific skills each lesson.</p>
                <p><strong>Mock tests:</strong> Ask your instructor for practice tests in test routes.</p>
                <p><strong>Know the rules:</strong> Study the NSW Road User Handbook.</p>
                <p><strong>Stay calm:</strong> Nervousness causes rule forgetfulness.</p>
              </div>
            </div>
          </div>
        </article>

        <div className="mt-12 text-center">
          <Link
            href="/book"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-semibold rounded-xl hover:bg-secondary transition hover-lift"
          >
            🎯 Book a Lesson Focused on Road Rules
          </Link>
          <p className="mt-4 text-gray-600">
            Master NSW road rules with personalized instruction. Book your lesson today!
          </p>
        </div>
      </div>
    </div>
  )
}