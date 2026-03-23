import Navbar from '@/components/Navbar'
import Link from 'next/link'

export const metadata = {
  title: 'Sydney Driving Test Tips: Pass on Your First Attempt | Expert Guide',
  description: 'Essential tips and strategies to help you pass your Sydney driving test with confidence. Learn what examiners look for and how to avoid common mistakes.',
  keywords: 'Sydney driving test, pass driving test, NSW driving test tips, driving test preparation, Sydney driving instructor',
  openGraph: {
    title: 'Sydney Driving Test Tips: Pass on Your First Attempt',
    description: 'Essential tips and strategies to help you pass your Sydney driving test with confidence.',
    type: 'article',
    publishedTime: '2026-03-10T00:00:00.000Z',
    authors: ['Sydney Driving Instructor'],
  },
}

export default function SydneyDrivingTestTipsPage() {
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
            <li className="text-gray-900 font-medium">Sydney Driving Test Tips</li>
          </ol>
        </nav>

        {/* Article Header */}
        <header className="mb-12">
          <div className="inline-block bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full mb-4">
            Test Preparation
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Sydney Driving Test Tips: Pass on Your First Attempt
          </h1>
          <div className="flex items-center text-gray-600 mb-8">
            <span>March 10, 2026</span>
            <span className="mx-3">•</span>
            <span>7 min read</span>
            <span className="mx-3">•</span>
            <span>By Sydney Driving Instructor</span>
          </div>
          
          {/* Featured Image Placeholder */}
          <div className="h-64 bg-gradient-to-r from-green-400 to-green-600 rounded-2xl mb-8 flex items-center justify-center">
            <span className="text-white text-xl font-bold">Sydney Driving Test Guide</span>
          </div>
        </header>

        <article className="prose prose-lg max-w-none">
          <p className="lead text-xl text-gray-700 mb-8">
            The Sydney driving test can be nerve-wracking, but with proper preparation and knowing what 
            to expect, you can approach it with confidence. Based on my experience helping 100+ students 
            pass their tests, here are the essential tips you need to know.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-6">Before the Test: Preparation is Key</h2>
          
          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">1. Know the Test Route</h3>
          <p className="mb-4">
            While examiners can choose different routes, they typically follow common patterns around 
            the testing center. Practice driving in the area where your test will be conducted.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">2. Vehicle Check</h3>
          <p className="mb-4">
            Your test will be cancelled if your vehicle isn't roadworthy. Ensure all lights work, tyres have adequate tread, and you have all required documents.
          </p>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 my-8 rounded-r-lg">
            <p className="text-blue-800 font-medium">
              <strong>Pro Tip:</strong> Book a pre-test lesson with your instructor. They can simulate 
              the test conditions and provide last-minute feedback.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-6">During the Test: What Examiners Look For</h2>
          
          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">1. Observation Skills</h3>
          <p className="mb-4">
            This is the most common area where students lose points. Examiners want to see exaggerated head checks and regular mirror use.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">2. Speed Management</h3>
          <p className="mb-6">
            Maintain appropriate speed for conditions. Common mistakes include exceeding limits or driving too slowly.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-6">Maneuvers That Often Cause Issues</h2>
          
          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Reverse Parallel Parking</h3>
          <p className="mb-4">
            Complete within 2 minutes, don't mount the kerb, and finish within 300mm.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Three-Point Turn</h3>
          <p className="mb-6">
            Practice this maneuver in confined spaces to build confidence.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-6">Mental Preparation & Attitude</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Day Before</h3>
              <ul className="space-y-3">
                <li>• Get a good night's sleep</li>
                <li>• Review road rules</li>
                <li>• Pack all documents</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Test Day</h3>
              <ul className="space-y-3">
                <li>• Eat a light meal</li>
                <li>• Arrive 15 minutes early</li>
                <li>• Take deep breaths to calm nerves</li>
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-8 text-white text-center mt-12">
            <h3 className="text-2xl font-bold mb-4">Need Test Preparation Help?</h3>
            <p className="mb-6 opacity-90">
              Book a mock test session with an experienced instructor.
            </p>
            <Link
              href="/book"
              className="inline-flex items-center justify-center px-8 py-3 bg-white text-green-700 font-bold rounded-lg hover:bg-gray-100 transition text-lg"
            >
              Book Test Preparation
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
              href="/blog/parallel-parking-made-easy"
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition border border-gray-100"
            >
              <h4 className="text-lg font-bold text-gray-900 mb-2">Parallel Parking Made Easy</h4>
              <p className="text-gray-600 text-sm mb-3">Step-by-step guide to mastering parking.</p>
              <span className="text-blue-600 font-medium text-sm">Read more →</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}