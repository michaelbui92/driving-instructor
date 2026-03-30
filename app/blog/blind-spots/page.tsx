'use client'

import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function BlindSpotsArticle() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="mb-8">
          <Link href="/blog" className="inline-flex items-center gap-2 text-primary hover:underline mb-6">
            ← Back to Blog
          </Link>
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
            <span>📅 March 22, 2026</span>
            <span>•</span>
            <span>⏱️ 4 min read</span>
            <span>•</span>
            <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">Safety</span>
          </div>
        </div>

        <article className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <h1 className="text-4xl font-bold mb-6" data-aos="fade-up">Understanding Blind Spots: The Hidden Dangers</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 text-lg mb-8" data-aos="fade-up" data-aos-delay="100">
              Blind spots are the areas around your vehicle that you cannot see in your mirrors. Every year, thousands of accidents occur because drivers didn't check their blind spots before changing lanes or merging. Understanding and managing blind spots is crucial for safe driving.
            </p>

            <div className="mb-10" data-aos="fade-up" data-aos-delay="200">
              <h2 className="text-2xl font-bold mb-4">What Are Blind Spots?</h2>
              <p>Blind spots are areas that cannot be seen in your rearview or side mirrors. They exist because:</p>
              <ul className="space-y-2 mt-3">
                <li>🚗 Your car's roof pillars block your peripheral vision</li>
                <li>🚗 Mirrors have a limited field of view</li>
                <li>🚗 Your seating position affects what you can see</li>
                <li>🚗 Some areas are physically hidden by your vehicle's design</li>
              </ul>
              <div className="bg-yellow-50 rounded-xl p-4 mt-4">
                <p className="font-semibold text-yellow-800">⚠️ Important: Even with perfectly adjusted mirrors, blind spots always exist. This is why shoulder checks are essential!</p>
              </div>
            </div>

            <div className="mb-10" data-aos="fade-up" data-aos-delay="300">
              <h2 className="text-2xl font-bold mb-4">The Four Main Blind Spots</h2>
              
              <div className="space-y-6">
                <div className="bg-blue-50 rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-3">1. Rear Blind Spot</h3>
                  <p>Directly behind your car, especially in the corners. Large vehicles like SUVs and utes have significant rear blind spots.</p>
                  <p className="mt-2 font-semibold">Solution: Use rear parking sensors and cameras when available. Always reverse slowly.</p>
                </div>

                <div className="bg-green-50 rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-3">2. Left Rear Blind Spot</h3>
                  <p>Located to your left, behind the driver's door pillar. This is one of the most dangerous blind spots.</p>
                  <p className="mt-2 font-semibold">Solution: Always do a shoulder check — turn your head left to look past the pillar.</p>
                </div>

                <div className="bg-purple-50 rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-3">3. Right Rear Blind Spot</h3>
                  <p>Located to your right, behind the passenger door pillar. Often overlooked because we naturally check mirrors less on this side.</p>
                  <p className="mt-2 font-semibold">Solution: Make a conscious effort to check this blind spot, especially before right lane changes.</p>
                </div>

                <div className="bg-orange-50 rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-3">4. Front Corner Blind Spots</h3>
                  <p>The areas just ahead of your car at the corners. Can hide pedestrians, cyclists, or small vehicles.</p>
                  <p className="mt-2 font-semibold">Solution: Check corners before turning, especially in tight spaces or intersections.</p>
                </div>
              </div>
            </div>

            <div className="mb-10" data-aos="fade-up" data-aos-delay="400">
              <h2 className="text-2xl font-bold mb-4">How to Check Blind Spots Properly</h2>
              
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4">The Shoulder Check Technique:</h3>
                <ol className="space-y-3">
                  <li><strong>1. Signal first</strong> — Indicate your intention to change lanes</li>
                  <li><strong>2. Check mirrors</strong> — Look at rearview and side mirrors</li>
                  <li><strong>3. Quick glance</strong> — Turn your head to quickly scan the blind spot</li>
                  <li><strong>4. Back to road</strong> — Don't linger — return your focus forward</li>
                  <li><strong>5. Act only if clear</strong> — Proceed with the lane change only when safe</li>
                </ol>
              </div>
            </div>

            <div className="mb-10" data-aos="fade-up" data-aos-delay="500">
              <h2 className="text-2xl font-bold mb-4">Blind Spots with Different Vehicles</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-xl p-5">
                  <h3 className="font-bold mb-2">🚙 Sedans & Hatchbacks</h3>
                  <p className="text-gray-600">Smaller blind spots. Still require shoulder checks but easier to manage.</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-5">
                  <h3 className="font-bold mb-2">🚗 SUVs & 4WDs</h3>
                  <p className="text-gray-600">Larger rear blind spots. Higher seating position helps but thick pillars create bigger gaps.</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-5">
                  <h3 className="font-bold mb-2">🚚 Utes & Vans</h3>
                  <p className="text-gray-600">Huge rear blind spots. often have no rear window visibility. Use technology aids.</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-5">
                  <h3 className="font-bold mb-2">🚌 Trucks & Buses</h3>
                  <p className="text-gray-600">Massive blind spots on all sides. Never assume the driver can see you!</p>
                </div>
              </div>
            </div>

            <div className="mb-10" data-aos="fade-up" data-aos-delay="600">
              <h2 className="text-2xl font-bold mb-4">Technology That Helps</h2>
              <div className="bg-green-50 rounded-xl p-6">
                <ul className="space-y-3">
                  <li>📹 <strong>Blind spot monitors</strong> — Use sensors or cameras to alert you when vehicles are in blind spots</li>
                  <li>📹 <strong>Lane keeping assist</strong> — Can alert or correct if you drift without signaling</li>
                  <li>📹 <strong>Rear cross-traffic alert</strong> — Warns of vehicles approaching when reversing</li>
                  <li>📹 <strong>360° cameras</strong> — Give a bird's eye view of all around your vehicle</li>
                </ul>
                <p className="mt-4 font-semibold text-green-800">Remember: Technology assists, not replaces, good driving habits!</p>
              </div>
            </div>

            <div className="mb-10" data-aos="fade-up" data-aos-delay="700">
              <h2 className="text-2xl font-bold mb-4">Protecting Others from Your Blind Spots</h2>
              <p>Just as you have blind spots, other drivers do too. Here's how to stay out of their blind spots:</p>
              <ul className="space-y-2 mt-3">
                <li>🚫 <strong>Don't linger</strong> — If you need to pass, do it promptly</li>
                <li>🚫 <strong>Avoid tailgating</strong> — Stay back so the driver ahead can see you</li>
                <li>🚫 <strong>Use headlights</strong> — Makes you more visible, especially in poor conditions</li>
                <li>🚫 <strong>Be patient with trucks</strong> — If you can't see their mirrors, they can't see you</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-8 mt-12" data-aos="fade-up" data-aos-delay="800">
              <h2 className="text-2xl font-bold mb-4">The Bottom Line</h2>
              <p className="mb-4">Blind spots are a fact of life with any vehicle. No amount of mirror adjustment or technology can completely eliminate them.</p>
              <p className="font-semibold">The solution is simple: <strong>Always shoulder check before changing lanes or merging</strong>. It's a 2-second habit that could save your life — and the lives of others on the road.</p>
            </div>
          </div>
        </article>

        <div className="mt-12 text-center">
          <Link
            href="/book"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-semibold rounded-xl hover:bg-secondary transition hover-lift"
          >
            📅 Book a Lesson to Practice Blind Spot Checks
          </Link>
          <p className="mt-4 text-gray-600">
            Learn to manage blind spots confidently with professional instruction!
          </p>
        </div>
      </div>
    </div>
  )
}
