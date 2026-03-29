'use client'

import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/Navbar'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-8">About Drive With Bui</h1>
        
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-8 items-center mb-8">
            <div className="relative w-48 h-48 rounded-full overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100 flex-shrink-0">
              <Image
                src="/images/mascot-hero.png"
                alt="Bui - Your Driving Instructor"
                fill
                className="object-contain p-4"
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Hi, I'm Bui!</h2>
              <p className="text-gray-600">
                Your friendly local driving instructor serving the Lidcombe area and surrounding suburbs. 
                I'm passionate about helping new drivers build confidence and develop safe driving skills that last a lifetime.
              </p>
            </div>
          </div>

          <h3 className="text-xl font-bold mb-4">Why I Started</h3>
          <p className="text-gray-600 mb-6">
            After seeing many international students and working holiday makers struggle with NSW road rules and driving culture, 
            I decided to focus on making driving lessons accessible, patient, and tailored to each student's needs. 
            Whether you're completely new to driving or just need to refine your skills, I'm here to help you succeed.
          </p>

          <h3 className="text-xl font-bold mb-4">My Approach</h3>
          <ul className="space-y-3 mb-6">
            <li className="flex items-start">
              <span className="text-primary font-bold mr-2">1.</span>
              <div>
                <strong>Patient & Understanding</strong> - Everyone learns at their own pace. No pressure, no judgment.
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-primary font-bold mr-2">2.</span>
              <div>
                <strong>Culture Aware</strong> - I understand the challenges of adapting to Australian roads when you're new here.
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-primary font-bold mr-2">3.</span>
              <div>
                <strong>Safety First</strong> - Defensive driving techniques and hazard awareness are built into every lesson.
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-primary font-bold mr-2">4.</span>
              <div>
                <strong>Flexible Scheduling</strong> - Early mornings, evenings, weekends - I work around your schedule.
              </div>
            </li>
          </ul>

          <h3 className="text-xl font-bold mb-4">Coverage Area</h3>
          <p className="text-gray-600 mb-6">
            I service Lidcombe and surrounding suburbs including Auburn, Strathfield, Homebush, Burwood, 
            Concord, Rhodes, and surrounding areas. Pickup and drop-off is included at no extra cost.
          </p>

          <div className="bg-blue-50 rounded-xl p-6 text-center">
            <h3 className="text-xl font-bold mb-2">Ready to Get Started?</h3>
            <p className="text-gray-600 mb-4">Book your first lesson today and start your journey to becoming a confident driver.</p>
            <Link href="/book" className="inline-block px-8 py-3 bg-primary text-white rounded-lg hover:bg-secondary transition font-semibold">
              Book a Lesson
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
