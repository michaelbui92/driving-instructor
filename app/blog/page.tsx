import Navbar from '@/components/Navbar'
import Link from 'next/link'
import Image from 'next/image'

const blogPosts = [
  {
    id: 'quick-driving-tips',
    title: 'Quick Driving Tips for Sydney Roads',
    excerpt: 'Essential quick driving tips for navigating Sydney roads safely. Learn simple techniques to improve your driving confidence and safety.',
    date: 'March 23, 2026',
    readTime: '4 min read',
    image: '/images/blog/quick-tips.jpg',
    category: 'Essential Tips'
  },
  {
    id: 'sydney-driving-challenges',
    title: 'Local Sydney Driving Challenges & How to Overcome Them',
    excerpt: 'Learn about common driving challenges in Western Sydney and practical solutions. Master Sydney roads with confidence.',
    date: 'March 23, 2026',
    readTime: '6 min read',
    image: '/images/blog/local-challenges.jpg',
    category: 'Local Guide'
  },
  {
    id: 'first-driving-lesson',
    title: 'Your First Driving Lesson: What to Expect',
    excerpt: 'Feeling nervous about your first driving lesson? Learn what to expect and how to prepare for a successful start to your driving journey.',
    date: 'March 15, 2026',
    readTime: '5 min read',
    image: '/images/blog/first-lesson.jpg',
    category: 'Beginners'
  },
  {
    id: 'sydney-driving-test-tips',
    title: 'Sydney Driving Test Tips: Pass on Your First Attempt',
    excerpt: 'Essential tips and strategies to help you pass your Sydney driving test with confidence.',
    date: 'March 10, 2026',
    readTime: '7 min read',
    image: '/images/blog/test-tips.jpg',
    category: 'Test Preparation'
  },
  {
    id: 'parallel-parking-made-easy',
    title: 'Parallel Parking Made Easy: Step-by-Step Guide',
    excerpt: 'Master the art of parallel parking with our simple, step-by-step guide that breaks down this challenging maneuver.',
    date: 'March 5, 2026',
    readTime: '6 min read',
    image: '/images/blog/parallel-parking.jpg',
    category: 'Skills'
  },
  {
    id: 'choosing-driving-instructor',
    title: 'How to Choose the Right Driving Instructor in Sydney',
    excerpt: 'What to look for when selecting a driving instructor to ensure you get the best learning experience.',
    date: 'February 20, 2026',
    readTime: '5 min read',
    image: '/images/blog/choose-instructor.jpg',
    category: 'Advice'
  }
]

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Driving Tips & Insights
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Expert advice, practical tips, and helpful resources for learners and experienced drivers alike
          </p>
        </div>

        {/* Featured Post */}
        <div className="mb-16">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative h-64 lg:h-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">Featured Article</span>
                </div>
              </div>
              <div className="p-8 lg:p-12">
                <div className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full mb-4">
                  {blogPosts[0].category}
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {blogPosts[0].title}
                </h2>
                <p className="text-gray-600 mb-6">
                  {blogPosts[0].excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="text-gray-500 text-sm">
                    <span>{blogPosts[0].date}</span>
                    <span className="mx-2">•</span>
                    <span>{blogPosts[0].readTime}</span>
                  </div>
                  <Link
                    href={`/blog/${blogPosts[0].id}`}
                    className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-800 transition"
                  >
                    Read Article
                    <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Blog Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Latest Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.slice(1).map((post) => (
              <article key={post.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
                <div className="h-48 bg-gradient-to-r from-blue-400 to-blue-500 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">{post.category}</span>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-gray-100 text-gray-800 text-xs font-medium px-3 py-1 rounded-full">
                      {post.category}
                    </span>
                    <span className="text-gray-500 text-sm">{post.date}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-sm">{post.readTime}</span>
                    <Link
                      href={`/blog/${post.id}`}
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center"
                    >
                      Read more
                      <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Browse by Category</h2>
          <div className="flex flex-wrap gap-4">
            {['Beginners', 'Test Preparation', 'Skills', 'Safety', 'Advice', 'Road Rules'].map((category) => (
              <Link
                key={category}
                href="#"
                className="px-6 py-3 bg-white rounded-full shadow-md hover:shadow-lg transition text-gray-800 font-medium hover:text-blue-600"
              >
                {category}
              </Link>
            ))}
          </div>
        </div>

        {/* Newsletter CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
          <p className="mb-6 opacity-90 max-w-2xl mx-auto">
            Subscribe to get the latest driving tips, test updates, and exclusive offers delivered to your inbox.
          </p>
          <form className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-grow px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-white text-blue-700 font-semibold rounded-lg hover:bg-gray-100 transition"
              >
                Subscribe
              </button>
            </div>
            <p className="text-sm opacity-75 mt-3">
              No spam. Unsubscribe anytime.
            </p>
          </form>
        </div>
      </main>
    </div>
  )
}