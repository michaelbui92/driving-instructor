'use client'

import Link from 'next/link'
import { useState } from 'react'

const blogPosts = [
  {
    id: 1,
    title: "Why You Should Never Overtake a Turning Truck",
    excerpt: "Trucks and long vehicles swing wider than you think when turning. Here's exactly why overtaking a turning truck is one of the most dangerous things you can do.",
    date: "April 5, 2026",
    readTime: "5 min read",
    slug: "turning-long-vehicles",
    category: "Safety"
  },
  {
    id: 2,
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
    id: 7,
    title: "Merging Lanes Safely: A Step-by-Step Guide",
    excerpt: "Lane merging is one of the trickiest maneuvers for new drivers. Master the technique with this comprehensive guide.",
    date: "March 20, 2026",
    readTime: "5 min read",
    slug: "merging-lanes",
    category: "Skills"
  },
  {
    id: 8,
    title: "Understanding Blind Spots: The Hidden Dangers",
    excerpt: "Blind spots cause countless accidents every year. Learn how to identify and manage them to stay safe on the road.",
    date: "March 22, 2026",
    readTime: "4 min read",
    slug: "blind-spots",
    category: "Safety"
  },
]

const categories = ["All", "Safety", "Road Rules", "Test Preparation", "Skills", "City Driving"]

const categoryColors: Record<string, string> = {
  "Safety": "bg-red-100 text-red-700 hover:bg-red-200",
  "Road Rules": "bg-green-100 text-green-700 hover:bg-green-200",
  "Test Preparation": "bg-yellow-100 text-yellow-700 hover:bg-yellow-200",
  "Skills": "bg-indigo-100 text-indigo-700 hover:bg-indigo-200",
  "City Driving": "bg-orange-100 text-orange-700 hover:bg-orange-200"
}

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")

  const filteredPosts = selectedCategory === "All" 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Import Navbar */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-primary hover:text-secondary transition">
                🚗 Drive With Bui
              </Link>
              <span className="ml-2 text-sm text-gray-600 hidden md:inline">• Lidcombe Area</span>
            </div>
            <div className="hidden md:flex space-x-4 items-center">
              <Link href="/about" className="text-gray-700 hover:text-primary transition font-medium px-2 py-1">About</Link>
              <Link href="/blog" className="text-gray-700 hover:text-primary transition font-medium px-2 py-1">Blog</Link>
              <Link href="/faq" className="text-gray-700 hover:text-primary transition font-medium px-2 py-1">FAQ</Link>
              <Link href="/contact" className="text-gray-700 hover:text-primary transition font-medium px-2 py-1">Contact</Link>
              <div className="flex space-x-2 ml-2">
                <Link href="/student/login" className="px-3 py-1.5 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition font-medium text-sm">Student Login</Link>
                <Link href="/instructor" className="px-3 py-1.5 bg-primary text-white rounded-lg hover:bg-secondary transition font-medium text-sm">Instructor Portal</Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
      
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-4" data-aos="fade-up">Driving Tips & Blog</h1>
        <p className="text-center text-gray-600 mb-8" data-aos="fade-up" data-aos-delay="100">Helpful tips and insights for new and experienced drivers</p>
        
        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12" data-aos="fade-up" data-aos-delay="150">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                selectedCategory === category
                  ? "bg-primary text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold mb-2">No articles in this category yet</h3>
            <p className="text-gray-600">Check back soon for new content!</p>
            <button
              onClick={() => setSelectedCategory("All")}
              className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition"
            >
              View All Articles
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {filteredPosts.map((post, index) => {
              const link = `/blog/${post.slug}`
              const colorClass = categoryColors[post.category] || "bg-blue-100 text-blue-700"
              
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
                    <span className={`px-3 py-1 ${colorClass} rounded-full text-xs font-medium`}>
                      {post.category}
                    </span>
                  </div>
                  <Link href={link}>
                    <h2 className="text-2xl font-bold mb-3 hover:text-primary transition cursor-pointer">
                      {post.title}
                    </h2>
                  </Link>
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
        )}

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
