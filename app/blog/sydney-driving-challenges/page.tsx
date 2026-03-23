import Navbar from '@/components/Navbar'
import Link from 'next/link'

export const metadata = {
  title: 'Common Sydney Driving Challenges & Practical Solutions | Driving Guide',
  description: 'Learn about common driving challenges in Sydney and practical solutions. From school zones to narrow streets, master Sydney roads with confidence.',
  keywords: 'Sydney driving challenges, Sydney roads, driving difficulties, school zones, narrow streets, driving safety',
  openGraph: {
    title: 'Common Sydney Driving Challenges & Practical Solutions',
    description: 'Learn about common driving challenges in Sydney and practical solutions.',
    type: 'article',
    publishedTime: '2026-03-23T00:00:00.000Z',
    authors: ['Drive With Bui'],
  },
}

export default function SydneyDrivingChallengesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <Link href="/" className="hover:text-blue-600">Home</Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/blog" className="hover:text-blue-600">Blog</Link>
            </li>
            <li>/</li>
            <li className="text-gray-900 font-medium">Sydney Driving Challenges</li>
          </ol>
        </nav>

        {/* Article Header */}
        <header className="mb-12">
          <div className="inline-block bg-orange-100 text-orange-800 text-sm font-semibold px-3 py-1 rounded-full mb-4">
            Practical Guide
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Common Sydney Driving Challenges & Practical Solutions
          </h1>
          <div className="flex items-center text-gray-600 mb-8">
            <span>March 23, 2026</span>
            <span className="mx-3">•</span>
            <span>5 min read</span>
            <span className="mx-3">•</span>
            <span>By Drive With Bui</span>
          </div>
        </header>

        {/* Featured Image */}
        <div className="mb-12 rounded-2xl overflow-hidden shadow-xl">
          <div className="bg-gradient-to-r from-orange-500 to-red-600 h-64 flex items-center justify-center">
            <div className="text-white text-center p-8">
              <div className="text-6xl mb-4">🏙️</div>
              <h2 className="text-2xl font-bold">Master Sydney Roads with Confidence</h2>
              <p className="text-orange-100 mt-2">Practical solutions for common driving challenges</p>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <article className="prose prose-lg max-w-none">
          <p className="lead text-xl text-gray-700 mb-8">
            Driving in Sydney presents unique challenges that can test even experienced drivers. From school zones to narrow streets, here's how to navigate common challenges with confidence.
          </p>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-8 rounded-r-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-2">💡 Pro Tip</h3>
            <p className="text-gray-700">The key to mastering these challenges is practice and patience. Start in quiet areas and gradually build up to busier locations.</p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-6">🏫 Challenge 1: School Zone Timing</h2>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
            <div className="flex items-start mb-4">
              <div className="text-3xl mr-4">⚠️</div>
              <div>
                <h3 className="text-lg font-bold mb-2">The Problem</h3>
                <p className="text-gray-700">
                  School zones across Sydney have flashing lights and 40km/h limits, but the times can vary between schools. Missing the signs can lead to speeding fines and safety risks for children.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="text-3xl mr-4">✅</div>
              <div>
                <h3 className="text-lg font-bold mb-2">The Solution</h3>
                <div className="bg-red-50 p-4 rounded-lg mb-4">
                  <h4 className="font-bold text-gray-900 mb-2">School Zone Times to Remember:</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>• <strong>8-9:30am</strong> - Morning drop-off times</li>
                    <li>• <strong>2:30-4pm</strong> - Afternoon pick-up times</li>
                    <li>• <strong>All school days</strong> - Watch for flashing lights</li>
                    <li>• <strong>School holidays</strong> - Normal speed limits apply</li>
                  </ul>
                </div>
                <p className="text-gray-700">
                  <strong>Safety Tip:</strong> If you see children or school uniforms nearby, assume it's school zone time even if lights aren't flashing. Always err on the side of caution.
                </p>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-6">🚗 Challenge 2: Narrow Residential Streets</h2>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
            <div className="flex items-start mb-4">
              <div className="text-3xl mr-4">⚠️</div>
              <div>
                <h3 className="text-lg font-bold mb-2">The Problem</h3>
                <p className="text-gray-700">
                  Many residential streets in Sydney are narrow with parked cars on both sides. Passing oncoming traffic requires careful judgment and sometimes reversing to find passing points.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="text-3xl mr-4">✅</div>
              <div>
                <h3 className="text-lg font-bold mb-2">The Solution</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">When Meeting Traffic:</h4>
                    <ol className="space-y-2 text-gray-700 text-sm">
                      <li>1. <strong>Slow down early</strong> - Reduce speed to walking pace</li>
                      <li>2. <strong>Look for gaps</strong> - Find spaces between parked cars</li>
                      <li>3. <strong>Communicate</strong> - Use eye contact or hand signals</li>
                      <li>4. <strong>Pass slowly</strong> - Leave plenty of space on both sides</li>
                    </ol>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">If You Need to Reverse:</h4>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li>• Choose the driver with most space behind them</li>
                      <li>• Reverse to the last passing point you saw</li>
                      <li>• Use your mirrors and check blind spots constantly</li>
                      <li>• Go slowly and be prepared to stop immediately</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-6">🌧️ Challenge 3: Wet Weather Driving</h2>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
            <div className="flex items-start mb-4">
              <div className="text-3xl mr-4">⚠️</div>
              <div>
                <h3 className="text-lg font-bold mb-2">The Problem</h3>
                <p className="text-gray-700">
                  Sydney's rainy weather reduces visibility and road grip. Many drivers don't adjust their driving enough for wet conditions, leading to increased stopping distances and aquaplaning risks.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="text-3xl mr-4">✅</div>
              <div>
                <h3 className="text-lg font-bold mb-2">The Solution</h3>
                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                  <h4 className="font-bold text-gray-900 mb-2">Wet Weather Safety Checklist:</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>• <strong>Double following distance</strong> - 4 seconds instead of 2</li>
                    <li>• <strong>Reduce speed</strong> - Especially on curves and hills</li>
                    <li>• <strong>Use headlights</strong> - Increase visibility to others</li>
                    <li>• <strong>Avoid sudden movements</strong> - Smooth steering and braking</li>
                    <li>• <strong>Check wipers and tyres</strong> - Ensure they're in good condition</li>
                  </ul>
                </div>
                <p className="text-gray-700">
                  <strong>Aquaplaning Tip:</strong> If you hit standing water and feel the steering go light, don't brake suddenly. Ease off the accelerator and steer straight until you regain traction.
                </p>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-6">🚦 Challenge 4: Busy Intersections</h2>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
            <div className="flex items-start mb-4">
              <div className="text-3xl mr-4">⚠️</div>
              <div>
                <h3 className="text-lg font-bold mb-2">The Problem</h3>
                <p className="text-gray-700">
                  Busy intersections with multiple lanes, turning arrows, and pedestrian crossings can overwhelm new drivers. Knowing which lane to choose and when to move can be confusing.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="text-3xl mr-4">✅</div>
              <div>
                <h3 className="text-lg font-bold mb-2">The Solution</h3>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-bold text-gray-900 mb-2">Before the Intersection:</h4>
                    <ul className="space-y-1 text-gray-700 text-sm">
                      <li>• Check lane markings well in advance</li>
                      <li>• Signal early to indicate your intention</li>
                      <li>• Position in correct lane for your turn</li>
                      <li>• Reduce speed as you approach</li>
                    </ul>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-bold text-gray-900 mb-2">At the Intersection:</h4>
                    <ul className="space-y-1 text-gray-700 text-sm">
                      <li>• Look left, right, then left again</li>
                      <li>• Watch for pedestrians crossing</li>
                      <li>• Obey traffic lights and arrows</li>
                      <li>• Only proceed when it's safe</li>
                    </ul>
                  </div>
                </div>
                <p className="text-gray-700">
                  <strong>Practice Tip:</strong> Try practicing intersections during quieter times (Sunday mornings) to build confidence before tackling peak hour traffic.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-100 to-red-100 p-8 rounded-2xl mt-12">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Ready to Practice These Challenges?</h3>
                <p className="text-gray-700">
                  The best way to master these situations is with guided practice in a safe, supportive environment.
                </p>
              </div>
              <Link
                href="/book"
                className="mt-4 md:mt-0 inline-block bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition"
              >
                Book a Practice Lesson
              </Link>
            </div>
          </div>

          <div className="mt-10 p-6 bg-gray-50 rounded-xl">
            <h3 className="text-xl font-bold text-gray-900 mb-4">📝 Weekly Practice Exercise</h3>
            <p className="text-gray-700 mb-4">
              Try focusing on one challenge each week during your regular driving:
            </p>
            <ol className="space-y-3 text-gray-700">
              <li><strong>Week 1:</strong> Practice school zone awareness and speed control</li>
              <li><strong>Week 2:</strong> Work on navigating narrow streets and passing parked cars</li>
              <li><strong>Week 3:</strong> Practice wet weather techniques (or simulate with slower speeds)</li>
              <li><strong>Week 4:</strong> Master busy intersections during off-peak times</li>
            </ol>
            <p className="text-gray-700 mt-4 text-sm">
              Remember: Progress takes time. Celebrate small improvements each week!
            </p>
          </div>
        </article>

        {/* Related Articles */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-6">More Helpful Driving Guides</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <Link href="/blog/quick-driving-tips" className="block p-4 bg-white rounded-lg border border-gray-200 hover:border-primary transition">
              <div className="text-sm text-blue-600 font-semibold mb-2">Essential Tips</div>
              <h4 className="font-bold text-gray-900 mb-2">Quick Driving Tips for Sydney</h4>
              <p className="text-gray-600 text-sm">Simple, actionable advice for safer driving</p>
            </Link>
            <Link href="/blog/first-driving-lesson" className="block p-4 bg-white rounded-lg border border-gray-200 hover:border-primary transition">
              <div className="text-sm text-green-600 font-semibold mb-2">Beginners Guide</div>
              <h4 className="font-bold text-gray-900 mb-2">Your First Driving Lesson</h4>
              <p className="text-gray-600 text-sm">What to expect and how to prepare</p>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}