'use client'

import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function MirrorChecksArticle() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="mb-8">
          <Link href="/blog" className="inline-flex items-center gap-2 text-primary hover:underline mb-6">
            ← Back to Blog
          </Link>
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
            <span>📅 March 15, 2026</span>
            <span>•</span>
            <span>⏱️ 4 min read</span>
            <span>•</span>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">Safety Tips</span>
          </div>
        </div>

        <article className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <h1 className="text-4xl font-bold mb-6" data-aos="fade-up">5 Essential Mirror Checks Every Driver Should Master</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 text-lg mb-8" data-aos="fade-up" data-aos-delay="100">
              Proper mirror checks are the foundation of safe driving. Many new drivers underestimate how important regular mirror checks are for situational awareness and accident prevention.
            </p>

            <div className="mb-10" data-aos="fade-up" data-aos-delay="200">
              <h2 className="text-2xl font-bold mb-4">Why Mirror Checks Matter</h2>
              <p>Mirror checks give you a 360-degree view of your surroundings without turning your head excessively. They help you:</p>
              <ul className="space-y-2 mt-3">
                <li>✅ Monitor traffic behind and beside you</li>
                <li>✅ Spot potential hazards early</li>
                <li>✅ Make safe lane changes and turns</li>
                <li>✅ Maintain safe following distances</li>
                <li>✅ Check for cyclists and motorcycles</li>
              </ul>
            </div>

            <div className="mb-10" data-aos="fade-up" data-aos-delay="300">
              <h2 className="text-2xl font-bold mb-4">The 5 Essential Mirror Checks</h2>
              
              <div className="space-y-8">
                <div className="bg-blue-50 rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-3">1. Before You Start Driving</h3>
                  <p>Adjust all three mirrors before you even start the engine. You should be able to see:</p>
                  <ul className="mt-2 space-y-1">
                    <li>• Rear-view mirror: Center of rear window</li>
                    <li>• Side mirrors: Slight view of your car's side + road behind</li>
                    <li>• Blind spots: Minimized through proper adjustment</li>
                  </ul>
                </div>

                <div className="bg-green-50 rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-3">2. Before Changing Lanes</h3>
                  <p>Use the <strong>SMS method</strong>: Signal → Mirror → Shoulder check</p>
                  <ol className="mt-2 space-y-2">
                    <li>1. Signal your intention first</li>
                    <li>2. Check rear-view and side mirrors</li>
                    <li>3. Quick shoulder check for blind spots</li>
                    <li>4. Only change lanes if clear</li>
                  </ol>
                </div>

                <div className="bg-purple-50 rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-3">3. Before Braking</h3>
                  <p>Always check your mirrors before slowing down or stopping:</p>
                  <ul className="mt-2 space-y-1">
                    <li>• Check for tailgaters behind you</li>
                    <li>• Give following vehicles warning</li>
                    <li>• Tap brakes early to alert others</li>
                  </ul>
                </div>

                <div className="bg-yellow-50 rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-3">4. Every 5-8 Seconds</h3>
                  <p>Develop the habit of checking mirrors regularly, not just when changing lanes:</p>
                  <ul className="mt-2 space-y-1">
                    <li>• Scan all three mirrors in sequence</li>
                    <li>• Be aware of traffic patterns</li>
                    <li>• Spot emergency vehicles early</li>
                  </ul>
                </div>

                <div className="bg-red-50 rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-3">5. Before Turning at Intersections</h3>
                  <p>Check mirrors before making any turn:</p>
                  <ul className="mt-2 space-y-1">
                    <li>• Look for cyclists in blind spots</li>
                    <li>• Check for pedestrians crossing</li>
                    <li>• Be aware of vehicles turning with you</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mb-10" data-aos="fade-up" data-aos-delay="400">
              <h2 className="text-2xl font-bold mb-4">Common Mistakes to Avoid</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-xl p-5">
                  <h3 className="font-bold mb-2">❌ Staring at Mirrors</h3>
                  <p className="text-gray-600">Quick glances only. Your main focus should be ahead.</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-5">
                  <h3 className="font-bold mb-2">❌ Relying Only on Mirrors</h3>
                  <p className="text-gray-600">Always do shoulder checks for blind spots.</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-5">
                  <h3 className="font-bold mb-2">❌ Improper Adjustment</h3>
                  <p className="text-gray-600">Mirrors should show road, not your own car.</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-5">
                  <h3 className="font-bold mb-2">❌ Forgetting to Check</h3>
                  <p className="text-gray-600">Make mirror checks a consistent habit.</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 mt-12" data-aos="fade-up" data-aos-delay="500">
              <h2 className="text-2xl font-bold mb-4">Practice Makes Perfect</h2>
              <p className="mb-4">The best way to master mirror checks is through consistent practice. During your driving lessons, I'll help you develop these essential habits.</p>
              <p className="font-semibold">Remember: Good mirror habits become automatic with practice and could save you from accidents.</p>
            </div>
          </div>
        </article>

        <div className="mt-12 text-center">
          <Link
            href="/book"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-semibold rounded-xl hover:bg-secondary transition hover-lift"
          >
            📅 Book a Lesson to Practice Mirror Checks
          </Link>
          <p className="mt-4 text-gray-600">
            Ready to master these essential driving skills? Book a lesson today!
          </p>
        </div>
      </div>
    </div>
  )
}