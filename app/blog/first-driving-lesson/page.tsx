import Navbar from '@/components/Navbar'
import Link from 'next/link'

export const metadata = {
  title: 'Your First Driving Lesson: What to Expect | Sydney Driving Instructor',
  description: 'Feeling nervous about your first driving lesson? Learn what to expect and how to prepare for a successful start to your driving journey in Sydney.',
  keywords: 'first driving lesson, Sydney driving instructor, beginner driving tips, what to expect driving lesson',
  openGraph: {
    title: 'Your First Driving Lesson: What to Expect',
    description: 'Feeling nervous about your first driving lesson? Learn what to expect and how to prepare.',
    type: 'article',
    publishedTime: '2026-03-15T00:00:00.000Z',
    authors: ['Sydney Driving Instructor'],
  },
}

export default function FirstDrivingLessonPage() {
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
            <li className="text-gray-900 font-medium">Your First Driving Lesson</li>
          </ol>
        </nav>

        {/* Article Header */}
        <header className="mb-12">
          <div className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full mb-4">
            Beginners Guide
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Your First Driving Lesson: What to Expect
          </h1>
          <div className="flex items-center text-gray-600 mb-8">
            <span>March 15, 2026</span>
            <span className="mx-3">•</span>
            <span>5 min read</span>
            <span className="mx-3">•</span>
            <span>By Sydney Driving Instructor</span>
          </div>
          
          {/* Featured Image Placeholder */}
          <div className="h-64 bg-gradient-to-r from-blue-400 to-blue-600 rounded-2xl mb-8 flex items-center justify-center">
            <span className="text-white text-xl font-bold">First Driving Lesson Guide</span>
          </div>
        </header>

        {/* Article Content */}
        <article className="prose prose-lg max-w-none">
          <p className="lead text-xl text-gray-700 mb-8">
            Feeling nervous about your first driving lesson is completely normal. Most students feel a mix of 
            excitement and anxiety. The good news? With proper preparation and knowing what to expect, 
            your first lesson can be a positive, confidence-building experience.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-6">Before Your Lesson</h2>
          
          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">What to Bring</h3>
          <ul className="space-y-3 mb-8">
            <li className="flex items-start">
              <svg className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span><strong>Learner's Permit:</strong> Your valid Ls license is mandatory</span>
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span><strong>Comfortable Shoes:</strong> Flat-soled shoes for better pedal control</span>
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span><strong>Glasses/Contacts:</strong> If you require vision correction for driving</span>
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span><strong>Water Bottle:</strong> Stay hydrated during your lesson</span>
            </li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Mental Preparation</h3>
          <p className="mb-4">
            Remember: Your instructor is there to help you, not judge you. They've taught hundreds of 
            beginners and know exactly how to make you feel comfortable. It's okay to make mistakes—that's 
            how we learn!
          </p>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 my-8 rounded-r-lg">
            <p className="text-blue-800 font-medium">
              <strong>Pro Tip:</strong> Get a good night's sleep before your lesson. Being well-rested 
              helps with concentration and reaction times.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-6">During Your Lesson</h2>
          
          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">The First 15 Minutes</h3>
          <p className="mb-4">
            Your instructor will typically start by introducing themselves and explaining how the lesson 
            will work. You'll discuss:
          </p>
          <ul className="space-y-2 mb-6">
            <li>• Your previous driving experience (if any)</li>
            <li>• Any specific concerns or goals you have</li>
            <li>• The vehicle's controls and safety features</li>
            <li>• What you'll be learning today</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">In the Car</h3>
          <p className="mb-4">
            For most first lessons, you'll start in a quiet, low-traffic area like an empty parking lot 
            or quiet residential street. Your instructor will guide you through:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h4 className="font-bold text-gray-900 mb-3">Basic Controls</h4>
              <ul className="space-y-2 text-gray-700">
                <li>• Adjusting seat and mirrors</li>
                <li>• Understanding pedals</li>
                <li>• Using indicators and lights</li>
                <li>• Basic dashboard controls</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h4 className="font-bold text-gray-900 mb-3">First Movements</h4>
              <ul className="space-y-2 text-gray-700">
                <li>• Starting and stopping smoothly</li>
                <li>• Steering control</li>
                <li>• Basic gear changes (if manual)</li>
                <li>• Simple maneuvers</li>
              </ul>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-6">Common First-Lesson Experiences</h2>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 my-8">
            <h3 className="text-lg font-bold text-yellow-800 mb-3">What Students Often Feel</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span><strong>Information overload:</strong> There's a lot to take in. Don't worry—it gets easier with practice.</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span><strong>Stiff movements:</strong> It's normal to be tense. You'll relax as you gain confidence.</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span><strong>Surprising achievement:</strong> Most students are amazed at what they can do by the end!</span>
              </li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-6">After Your Lesson</h2>
          
          <p className="mb-6">
            Your instructor will provide feedback on what you did well and areas to focus on next time. 
            They may also suggest:
          </p>
          
          <ul className="space-y-3 mb-8">
            <li className="flex items-start">
              <svg className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>When to book your next lesson</span>
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Practice exercises you can do with a supervising driver</span>
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Resources or materials to review before next time</span>
            </li>
          </ul>

          <div className="bg-green-50 border border-green-200 rounded-xl p-6 my-8">
            <h3 className="text-lg font-bold text-green-800 mb-3">Success Story</h3>
            <p className="text-green-700">
              "I was nervous to drive but I needed to drive to complete my rural work placement to achieve my 2nd year for working holiday. Thanks to Michael I learnt to drive in a few weeks and drove from Sydney to Victoria. The patient instruction gave me the confidence I needed for such a big journey." — A working holiday student
            </p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-6">Ready for Your First Lesson?</h2>
          
          <p className="mb-8">
            Remember, every expert driver was once a beginner. Your first lesson is just the start of an 
            exciting journey toward driving independence.
          </p>

          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white text-center mt-12">
            <h3 className="text-2xl font-bold mb-4">Book Your First Lesson Today</h3>
            <p className="mb-6 opacity-90">
              Take the first step toward becoming a confident, safe driver with professional instruction.
            </p>
            <Link
              href="/book"
              className="inline-flex items-center justify-center px-8 py-3 bg-white text-blue-700 font-bold rounded-lg hover:bg-gray-100 transition text-lg"
            >
              Book Now
            </Link>
          </div>
        </article>

        {/* Related Articles */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Related Articles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              href="/blog/sydney-driving-test-tips"
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition border border-gray-100"
            >
              <h4 className="text-lg font-bold text-gray-900 mb-2">Sydney Driving Test Tips</h4>
              <p className="text-gray-600 text-sm mb-3">Essential strategies to pass your driving test on the first attempt.</p>
              <span className="text-blue-600 font-medium text-sm">Read more →</span>
            </Link>
            <Link
              href="/blog/parallel-parking-made-easy"
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition border border-gray-100"
            >
              <h4 className="text-lg font-bold text-gray-900 mb-2">Parallel Parking Made Easy</h4>
              <p className="text-gray-600 text-sm mb-3">Step-by-step guide to mastering this challenging maneuver.</p>
              <span className="text-blue-600 font-medium text-sm">Read more →</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}