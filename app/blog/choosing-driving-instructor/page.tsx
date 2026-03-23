import Navbar from '@/components/Navbar'
import Link from 'next/link'

export const metadata = {
  title: 'How to Choose the Right Driving Instructor in Sydney | Helpful Guide',
  description: 'Learn what to look for when selecting a driving instructor in Sydney. Find the right instructor for your learning style and goals.',
  keywords: 'choose driving instructor, Sydney driving instructor, find driving teacher, instructor selection, learning to drive Sydney',
  openGraph: {
    title: 'How to Choose the Right Driving Instructor in Sydney',
    description: 'Learn what to look for when selecting a driving instructor in Sydney.',
    type: 'article',
    publishedTime: '2026-03-23T00:00:00.000Z',
    authors: ['Drive With Bui'],
  },
}

export default function ChoosingDrivingInstructorPage() {
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
            <li className="text-gray-900 font-medium">Choosing a Driving Instructor</li>
          </ol>
        </nav>

        {/* Article Header */}
        <header className="mb-12">
          <div className="inline-block bg-teal-100 text-teal-800 text-sm font-semibold px-3 py-1 rounded-full mb-4">
            Helpful Advice
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            How to Choose the Right Driving Instructor in Sydney
          </h1>
          <div className="flex items-center text-gray-600 mb-8">
            <span>March 23, 2026</span>
            <span className="mx-3">•</span>
            <span>6 min read</span>
            <span className="mx-3">•</span>
            <span>By Drive With Bui</span>
          </div>
        </header>

        {/* Featured Image */}
        <div className="mb-12 rounded-2xl overflow-hidden shadow-xl">
          <div className="bg-gradient-to-r from-teal-500 to-blue-600 h-64 flex items-center justify-center">
            <div className="text-white text-center p-8">
              <div className="text-6xl mb-4">👨‍🏫</div>
              <h2 className="text-2xl font-bold">Find Your Perfect Instructor Match</h2>
              <p className="text-teal-100 mt-2">Key factors to consider for your driving journey</p>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <article className="prose prose-lg max-w-none">
          <p className="lead text-xl text-gray-700 mb-8">
            Choosing the right driving instructor can make all the difference in your learning experience. 
            A good instructor doesn't just teach you to drive—they build your confidence, adapt to your 
            learning style, and make you feel safe behind the wheel.
          </p>

          <div className="bg-teal-50 border-l-4 border-teal-400 p-6 mb-8 rounded-r-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-2">💡 Honest Advice</h3>
            <p className="text-gray-700">
              As an instructor myself, I believe transparency is key. Here's what really matters when choosing 
              someone to teach you this important life skill.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-6">1. Teaching Style & Personality Match</h2>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
            <div className="flex items-start mb-4">
              <div className="text-3xl mr-4">😊</div>
              <div>
                <h3 className="text-lg font-bold mb-2">The Most Important Factor</h3>
                <p className="text-gray-700">
                  You'll spend hours in close quarters with this person. Do their teaching style and 
                  personality match what you need?
                </p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Consider Your Learning Style:</h4>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• <strong>Visual learner?</strong> Look for instructors who use diagrams or demonstrations</li>
                  <li>• <strong>Hands-on learner?</strong> Find someone who lets you learn by doing</li>
                  <li>• <strong>Nervous driver?</strong> Seek out patient, calming instructors</li>
                  <li>• <strong>Fast learner?</strong> Find instructors who can challenge you appropriately</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Personality Types:</h4>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• <strong>Structured:</strong> Follows a clear lesson plan</li>
                  <li>• <strong>Flexible:</strong> Adapts to your needs each lesson</li>
                  <li>• <strong>Encouraging:</strong> Focuses on what you're doing right</li>
                  <li>• <strong>Direct:</strong> Gives clear, straightforward feedback</li>
                </ul>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-6">2. Experience & Qualifications</h2>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
            <div className="flex items-start mb-4">
              <div className="text-3xl mr-4">📜</div>
              <div>
                <h3 className="text-lg font-bold mb-2">What Really Matters</h3>
                <p className="text-gray-700">
                  While certifications are important, teaching experience and specialization often matter more.
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="text-2xl mr-3">🎯</div>
                <div>
                  <h4 className="font-bold text-gray-900">Specialization Areas</h4>
                  <p className="text-gray-700 text-sm">
                    Some instructors specialize in: nervous drivers, international students, test preparation, 
                    manual transmission, or specific age groups. Find one who matches your needs.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="text-2xl mr-3">🗺️</div>
                <div>
                  <h4 className="font-bold text-gray-900">Local Knowledge</h4>
                  <p className="text-gray-700 text-sm">
                    An instructor familiar with your area knows the best practice routes, common test routes, 
                    and local driving challenges.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="text-2xl mr-3">🚗</div>
                <div>
                  <h4 className="font-bold text-gray-900">Vehicle Condition</h4>
                  <p className="text-gray-700 text-sm">
                    The teaching vehicle should be clean, well-maintained, and equipped with dual controls 
                    for safety.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-6">3. Communication & Feedback Style</h2>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
            <div className="flex items-start mb-4">
              <div className="text-3xl mr-4">💬</div>
              <div>
                <h3 className="text-lg font-bold mb-2">How They Communicate Matters</h3>
                <p className="text-gray-700">
                  Good communication is essential for effective learning. Pay attention to how they explain 
                  concepts and provide feedback.
                </p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-bold text-gray-900 mb-2">Green Flags:</h4>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• Explains concepts in multiple ways</li>
                  <li>• Checks for understanding regularly</li>
                  <li>• Provides specific, actionable feedback</li>
                  <li>• Listens to your concerns and questions</li>
                  <li>• Encourages questions without judgment</li>
                </ul>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-bold text-gray-900 mb-2">Red Flags:</h4>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• Gets frustrated or impatient easily</li>
                  <li>• Uses confusing or technical jargon</li>
                  <li>• Doesn't explain why something is important</li>
                  <li>• Talks over you or doesn't listen</li>
                  <li>• Makes you feel stupid for mistakes</li>
                </ul>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-6">4. Practical Considerations</h2>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Logistics & Availability</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span><strong>Location:</strong> Are they based near you? Travel time adds up.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span><strong>Schedule:</strong> Do their available times match yours?</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span><strong>Lesson length:</strong> Standard is 60 minutes—is that right for you?</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span><strong>Cancellation policy:</strong> Is it reasonable and clear?</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Cost & Value</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">💰</span>
                    <span><strong>Price:</strong> Compare rates but remember—cheapest isn't always best value</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">📦</span>
                    <span><strong>Packages:</strong> Do they offer lesson packages that could save money?</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">🎁</span>
                    <span><strong>Inclusions:</strong> What's included? Pick-up/drop-off? Test preparation?</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">💳</span>
                    <span><strong>Payment options:</strong> Flexible payment methods available?</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-6">5. Trial Lesson & Questions to Ask</h2>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
            <div className="flex items-start mb-4">
              <div className="text-3xl mr-4">❓</div>
              <div>
                <h3 className="text-lg font-bold mb-2">Try Before You Commit</h3>
                <p className="text-gray-700">
                  Many instructors offer trial lessons or introductory sessions. This is your chance to 
                  experience their teaching style firsthand.
                </p>
              </div>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg mb-4">
              <h4 className="font-bold text-gray-900 mb-2">Questions to Ask During a Trial:</h4>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>• "How do you typically structure a lesson?"</li>
                <li>• "How do you handle students who make mistakes?"</li>
                <li>• "What's your approach with nervous drivers?"</li>
                <li>• "How do you track and communicate progress?"</li>
                <li>• "What areas do you specialize in teaching?"</li>
                <li>• "Can we practice in areas I'll actually drive in?"</li>
              </ul>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-bold text-gray-900 mb-2">During the Trial, Notice:</h4>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>• Do you feel comfortable asking questions?</li>
                <li>• Are explanations clear and understandable?</li>
                <li>• Do you feel safe and supported?</li>
                <li>• Is the pace right for your learning speed?</li>
                <li>• Do you come away feeling more confident?</li>
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-r from-teal-100 to-blue-100 p-8 rounded-2xl mt-12">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Ready to Find Your Instructor?</h3>
                <p className="text-gray-700">
                  Remember: The right instructor for someone else might not be the right instructor for you. 
                  Trust your instincts about what feels right for your learning journey.
                </p>
              </div>
              <div className="mt-4 md:mt-0 space-y-2">
                <Link
                  href="/about"
                  className="inline-block bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition"
                >
                  View My About Page
                </Link>
                <p className="text-sm text-gray-600 text-center md:text-left">
                  See if my teaching style might be right for you
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 p-6 bg-gray-50 rounded-xl">
            <h3 className="text-xl font-bold text-gray-900 mb-4">📝 Your Instructor Checklist</h3>
            <p className="text-gray-700 mb-4">
              Use this checklist when evaluating potential instructors:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Must-Haves:</h4>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Makes you feel comfortable and safe</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Communicates clearly and patiently</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Has experience with your specific needs</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Provides constructive, helpful feedback</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Nice-to-Haves:</h4>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">⭐</span>
                    <span>Local area knowledge</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">⭐</span>
                    <span>Flexible scheduling options</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">⭐</span>
                    <span>Modern, well-maintained vehicle</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">⭐</span>
                    <span>Progress tracking and feedback</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">⭐</span>
                    <span>Test preparation included</span>
                  </li>
                </ul>
              </div>
            </div>
            <p className="text-gray-700 mt-4 text-sm">
              <strong>Final thought:</strong> A good instructor-student relationship is a partnership. 
              You should feel like you're working together toward your driving goals.
            </p>
          </div>
        </article>

        {/* Related Articles */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-6">More Helpful Guides</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <Link href="/blog/first-driving-lesson" className="block p-4 bg-white rounded-lg border border-gray-200 hover:border-primary transition">
              <div className="text-sm text-green-600 font-semibold mb-2">Beginners Guide</div>
              <h4 className="font-bold text-gray-900 mb-2">Your First Driving Lesson</h4>
              <p className="text-gray-600 text-sm">What to expect and how to prepare</p>
            </Link>
            <Link href="/blog/sydney-driving-test-tips" className="block p-4 bg-white rounded-lg border border-gray-200 hover:border-primary transition">
              <div className="text-sm text-green-600 font-semibold mb-2">Test Preparation</div>
              <h4 className="font-bold text-gray-900 mb-2">Sydney Driving Test Tips</h4>
              <p className="text-gray-600 text-sm">Essential strategies to pass your test</p>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
