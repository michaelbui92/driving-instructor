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
    question: "What do I need to bring to my first lesson?",
    answer: "For your first lesson, please bring your learner's permit (L plates), comfortable shoes, and any glasses/contacts if you need them for driving. You don't need to bring anything else - the car and fuel are provided.",
    category: "Getting Started"
  },
  {
    question: "How many lessons will I need before I'm ready for my test?",
    answer: "Most students need 20-30 hours of professional instruction, plus practice with a supervising driver. However, this varies based on your prior experience, confidence level, and how quickly you learn. After your first few lessons, I can give you a personalized estimate.",
    category: "Getting Started"
  },
  {
    question: "What's the difference between Single Lesson and Casual Driving?",
    answer: "Single Lessons ($55) are structured sessions focusing on specific skills and progression. Casual Driving ($45) is for students who already know the basics and want practice without the structured teaching - perfect for maintaining skills or test preparation.",
    category: "Lessons & Pricing"
  },
  {
    question: "Do you offer package deals or discounts?",
    answer: "Yes! I offer 10-lesson packages at a discounted rate. Contact me directly to discuss package options and pricing. Payment plans are also available for package bookings.",
    category: "Lessons & Pricing"
  },
  {
    question: "Can I cancel or reschedule a lesson?",
    answer: "Yes, you can reschedule or cancel up to 24 hours before your lesson without penalty. Cancellations within 24 hours may incur a 50% fee. You can manage your bookings through your student dashboard.",
    category: "Booking & Cancellations"
  },
  {
    question: "What happens if I'm running late for my lesson?",
    answer: "Please call or text me if you're running late. I'll wait up to 15 minutes, but the lesson will still finish at the scheduled time. If you're more than 15 minutes late without contact, the lesson may be considered a no-show.",
    category: "Booking & Cancellations"
  },
  {
    question: "What areas do you service?",
    answer: "I cover Western Sydney including Lidcombe, Parramatta, Bankstown, Liverpool, Campbelltown, Blacktown, and Penrith. Free pickup within 20km of Lidcombe. Contact me if you're outside this area - I may still be able to help!",
    category: "Service Area"
  },
  {
    question: "Do you offer pickup from my location?",
    answer: "Yes! I offer free pickup from your home, school, or workplace within my service area. Just provide your address when booking, and I'll meet you there at the scheduled time.",
    category: "Service Area"
  },
  {
    question: "What kind of car do you teach in?",
    answer: "I teach in a modern Toyota Corolla (automatic) with dual controls, reverse camera, parking sensors, and all safety features. The car is regularly serviced, cleaned, and fully insured.",
    category: "The Car"
  },
  {
    question: "Do you teach manual or automatic?",
    answer: "I currently teach automatic transmission only. Most learners in Australia choose automatic as it's easier to learn and allows you to focus on road skills rather than gear changes.",
    category: "The Car"
  },
  {
    question: "What teaching methods do you use?",
    answer: "I use a patient, supportive approach focused on building confidence. Lessons are structured but flexible to your needs. I emphasize defensive driving, hazard perception, and real-world skills - not just test maneuvers.",
    category: "Teaching Approach"
  },
  {
    question: "Do you provide test preparation?",
    answer: "Absolutely! I offer dedicated test preparation lessons including mock tests, route practice, and tips for the actual test day. I can also accompany you to your test (additional fee applies).",
    category: "Teaching Approach"
  },
  {
    question: "How do I pay for lessons?",
    answer: "You can pay online when booking through the website (credit/debit card), or pay cash to me directly at the lesson. Online payment is required to confirm your booking.",
    category: "Payment"
  },
  {
    question: "Do you offer refunds?",
    answer: "Refunds are available for prepaid lessons if cancelled with at least 48 hours notice. Refunds may take 5-10 business days to process. No refunds for no-shows or late cancellations.",
    category: "Payment"
  },
  {
    question: "What if I have special needs or anxiety?",
    answer: "I have experience working with students who have driving anxiety, special needs, or learning differences. Just let me know in advance so I can tailor my approach to support you best.",
    category: "Special Requirements"
  },
  {
    question: "Can I use your car for my driving test?",
    answer: "Yes! You can use my car for your driving test for an additional fee. This includes pre-test warm-up, use of the car during the test, and waiting while you take the test.",
    category: "Driving Test"
  }
]

const categories = ["All", "Getting Started", "Lessons & Pricing", "Booking & Cancellations", "Service Area", "The Car", "Teaching Approach", "Payment", "Special Requirements", "Driving Test"]

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState("All")
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const filteredFAQs = activeCategory === "All" 
    ? faqData 
    : faqData.filter(faq => faq.category === activeCategory)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6" data-aos="fade-up">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8" data-aos="fade-up" data-aos-delay="100">
              Everything you need to know about learning to drive with me.
            </p>
            <div className="inline-block px-6 py-3 bg-primary text-white rounded-lg font-semibold" data-aos="fade-up" data-aos-delay="200">
              Can't find your answer? <Link href="/contact" className="underline hover:no-underline">Contact me</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full font-medium transition ${activeCategory === category ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="space-y-4">
          {filteredFAQs.map((faq, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl shadow-lg overflow-hidden"
              data-aos="fade-up"
              data-aos-delay={index * 50}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full text-left p-6 flex justify-between items-center hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${openIndex === index ? 'bg-primary text-white' : 'bg-blue-100 text-primary'}`}>
                    <span className="text-lg">?</span>
                  </div>
                  <h3 className="text-lg font-semibold">{faq.question}</h3>
                </div>
                <div className={`text-2xl transition-transform ${openIndex === index ? 'rotate-180' : ''}`}>
                  ▼
                </div>
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-6">
                  <div className="pl-14">
                    <div className="mb-2">
                      <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
                        {faq.category}
                      </span>
                    </div>
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Still Have Questions */}
        <div className="mt-16 bg-gradient-to-br from-primary to-secondary rounded-2xl p-8 text-center" data-aos="fade-up">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4">Still have questions?</h2>
            <p className="text-white/90 mb-6">
              I'm here to help! Get in touch and I'll respond within 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="px-6 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-gray-100 transition"
              >
                Contact Me
              </Link>
              <a
                href="tel:+61412345678"
                className="px-6 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition"
              >
                Call Now: 0412 345 678
              </a>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <Link 
            href="/book" 
            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition text-center group"
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition">📅</div>
            <h3 className="font-bold text-lg mb-2">Book a Lesson</h3>
            <p className="text-gray-600 text-sm">Schedule your driving lesson online in 2 minutes</p>
          </Link>
          <Link 
            href="/about" 
            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition text-center group"
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition">👨‍🏫</div>
            <h3 className="font-bold text-lg mb-2">About Me</h3>
            <p className="text-gray-600 text-sm">Learn about my experience and teaching approach</p>
          </Link>
          <Link 
            href="/contact" 
            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition text-center group"
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition">📞</div>
            <h3 className="font-bold text-lg mb-2">Get in Touch</h3>
            <p className="text-gray-600 text-sm">Contact me directly with any questions</p>
          </Link>
          <a 
            href="https://instagram.com/drivewithbui"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition text-center group"
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition">📸</div>
            <h3 className="font-bold text-lg mb-2">Instagram</h3>
            <p className="text-gray-600 text-sm">Follow @drivewithbui for driving tips</p>
          </a>
        </div>
      </div>
    </div>
  )
}
