            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-6 my-8">
            <h3 className="text-lg font-bold text-green-800 mb-3">Student Success Story</h3>
            <p className="text-green-700">
              "I failed my first test because I was too nervous. My instructor helped me work on my 
              observation skills and confidence. On my second attempt, I passed with only 3 minor errors! 
              The key was practicing the test route and staying calm." — James, Auburn
            </p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-6">After the Test</h2>
          
          <p className="mb-6">
            Whether you pass or need to try again, remember:
          </p>
          
          <ul className="space-y-3 mb-8">
            <li className="flex items-start">
              <svg className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span><strong>If you pass:</strong> Congratulations! Remember that getting your license is just the beginning of being a safe driver.</span>
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span><strong>If you don't pass:</strong> Don't be discouraged. Many people need multiple attempts. Use the feedback to focus your practice.</span>
            </li>
          </ul>

          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-8 text-white text-center mt-12">
            <h3 className="text-2xl font-bold mb-4">Need Test Preparation Help?</h3>
            <p className="mb-6 opacity-90">
              Book a mock test session with an experienced instructor to identify areas for improvement.
            </p>
            <Link
              href="/book"
              className="inline-flex items-center justify-center px-8 py-3 bg-white text-green-700 font-bold rounded-lg hover:bg-gray-100 transition text-lg"
            >
              Book Test Preparation
            </Link>
          </div>
        </article>

        {/* Related Articles */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Related Articles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              href="/blog/first-driving-lesson"
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition border border-gray-100"
            >
              <h4 className="text-lg font-bold text-gray-900 mb-2">Your First Driving Lesson</h4>
              <p className="text-gray-600 text-sm mb-3">What to expect and how to prepare for your first lesson.</p>
              <span className="text-blue-600 font-medium text-sm">Read more →</span>
            </Link>
            <Link
              href="/blog/parallel-parking-made-easy"
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition border border-gray-100"
            >
              <h4 className="text-lg font-bold text-gray-900 mb-2">Parallel Parking Made Easy</h4>
              <p className="text-gray-600 text-sm mb-3">Step-by-step guide to mastering this challenging maneuver.</p>
              <span className="text-blue-600 font-medium text-sm">Read more →</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}