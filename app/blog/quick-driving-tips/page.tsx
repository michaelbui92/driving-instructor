import Navbar from '@/components/Navbar'
import Link from 'next/link'

export const metadata = {
  title: 'Quick Driving Tips for Sydney Roads | Essential Safety Advice',
  description: 'Essential quick driving tips for navigating Sydney roads safely. Learn simple techniques to improve your driving confidence and safety on busy Sydney streets.',
  keywords: 'quick driving tips, Sydney driving advice, road safety tips, defensive driving, Sydney roads',
  openGraph: {
    title: 'Quick Driving Tips for Sydney Roads',
    description: 'Essential quick driving tips for navigating Sydney roads safely.',
    type: 'article',
    publishedTime: '2026-03-23T00:00:00.000Z',
    authors: ['Drive With Bui'],
  },
}

export default function QuickDrivingTipsPage() {
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
            <li className="text-gray-900 font-medium">Quick Driving Tips</li>
          </ol>
        </nav>

        {/* Article Header */}
        <header className="mb-12">
          <div className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full mb-4">
            Essential Tips
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Quick Driving Tips for Sydney Roads
          </h1>
          <div className="flex items-center text-gray-600 mb-8">
            <span>March 23, 2026</span>
            <span className="mx-3">•</span>
            <span>4 min read</span>
            <span className="mx-3">•</span>
            <span>By Drive With Bui</span>
          </div>
        </header>

        {/* Featured Image */}
        <div className="mb-12 rounded-2xl overflow-hidden shadow-xl">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-64 flex items-center justify-center">
            <div className="text-white text-center p-8">
              <div className="text-6xl mb-4">🚗</div>
              <h2 className="text-2xl font-bold">Simple Tips for Safer Driving</h2>
              <p className="text-blue-100 mt-2">Easy-to-remember advice for Sydney drivers</p>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <article className="prose prose-lg max-w-none">
          <p className="lead text-xl text-gray-700 mb-8">
            Driving in Sydney doesn't have to be stressful. Here are quick, actionable tips you can use immediately to improve your driving confidence and safety.
          </p>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-8 rounded-r-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-2">💡 Pro Tip</h3>
            <p className="text-gray-700">These tips work best when practiced consistently. Pick 2-3 to focus on each week until they become habits.</p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-6">🚦 Traffic Light Tips</h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="text-3xl mb-4">🟡</div>
              <h3 className="text-lg font-bold mb-2">Yellow Light Rule</h3>
              <p className="text-gray-700">If you can stop safely when the light turns yellow, do so. Don't speed up to "beat the red" - it's dangerous and illegal in NSW.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="text-3xl mb-4">🚶</div>
              <h3 className="text-lg font-bold mb-2">Check for Pedestrians</h3>
              <p className="text-gray-700">Always check left and right for pedestrians before moving off at green lights, especially in busy areas like Lidcombe and Auburn.</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-6">🔄 Roundabout Mastery</h2>
          
          <div className="bg-blue-50 p-6 rounded-xl mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">The 3-Second Rule for Roundabouts</h3>
            <ol className="list-decimal pl-5 space-y-3 text-gray-700">
              <li><strong>Approach slowly</strong> - Reduce speed to 20-30km/h</li>
              <li><strong>Look right</strong> - Give way to all traffic from your right</li>
              <li><strong>Signal early</strong> - Indicate your exit before entering</li>
              <li><strong>Check blind spots</strong> - Especially when changing lanes within the roundabout</li>
              <li><strong>Exit smoothly</strong> - Maintain appropriate speed and cancel your signal</li>
            </ol>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-6">🌧️ Wet Weather Wisdom</h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="text-3xl mb-4">💧</div>
              <h3 className="text-lg font-bold mb-2">Double Following Distance</h3>
              <p className="text-gray-700">In wet conditions, maintain at least 4 seconds behind the car in front instead of the usual 2 seconds.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="text-3xl mb-4">🌊</div>
              <h3 className="text-lg font-bold mb-2">Avoid Aquaplaning</h3>
              <p className="text-gray-700">If you hit standing water, don't brake suddenly. Ease off the accelerator and steer straight until you regain traction.</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-6">🅿️ Parking Perfection</h2>
          
          <div className="bg-green-50 p-6 rounded-xl mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Parking Checklist</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span><strong>Check mirrors</strong> before slowing down</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span><strong>Signal early</strong> to warn other drivers</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span><strong>Position correctly</strong> - align with parking space</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span><strong>Check blind spots</strong> before turning</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span><strong>Go slow</strong> - better to adjust than rush</span>
              </li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-6">📱 Distraction Prevention</h2>
          
          <div className="bg-red-50 p-6 rounded-xl mb-10">
            <h3 className="text-xl font-bold text-gray-900 mb-4">The Phone Can Wait</h3>
            <p className="text-gray-700 mb-4">In NSW, it's illegal to hold your phone while driving, even when stopped at lights. Here's what to do instead:</p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl mb-2">📵</div>
                <p className="text-sm font-medium">Put phone in glove box</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">🎵</div>
                <p className="text-sm font-medium">Set playlist before driving</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">🗺️</div>
                <p className="text-sm font-medium">Enter destination first</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-100 to-indigo-100 p-8 rounded-2xl mt-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Practice?</h3>
            <p className="text-gray-700 mb-6">
              The best way to master these tips is with professional guidance. Book a lesson to practice in a safe, supportive environment.
            </p>
            <Link
              href="/book"
              className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-secondary transition"
            >
              Book a Practice Lesson
            </Link>
          </div>
        </article>

        {/* Related Articles */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-6">More Helpful Articles</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <Link href="/blog/sydney-driving-test-tips" className="block p-4 bg-white rounded-lg border border-gray-200 hover:border-primary transition">
              <div className="text-sm text-green-600 font-semibold mb-2">Test Preparation</div>
              <h4 className="font-bold text-gray-900 mb-2">Sydney Driving Test Tips</h4>
              <p className="text-gray-600 text-sm">Essential strategies to pass your NSW driving test</p>
            </Link>
            <Link href="/blog/parallel-parking-made-easy" className="block p-4 bg-white rounded-lg border border-gray-200 hover:border-primary transition">
              <div className="text-sm text-purple-600 font-semibold mb-2">Driving Skills</div>
              <h4 className="font-bold text-gray-900 mb-2">Parallel Parking Made Easy</h4>
              <p className="text-gray-600 text-sm">Step-by-step guide to perfect parallel parking</p>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}