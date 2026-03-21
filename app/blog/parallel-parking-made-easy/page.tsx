import Navbar from '@/components/Navbar'
import Link from 'next/link'

export const metadata = {
  title: 'Parallel Parking Made Easy: Step-by-Step Guide | Sydney Driving Tips',
  description: 'Master the art of parallel parking with our simple, step-by-step guide. Learn techniques to park perfectly every time, even in tight Sydney spaces.',
  keywords: 'parallel parking, how to parallel park, parking tips, driving skills, Sydney parking',
  openGraph: {
    title: 'Parallel Parking Made Easy: Step-by-Step Guide',
    description: 'Master the art of parallel parking with our simple, step-by-step guide.',
    type: 'article',
    publishedTime: '2026-03-05T00:00:00.000Z',
    authors: ['Sydney Driving Instructor'],
  },
}

export default function ParallelParkingPage() {
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
            <li className="text-gray-900 font-medium">Parallel Parking Made Easy</li>
          </ol>
        </nav>

        {/* Article Header */}
        <header className="mb-12">
          <div className="inline-block bg-purple-100 text-purple-800 text-sm font-semibold px-3 py-1 rounded-full mb-4">
            Driving Skills
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Parallel Parking Made Easy: Step-by-Step Guide
          </h1>
          <div className="flex items-center text-gray-600 mb-8">
            <span>March 5, 2026</span>
            <span className="mx-3">•</span>
            <span>6 min read</span>
            <span className="mx-3">•</span>
            <span>By Sydney Driving Instructor</span>
          </div>
          
          {/* Featured Image Placeholder */}
          <div className="h-64 bg-gradient-to-r from-purple-400 to-purple-600 rounded-2xl mb-8 flex items-center justify-center">
            <span className="text-white text-xl font-bold">Parallel Parking Guide</span>
          </div>
        </header>

        <article className="prose prose-lg max-w-none">
          <p className="lead text-xl text-gray-700 mb-8">
            Parallel parking is one of the most feared driving maneuvers, but it doesn't have to be. 
            With the right technique and practice, you can park perfectly even in tight Sydney spaces. 
            This step-by-step guide breaks down the process into simple, manageable steps.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-6">Before You Start: The Basics</h2>
          
          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Finding the Right Space</h3>
          <p className="mb-4">
            Look for a space that's at least 1.5 times the length of your car. As you gain experience, 
            you'll be able to park in tighter spaces.
          </p>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 my-8 rounded-r-lg">
            <p className="text-blue-800 font-medium">
              <strong>Pro Tip:</strong> Practice in an empty parking lot with cones before trying on 
              real streets. This builds confidence without pressure.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-6">Step-by-Step Parallel Parking</h2>
          
          <div className="space-y-12 my-8">
            {/* Step 1 */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 text-blue-800 text-lg font-bold w-10 h-10 rounded-full flex items-center justify-center mr-4">
                  1
                </div>
                <h3 className="text-xl font-bold text-gray-900">Position Your Car</h3>
              </div>
              <ul className="space-y-3 text-gray-700">
                <li>• Signal left to indicate you're parking</li>
                <li>• Pull up parallel to the car in front of the space, about 0.5-1 meter away</li>
                <li>• Align your rear bumper with theirs</li>
                <li>• Check mirrors and blind spot for traffic</li>
              </ul>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 text-blue-800 text-lg font-bold w-10 h-10 rounded-full flex items-center justify-center mr-4">
                  2
                </div>
                <h3 className="text-xl font-bold text-gray-900">Begin Reversing</h3>
              </div>
              <ul className="space-y-3 text-gray-700">
                <li>• Shift into reverse</li>
                <li>• Check all around for traffic and pedestrians</li>
                <li>• Begin reversing slowly while turning steering wheel fully left</li>
                <li>• Stop when you see the rear of the front car in your front passenger window</li>
              </ul>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 text-blue-800 text-lg font-bold w-10 h-10 rounded-full flex items-center justify-center mr-4">
                  3
                </div>
                <h3 className="text-xl font-bold text-gray-900">Straighten the Wheel</h3>
              </div>
              <ul className="space-y-3 text-gray-700">
                <li>• Straighten your steering wheel</li>
                <li>• Continue reversing straight back</li>
                <li>• Stop when your front bumper clears the rear car's bumper</li>
                <li>• You should now be at a 45-degree angle to the kerb</li>
              </ul>
            </div>

            {/* Step 4 */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 text-blue-800 text-lg font-bold w-10 h-10 rounded-full flex items-center justify-center mr-4">
                  4
                </div>
                <h3 className="text-xl font-bold text-gray-900">Complete the Park</h3>
              </div>
              <ul className="space-y-3 text-gray-700">
                <li>• Turn steering wheel fully right</li>
                <li>• Continue reversing slowly</li>
                <li>• Stop when you're parallel to the kerb and centered in the space</li>
                <li>• Straighten wheels and shift to park (or first gear for manual)</li>
              </ul>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-6">Common Mistakes & How to Fix Them</h2>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 my-8">
            <h3 className="text-lg font-bold text-yellow-800 mb-4">Troubleshooting Guide</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-yellow-800 mb-2">Too far from kerb</h4>
                <p className="text-yellow-700 text-sm">
                  <strong>Solution:</strong> Start your turn earlier or use more steering lock. 
                  Practice judging distances from reference points.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-yellow-800 mb-2">Mounted the kerb</h4>
                <p className="text-yellow-700 text-sm">
                  <strong>Solution:</strong> You're turning too sharply. Use less steering input 
                  and go slower. Remember: slow and smooth wins the race.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-yellow-800 mb-2">Not centered in space</h4>
                <p className="text-yellow-700 text-sm">
                  <strong>Solution:</strong> Adjust forward or backward as needed. Small adjustments 
                  are better than trying to perfect it in one go.
                </p>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-6">Practice Exercises</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-lg font-bold text-gray-900 mb-4">With Cones</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Set up two cones 1.5 car lengths apart</li>
                <li>• Practice without time pressure</li>
                <li>• Focus on smooth movements</li>
                <li>• Gradually reduce space between cones</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-lg font-bold text-gray-900 mb-4">On Quiet Streets</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Choose wide, quiet residential streets</li>
                <li>• Practice during off-peak hours</li>
                <li>• Use larger spaces initially</li>
                <li>• Gradually move to tighter spaces</li>
              </ul>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-6 my-8">
            <h3 className="text-lg font-bold text-green-800 mb-3">Student Success Story</h3>
            <p className="text-green-700">
              "I avoided parallel parking for years because it terrified me. My instructor broke it down 
              into these simple steps and had me practice with cones. Now I can parallel park anywhere 
              in Sydney with confidence!" — Emma, Lidcombe
            </p>
          </div>

          <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl p-8 text-white text-center mt-12">
            <h3 className="text-2xl font-bold mb-4">Master Parallel Parking</h3>
            <p className="mb-6 opacity-90">
              Get personalized instruction and practice with an experienced driving instructor.
            </p>
            <Link
              href="/book"
              className="inline-flex items-center justify-center px-8 py-3 bg-white text-purple-700 font-bold rounded-lg hover:bg-gray-100 transition text-lg"
            >
              Book a Parking Lesson
            </Link>
          </div>
        </article>

        {/* Related Articles */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Related Articles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              href="/blog/first-driving-lesson"
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition border border-gray-100"
            >
              <h4 className="text-lg font-bold text-gray-900 mb-2">Your First Driving Lesson</h4>
              <p className="text-gray-600 text-sm mb-3">What to expect and how to prepare.</p>
              <span className="text-blue-600 font-medium text-sm">Read more →</span>
            </Link>
            <Link
              href="/blog/sydney-driving-test-tips"
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition border border-gray-100"
            >
              <h4 className="text-lg font-bold text-gray-900 mb-2">Sydney Driving Test Tips</h4>
              <p className="text-gray-600 text-sm mb-3">Essential strategies to pass your test.</p>
              <span className="text-blue-600 font-medium text-sm">Read more →</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}