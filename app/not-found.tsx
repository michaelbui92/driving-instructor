import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Animated car icon */}
        <div className="text-8xl mb-6 animate-bounce">🚗</div>
        
        {/* 404 */}
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        
        {/* Message */}
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Page Not Found
        </h2>
        
        <p className="text-gray-600 mb-8">
          Looks like this road leads nowhere! The page you're looking for doesn't exist or has been moved.
        </p>
        
        {/* Actions */}
        <div className="space-y-4">
          <Link
            href="/"
            className="block w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-secondary transition font-semibold"
          >
            ← Back to Home
          </Link>
          
          <Link
            href="/book"
            className="block w-full px-6 py-3 bg-white text-primary border-2 border-primary rounded-lg hover:bg-blue-50 transition font-semibold"
          >
            📅 Book a Lesson
          </Link>
        </div>
        
        {/* Helpful links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">You might be looking for:</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/about" className="text-primary hover:underline">About</Link>
            <Link href="/faq" className="text-primary hover:underline">FAQ</Link>
            <Link href="/contact" className="text-primary hover:underline">Contact</Link>
            <Link href="/blog" className="text-primary hover:underline">Blog</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
