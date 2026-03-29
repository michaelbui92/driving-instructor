'use client'

import Link from 'next/link'
import Navbar from '@/components/Navbar'

const blogPosts = [
  {
    id: 1,
    title: "5 Essential Mirror Checks Every Driver Should Master",
    excerpt: "Proper mirror checks are the foundation of safe driving. Learn how to check your mirrors correctly without taking your eyes off the road.",
    date: "March 15, 2026",
    readTime: "4 min read",
    slug: "mirror-checks",
    category: "Safety"
  },
  {
    id: 2,
    title: "Understanding NSW Road Rules: Common Mistakes to Avoid",
    excerpt: "Many new drivers struggle with specific NSW road rules. Here are the most common mistakes I see and how to avoid them.",
    date: "March 10, 2026",
    readTime: "5 min read",
    slug: "nsw-road-rules",
    category: "Road Rules"
  },
  {
    id: 3,
    title: "Night Driving Tips for New Drivers",
    excerpt: "Driving at night requires extra caution. Learn the key skills and mindset needed for safe night driving in Sydney.",
    date: "March 5, 2026",
    readTime: "4 min read",
    slug: "night-driving",
    category: "Safety"
  },
  {
    id: 4,
    title: "How to Prepare for Your Driving Test",
    excerpt: "Nervous about your upcoming driving test? Here's my comprehensive guide to feeling confident and prepared.",
    date: "February 28, 2026",
    readTime: "6 min read",
    slug: "driving-test-prep",
    category: "Test Preparation"
  },
  {
    id: 5,
    title: "Dealing with Roundabouts: A Beginner's Guide",
    excerpt: "Roundabouts can be intimidating for new drivers. Learn the rules and techniques to navigate them with confidence.",
    date: "February 20, 2026",
    readTime: "5 min read",
    slug: "roundabouts-guide",
    category: "Skills"
  },
  {
    id: 6,
    title: "Tips for Driving in Sydney Traffic",
    excerpt: "Sydney traffic can be challenging. Here are practical tips for staying calm and safe during peak hour.",
    date: "February 15, 2026",
    readTime: "4 min read",
    slug: "sydney-traffic-tips",
    category: "City Driving"
  },
]

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-4" data-aos="fade-up">Driving Tips & Blog</h1>
        <p className="text-center text-gray-600 mb-12" data-aos="fade-up" data-aos-delay="100">Helpful tips and insights for new and experienced drivers</p>
        
        <div className="space-y-8">
          {blogPosts.map((post, index) => {
            // Determine category color based on category
            const categoryColors: Record<string, string> = {
              "Safety": "bg-red-100 text-red-700",
              "Road Rules": "bg-green-100 text-green-700",
              "Test Preparation": "bg-yellow-100 text-yellow-700",
              "Skills": "bg-indigo-100 text-indigo-700",
              "City Driving": "bg-orange-100 text-orange-700"
            }
            
            const categoryColor = categoryColors[post.category] || "bg-blue-100 text-blue-700"
            const link = `/blog/${post.slug}`
            
            return (
              <div 
                key={post.id} 
                className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition hover-lift"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-3">
                  <span>📅 {post.date}</span>
                  <span>•</span>
                  <span>⏱️ {post.readTime}</span>
                  <span>•</span>
                  <span className={`px-3 py-1 ${categoryColor} rounded-full text-xs font-medium`}>
                    {post.category}
                  </span>
                </div>
                <h2 className="text-2xl font-bold mb-3 hover:text-primary transition cursor-pointer">
                  {post.title}
                </h2>
                <p className="text-gray-600 mb-4">
                  {post.excerpt}
                </p>
                <Link 
                  href={link}
                  className="inline-flex items-center gap-1 text-primary font-semibold hover:underline"
                >
                  Read Article →
                </Link>
              </div>
            )
          })}
        </div>

        <div 
          className="mt-12 bg-primary rounded-2xl p-8 text-center text-white"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <h2 className="text-2xl font-bold mb-4">Ready to Hit the Road?</h2>
          <p className="mb-6 opacity-90">Book your first lesson and start your journey to becoming a confident driver.</p>
          <Link 
            href="/book" 
            className="inline-block px-8 py-3 bg-white text-primary rounded-lg hover:bg-gray-100 transition font-semibold hover-lift"
          >
            Book a Lesson
          </Link>
        </div>
      </div>
    </div>
  )
}
