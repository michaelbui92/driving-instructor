'use client'

import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { useState } from 'react'

const faqs = [
  {
    question: "What do I need to bring to my first lesson?",
    answer: "Bring your learner licence (or provisional licence if you're upgrading), any glasses or contacts if you need them for driving, and comfortable shoes. That's it! I'll handle the rest."
  },
  {
    question: "How long are the lessons?",
    answer: "Each lesson is 60 minutes. This gives enough time to cover important skills without getting too fatigued."
  },
  {
    question: "Do I need my own car for lessons?",
    answer: "No! I provide a dual-controlled car for all lessons. This means you can learn and make mistakes safely without worrying about damaging your own vehicle."
  },
  {
    question: "Can I take lessons if I don't have a licence yet?",
    answer: "Absolutely! I work with complete beginners who are on their L-plates. I'll teach you everything from how to start the car to navigating Australian roads."
  },
  {
    question: "What areas do you service?",
    answer: "I cover Lidcombe and surrounding suburbs including Auburn, Strathfield, Homebush, Burwood, Concord, and Rhodes. Pickup and drop-off from your home or workplace is included."
  },
  {
    question: "How often should I take lessons?",
    answer: "For the best results, I recommend weekly lessons. This gives you time to practice between sessions. However, I can work with whatever schedule suits you."
  },
  {
    question: "Will I be ready for my driving test after lessons?",
    answer: "Yes! My goal is to prepare you thoroughly for your NSW driving test. We'll cover all the skills and knowledge needed to pass both the knowledge test and the practical driving test."
  },
  {
    question: "What if I need to cancel or reschedule?",
    answer: "Life happens! Just give me at least 24 hours notice and we can reschedule your lesson. I understand that plans change."
  },
  {
    question: "Do you offer lessons on weekends?",
    answer: "Yes! I offer flexible hours including weekends. Contact me to find a time that works for your schedule."
  },
  {
    question: "What's the difference between Single Lesson and Casual Driving?",
    answer: "Single Lessons are structured for learning new skills - perfect for beginners or those working on specific areas. Casual Driving is for maintaining skills and relaxed practice - ideal if you already have basic competence and want to keep your skills sharp."
  },
]

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-4">Frequently Asked Questions</h1>
        <p className="text-center text-gray-600 mb-8">Everything you need to know about driving lessons with Drive With Bui</p>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition"
              >
                <span className="font-semibold text-gray-800">{faq.question}</span>
                <span className={`text-primary text-2xl transition-transform ${openIndex === index ? 'rotate-45' : ''}`}>+</span>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 bg-primary rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
          <p className="mb-6 opacity-90">Feel free to reach out and I'll get back to you as soon as possible.</p>
          <Link href="/contact" className="inline-block px-8 py-3 bg-white text-primary rounded-lg hover:bg-gray-100 transition font-semibold">
            Contact Me
          </Link>
        </div>
      </div>
    </div>
  )
}
