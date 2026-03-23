import Navbar from '@/components/Navbar'
import Link from 'next/link'

export const metadata = {
  title: 'Night Driving Safety Tips for Sydney | Essential Guide',
  description: 'Essential night driving safety tips for navigating Sydney roads after dark. Learn how to improve visibility, avoid glare, and stay safe when driving at night.',
  keywords: 'night driving tips, Sydney night driving, driving after dark, visibility tips, headlight use, night safety',
  openGraph: {
    title: 'Night Driving Safety Tips for Sydney',
    description: 'Essential night driving safety tips for navigating Sydney roads after dark.',
    type: 'article',
    publishedTime: '2026-03-23T00:00:00.000Z',
    authors: ['Drive With Bui'],
  },
}

export default function NightDrivingTipsPage() {
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
            <li className="text-gray-900 font-medium">Night Driving Tips</li>
          </ol>
        </nav>

        {/* Article Header */}
        <header className="mb-12">
          <div className="inline-block bg-indigo-100 text-indigo-800 text-sm font-semibold px-3 py-1 rounded-full mb-4">
            Safety Guide
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Night Driving Safety Tips for Sydney
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
          <div className="bg-gradient-to-r from-indigo-900 to-purple-800 h-64 flex items-center justify-center">
            <div className="text-white text-center p-8">
              <div className="text-6xl mb-4">🌙</div>
              <h2 className="text-2xl font-bold">Drive Safely After Dark</h2>
              <p className="text-indigo-200 mt-2">Essential tips for navigating Sydney roads at night</p>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <article className="prose prose-lg max-w-none">
          <p className="lead text-xl text-gray-700 mb-8">
            Driving at night presents unique challenges that require extra caution and preparation. With reduced visibility and increased fatigue risks, these tips will help you navigate Sydney roads safely after dark.
          </p>

          <div className="bg-indigo-50 border-l-4 border-indigo-400 p-6 mb-8 rounded-r-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-2">⚠️ Important Safety Note</h3>
            <p className="text-gray-700">Night driving requires 100% attention. If you feel tired, pull over safely and rest. It's better to arrive late than not at all.</p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-6">🔦 1. Optimize Your Visibility</h2>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Headlight Checklist</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Before Driving:</h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Clean all lights (headlights, taillights, indicators)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Check headlight alignment</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Test high and low beams</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Clean windshield inside and out</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2">While Driving:</h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">💡</span>
                    <span>Use low beams in well-lit areas</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">💡</span>
                    <span>Switch to high beams on dark roads</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">💡</span>
                    <span>Dim for oncoming traffic</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">💡</span>
                    <span>Use fog lights only in fog</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-6">👁️ 2. Manage Glare Effectively</h2>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
            <div className="flex items-start mb-4">
              <div className="text-3xl mr-4">😎</div>
              <div>
                <h3 className="text-lg font-bold mb-2">Dealing with Oncoming Headlights</h3>
                <p className="text-gray-700 mb-4">
                  Glare from oncoming traffic is one of the biggest night driving challenges. Here's how to handle it:
                </p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-bold text-gray-900 mb-2">Immediate Actions:</h4>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• Look slightly to the left of oncoming lights</li>
                  <li>• Use the left edge of the road as a guide</li>
                  <li>• Slow down if glare is severe</li>
                  <li>• Keep both hands on the wheel</li>
                </ul>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-bold text-gray-900 mb-2">Prevention:</h4>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• Keep windshield clean (reduces glare)</li>
                  <li>• Adjust rearview mirror to night setting</li>
                  <li>• Consider anti-glare glasses if needed</li>
                  <li>• Take regular breaks to rest eyes</li>
                </ul>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-6">🚗 3. Adjust Your Driving Technique</h2>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Night-Specific Adjustments</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="text-2xl mr-3">📏</div>
                <div>
                  <h4 className="font-bold text-gray-900">Increase Following Distance</h4>
                  <p className="text-gray-700">Maintain at least 4 seconds behind the car in front (double the daytime distance).</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="text-2xl mr-3">🐢</div>
                <div>
                  <h4 className="font-bold text-gray-900">Reduce Speed</h4>
                  <p className="text-gray-700">Drive slower than the speed limit in poorly lit areas. Your stopping distance increases at night.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="text-2xl mr-3">👀</div>
                <div>
                  <h4 className="font-bold text-gray-900">Scan More Frequently</h4>
                  <p className="text-gray-700">Move your eyes every 2 seconds. Check mirrors more often than during daytime.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="text-2xl mr-3">🎯</div>
                <div>
                  <h4 className="font-bold text-gray-900">Use Road Markings</h4>
                  <p className="text-gray-700">Follow reflective lane markers and cat's eyes. They're designed for night visibility.</p>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-6">🦘 4. Wildlife Awareness (Especially in Sydney)</h2>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
            <div className="flex items-start mb-4">
              <div className="text-3xl mr-4">⚠️</div>
              <div>
                <h3 className="text-lg font-bold mb-2">Increased Wildlife Activity at Night</h3>
                <p className="text-gray-700">
                  Many animals are more active at dawn and dusk. In Sydney areas, watch for:
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-3 bg-red-50 rounded-lg">
                <div className="text-2xl mb-1">🦘</div>
                <div className="text-sm font-semibold">Kangaroos</div>
                <div className="text-xs text-gray-600">Dawn/dusk near bushland</div>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <div className="text-2xl mb-1">🦊</div>
                <div className="text-sm font-semibold">Foxes</div>
                <div className="text-xs text-gray-600">Urban areas after dark</div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="text-2xl mb-1">🐈</div>
                <div className="text-sm font-semibold">Cats</div>
                <div className="text-xs text-gray-600">Residential streets</div>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl mb-1">🦉</div>
                <div className="text-sm font-semibold">Possums</div>
                <div className="text-xs text-gray-600">Trees near roads</div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-bold text-gray-900 mb-2">If You See Wildlife:</h4>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>• <strong>Don't swerve</strong> - Brake firmly in a straight line</li>
                <li>• <strong>Honk your horn</strong> - May scare animals away</li>
                <li>• <strong>Watch for more</strong> - Animals often travel in groups</li>
                <li>• <strong>Report injured animals</strong> - Call local wildlife rescue</li>
              </ul>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-6">😴 5. Combat Driver Fatigue</h2>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
            <div className="flex items-start mb-4">
              <div className="text-3xl mr-4">💤</div>
              <div>
                <h3 className="text-lg font-bold mb-2">Fatigue is More Dangerous at Night</h3>
                <p className="text-gray-700">
                  Your body's natural circadian rhythm makes you sleepier at night. Recognize the signs:
                </p>
              </div>
            </div>
            
            <div className="bg-red-50 p-4 rounded-lg mb-4">
              <h4 className="font-bold text-gray-900 mb-2">Warning Signs of Fatigue:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>• Yawning frequently</li>
                  <li>• Heavy eyelids</li>
                  <li>• Daydreaming</li>
                  <li>• Missing exits/turns</li>
                </ul>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>• Drifting between lanes</li>
                  <li>• Difficulty focusing</li>
                  <li>• Restlessness</li>
                  <li>• Slow reactions</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-bold text-gray-900 mb-2">Anti-Fatigue Strategies:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li><strong>Take breaks</strong> - Every 2 hours or 200km</li>
                  <li><strong>Share driving</strong> - If possible, take turns</li>
                  <li><strong>Stay hydrated</strong> - Drink water, avoid heavy meals</li>
                  <li><strong>Fresh air</strong> - Open a window slightly</li>
                </ul>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li><strong>Listen to music</strong> - Upbeat, engaging tunes</li>
                  <li><strong>Chew gum</strong> - Helps maintain alertness</li>
                  <li><strong>Cool temperature</strong> - Keep car slightly cool</li>
                  <li><strong>Plan ahead</strong> - Know rest stop locations</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-indigo-100 to-purple-100 p-8 rounded-2xl mt-12">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Want to Practice Night Driving?</h3>
                <p className="text-gray-700">
                  The best way to build night driving confidence is with guided practice in safe conditions.
                </p>
              </div>
              <Link
                href="/book"
                className="mt-4 md:mt-0 inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
              >
                Book a Night Practice Lesson
              </Link>
            </div>
          </div>

          <div className="mt-10 p-6 bg-gray-50 rounded-xl">
            <h3 className="text-xl font-bold text-gray-900 mb-4">📋 Night Driving Preparation Checklist</h3>
            <p className="text-gray-700 mb-4">Before any night drive, run through this quick checklist:</p>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Vehicle Check:</h4>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>All lights working (headlights, brake, indicators)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Windshield clean inside and out</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Mirrors clean and adjusted</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Tyres properly inflated</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Wiper blades in good condition</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Driver Preparation:</h4>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Well-rested before driving</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Route planned in advance</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Phone charged for emergencies</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Emergency kit in car</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Know rest stop locations</span>
                  </li>
                </ul>
              </div>
            </div>
            <p className="text-gray-700 mt-4 text-sm">
              Remember: If in doubt, don't drive. Your safety is more important than any schedule.
            </p>
          </div>
        </article>

        {/* Related Articles */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-6">More Safety Guides</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <Link href="/blog/quick-driving-tips" className="block p-4 bg-white rounded-lg border border-gray-200 hover:border-primary transition">
              <div className="text-sm text-blue-600 font-semibold mb-2">Essential Tips</div>
              <h4 className="font-bold text-gray-900 mb-2">Quick Driving Tips for Sydney</h4>
              <p className="text-gray-600 text-sm">Simple, actionable advice for safer driving</p>
            </Link>
            <Link href="/blog/sydney-driving-challenges" className="block p-4 bg-white rounded-lg border border-gray-200 hover:border-primary transition">
              <div className="text-sm text-orange-600 font-semibold mb-2">Practical Guide</div>
              <h4 className="font-bold text-gray-900 mb-2">Common Sydney Driving Challenges</h4>
              <p className="text-gray-600 text-sm">Solutions for school zones, narrow streets, and more</p>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
