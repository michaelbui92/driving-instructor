'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

type FAQItem = {
  question: string
  answer: string
  category: string
}

const faqData: FAQItem[] = [
  {
    question: "What should I bring to my first lesson?",
    answer: "For your first lesson, please bring your learner's permit (L plates), any glasses or contact lenses if required for driving, comfortable shoes, and a positive attitude! If you have a logbook, bring that too.",
    category: "Getting Started"
  },
  {
    question: "What is your cancellation policy?",
    answer: "We require at least 24 hours notice for cancellations. Cancellations with less than 24 hours notice may incur a 50% fee. No-shows will be charged the full lesson fee. We understand emergencies happen - just give us a call as soon as possible.",
    category: "Policies"
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept cash, bank transfer, and credit/debit cards. Payment is due at the time of booking or at the beginning of each lesson. For package deals, payment is required upfront.",
    category: "Policies"
  },
  {
    question: "What areas do you service?",
    answer: "We primarily serve the Lidcombe area and surrounding suburbs in Western Sydney. This includes Auburn, Berala, Regents Park, and nearby locations. If you're outside this area, please contact us to discuss availability.",
    category: "Service Area"
  },
  {
    question: "How long are the driving lessons?",
    answer: "All lessons are 60 minutes of actual driving time. We believe in quality over quantity - you get the full hour of focused instruction, not just time spent driving to and from locations.",
    category: "Lessons"
  },
  {
    question: "Do you provide the car for lessons?",
    answer: "Yes! We provide a modern, dual-controlled vehicle that's fully insured for driving lessons. You don't need to bring your own car.",
    category: "Lessons"
  },
  {
    question: "I'm an international student - can I get driving lessons?",
    answer: "Absolutely! We specialize in helping international students and working holiday makers get their NSW licence. We understand the specific requirements and can guide you through the entire process.",
    category: "Getting Started"
  },
  {
    question: "How many lessons will I need to pass my test?",
    answer: "This varies depending on your previous experience and how quickly you learn. Most students need 10-20 hours of professional instruction in addition to any practice they do outside lessons. We'll assess your skills and give you a realistic estimate.",
    category: "Lessons"
  },
  {
    question: "Can I use your car for my driving test?",
    answer: "Yes, you can use our car for your driving test. We charge a test package fee that includes use of the car, a pre-test warm-up lesson, and waiting during your test.",
    category: "Driving Test"
  },
  {
    question: "What if I'm nervous about driving?",
    answer: "Don't worry - many students feel nervous at first! We're patient, supportive instructors who specialize in helping nervous drivers build confidence. We'll start at your comfort level and progress at your pace.",
    category: "Getting Started"
  },
  {
    question: "Do you offer automatic or manual lessons?",
    answer: "We offer automatic transmission lessons. Most students find automatic easier to learn, especially in Sydney traffic. If you want to learn manual, we can discuss options.",
    category: "Lessons"
  },
  {
    question: "How do I book lessons?",
    answer: "You can book lessons through our online booking system on this website, or contact us directly via phone or email. We recommend booking in advance to secure your preferred time slots.",
    category: "Booking"
  },
  {
    question: "What are the most common mistakes in the driving test?",
    answer: "The most common mistakes include: not checking blind spots properly, speeding in school zones, incorrect lane positioning, and poor observation at intersections. We focus on these areas specifically during test preparation lessons.",
    category: "Driving Test"
  },
  {
    question: "How early should I arrive for my driving test?",
    answer: "Arrive at least 15 minutes before your scheduled test time. This gives you time to check in, use the restroom, and calm your nerves. Being rushed can affect your performance.",
    category: "Driving Test"
  },
  {
    question: "What's the best way to practice parallel parking?",
    answer: "Start with cones in an empty parking lot to build confidence. Practice the step-by-step method: position, reverse at 45 degrees, straighten, then complete. We teach a reliable method that works in tight Sydney spaces.",
    category: "Skills"
  },
  {
    question: "How do I handle roundabouts correctly?",
    answer: "Approach at appropriate speed, give way to vehicles already in the roundabout, signal left when exiting, and maintain correct lane position. We practice on different types of roundabouts to build confidence.",
    category: "Skills"
  },
  {
    question: "What should I do if I stall during my driving test?",
    answer: "Stay calm! Restart the car safely, check your mirrors and blind spots, then continue. Stalling once is usually a minor error unless it creates a dangerous situation. The key is how you recover.",
    category: "Driving Test"
  },
  {
    question: "How can I reduce nervousness before my test?",
    answer: "Practice the test route, get a good night's sleep, eat a light meal, and do breathing exercises. We also offer mock tests that simulate the real experience to build confidence.",
    category: "Driving Test"
  },
  {
    question: "What's included in a test package?",
    answer: "Our test package includes: use of our car for the test, a 1-hour warm-up lesson before the test, waiting during your test, and debrief afterward. We ensure the car meets all test requirements.",
    category: "Driving Test"
  },
  {
    question: "How do I improve my observation skills?",
    answer: "Practice systematic scanning: mirrors every 5-8 seconds, head checks for blind spots, and constant awareness of surroundings. We use specific exercises to develop this crucial skill.",
    category: "Skills"
  },
  {
    question: "What are the new road rules I should know?",
    answer: "Recent changes include: mobile phone detection cameras, lower speed limits in some areas, and updated give way rules. We stay current with all NSW road rule changes and incorporate them into lessons.",
    category: "Road Rules"
  }
]

const categories = Array.from(new Set(faqData.map(item => item.category)))

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const [openQuestion, setOpenQuestion] = useState<string | null>(null)

  const filteredFaqs = activeCategory === 'All' 
    ? faqData 
    : faqData.filter(item => item.category === activeCategory)

  const toggleQuestion = (question: string) => {
    setOpenQuestion(openQuestion === question ? null : question)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-gray-600 mb-8">
            Find answers to common questions about our driving lessons
          </p>
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            Serving the Lidcombe Area
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setActiveCategory('All')}
              className={`px-4 py-2 rounded-full transition ${activeCategory === 'All' ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
            >
              All Questions
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full transition ${activeCategory === category ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {filteredFaqs.map((item, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <button
                onClick={() => toggleQuestion(item.question)}
                className="w-full text-left p-6 flex justify-between items-center hover:bg-blue-50 transition"
              >
                <div className="flex-1">
                  <div className="flex items-center mb-1">
                    <span className="text-xs font-medium px-2 py-1 rounded bg-blue-100 text-blue-800 mr-3">
                      {item.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{item.question}</h3>
                </div>
                <svg 
                  className={`w-6 h-6 text-gray-500 transition-transform ${openQuestion === item.question ? 'transform rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {openQuestion === item.question && (
                <div className="px-6 pb-6">
                  <div className="pt-4 border-t">
                    <p className="text-gray-700">{item.answer}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Still have questions? */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
          <p className="text-gray-600 mb-6">
            Can't find what you're looking for? Get in touch with us directly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-secondary transition font-semibold"
            >
              Contact Us
            </Link>
            <Link
              href="/book"
              className="border-2 border-primary text-primary px-6 py-3 rounded-lg hover:bg-primary hover:text-white transition font-semibold"
            >
              Book a Lesson
            </Link>
          </div>
        </div>

        {/* Instagram CTA */}
        <div className="mt-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl shadow-lg p-8 text-center text-white">
          <div className="flex justify-center mb-4">
            <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </div>
          <h3 className="text-2xl font-bold mb-2">Follow @DriveWithBui on Instagram</h3>
          <p className="mb-6 text-pink-100">
            Get weekly driving tips, lesson highlights, and student success stories
          </p>
          <a
            href="https://instagram.com/DriveWithBui"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center bg-white text-pink-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition font-semibold"
          >
            Follow Now
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}