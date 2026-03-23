import Navbar from '@/components/Navbar'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Meet Your Driving Instructor
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Professional, patient, and passionate about teaching safe driving skills
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Left Column: Instructor Info */}
          <div className="space-y-8">
            {/* Bio Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About Me</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Hi, I'm Michael - your patient and professional driving instructor in the Lidcombe area. 
                  With years of experience helping international students and nervous drivers build confidence 
                  on Sydney roads, I specialize in creating a supportive, stress-free learning environment.
                </p>
                <p>
                  My teaching approach focuses on practical skills, safety awareness, and building your 
                  confidence step by step. Whether you're a complete beginner or just need to sharpen your 
                  skills, I'm here to guide you every step of the way.
                </p>
              </div>
              
              {/* Student-Focused Highlight */}
              <div className="bg-green-50 border-l-4 border-green-400 p-4 mt-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-700">
                      <strong>Student-Focused Approach:</strong> I specialize in working with international 
                      students, nervous drivers, and those who need extra patience. My goal is to make you 
                      feel comfortable and confident behind the wheel.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Experience Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Experience & Credentials</h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600">
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">2+ Years Teaching Experience</h3>
                    <p className="text-gray-600 mt-1">
                      Teaching students of all ages and skill levels
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-100 text-green-600">
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">15+ Years Driving Experience</h3>
                    <p className="text-gray-600 mt-1">
                      Extensive experience navigating Sydney roads and conditions
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Teaching Philosophy Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Teaching Philosophy</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  I believe everyone learns at their own pace. My approach is patient, encouraging, and 
                  tailored to your individual needs. Whether you're a complete beginner or need refresher 
                  lessons, I'll work with you to build skills and confidence in a judgment-free environment.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span><strong>Patient Approach:</strong> No question is too basic, no mistake is too small</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span><strong>Safety First:</strong> Building safe driving habits from day one</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span><strong>Confidence Building:</strong> Progressive lessons that build skills naturally</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span><strong>Real-World Focus:</strong> Practical skills for Sydney roads and conditions</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column: Vehicle, Service Area & CTA */}
          <div className="space-y-8">
            {/* Instructor Image Placeholder */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="relative w-full h-64 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">🚗</div>
                  <p className="text-gray-600">Your Instructor</p>
                </div>
              </div>
            </div>

            {/* Vehicle Info */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Training Vehicle</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="text-gray-700">Automatic transmission</span>
                </div>
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span className="text-gray-700">Dual controls for safety</span>
                </div>
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-700">Modern vehicle with safety features</span>
                </div>
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="text-gray-700">Full comprehensive insurance</span>
                </div>
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  <span className="text-gray-700">Air conditioning & comfort features</span>
                </div>
              </div>
            </div>

            {/* Service Area */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Service Area</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Primarily serving Lidcombe and surrounding Western Sydney suburbs. 
                  Flexible meeting locations available for your convenience.
                </p>
                <div className="mt-4">
                  <p className="font-semibold text-gray-900 mb-2">Areas covered:</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span>• Lidcombe</span>
                    <span>• Auburn</span>
                    <span>• Berala</span>
                    <span>• Regents Park</span>
                    <span>• Homebush</span>
                    <span>• Strathfield</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Card */}
            <div className="bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-lg p-8 text-white">
              <h2 className="text-2xl font-bold mb-4">Ready to Start?</h2>
              <p className="mb-6 opacity-90">
                Book your first lesson today and start your journey to becoming a confident driver.
              </p>
              <Link 
                href="/book"
                className="block w-full bg-white text-primary text-center py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Book a Lesson
              </Link>
              <Link 
                href="/contact"
                className="block w-full mt-3 border border-white text-white text-center py-3 rounded-lg font-semibold hover:bg-white/10 transition"
              >
                Contact Me
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}