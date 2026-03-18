import Head from 'next/head';
import Link from 'next/link';
import { INSTRUCTOR_INFO, PRICING, TESTIMONIALS } from '../lib/constants';
import { formatCurrency } from '../lib/constants';

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Sydney Driving Instructor | Professional Lessons & Test Prep</title>
        <meta name="description" content="Professional driving instructor in Sydney. Book lessons online, track progress, pass your driving test with confidence." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">DriveRight Sydney</h1>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#services" className="text-gray-700 hover:text-primary-600">Services</a>
              <a href="#pricing" className="text-gray-700 hover:text-primary-600">Pricing</a>
              <a href="#about" className="text-gray-700 hover:text-primary-600">About</a>
              <a href="#testimonials" className="text-gray-700 hover:text-primary-600">Reviews</a>
              <a href="#contact" className="text-gray-700 hover:text-primary-600">Contact</a>
            </div>
            <Link href="/booking" className="btn-primary">
              Book Now
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-primary-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Learn to Drive with <span className="gradient-text">Confidence</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Professional driving lessons in Sydney with personalized instruction. 
                15+ years experience helping students pass their test on the first try.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/booking" className="btn-primary text-center">
                  Book Your First Lesson
                </Link>
                <a href="#pricing" className="btn-secondary text-center">
                  View Packages
                </a>
              </div>
              <div className="mt-8 flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  {INSTRUCTOR_INFO.experience} experience
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  95% pass rate
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  Flexible scheduling
                </div>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop&crop=auto"
                alt="Driving lesson"
                className="rounded-2xl shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Driving Services</h2>
            <p className="text-xl text-gray-600">Comprehensive lessons tailored to your needs</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card-shadow rounded-xl p-8">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-6">
                <span className="text-2xl">🚗</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Beginner Lessons</h3>
              <p className="text-gray-600 mb-4">
                Perfect for new drivers starting from scratch. Learn the basics, build confidence, 
                and master essential driving skills in a safe environment.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Vehicle controls and operation</li>
                <li>• Basic maneuvers</li>
                <li>• Road rules and safety</li>
                <li>• Parking techniques</li>
              </ul>
            </div>

            <div className="card-shadow rounded-xl p-8">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-6">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Test Preparation</h3>
              <p className="text-gray-600 mb-4">
                Intensive preparation for your driving test. Practice test routes, mock examinations, 
                and targeted feedback to ensure you're ready for test day.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Test route practice</li>
                <li>• Mock driving tests</li>
                <li>• Common test mistakes</li>
                <li>• Confidence building</li>
              </ul>
            </div>

            <div className="card-shadow rounded-xl p-8">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-6">
                <span className="text-2xl">🔄</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Refresher Courses</h3>
              <p className="text-gray-600 mb-4">
                For licensed drivers who want to improve specific skills or regain confidence 
                after a break from driving.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Skill assessment</li>
                <li>• Defensive driving techniques</li>
                <li>• City driving practice</li>
                <li>• Night driving skills</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Simple Pricing</h2>
            <p className="text-xl text-gray-600">Transparent rates with no hidden fees</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">{PRICING.single.label}</h3>
              <div className="text-3xl font-bold mb-4">{formatCurrency(PRICING.single.price)}</div>
              <div className="text-gray-600 mb-6">{PRICING.single.duration} minutes</div>
              <Link href="/booking" className="btn-outline w-full text-center block">
                Book Now
              </Link>
            </div>

            <div className="bg-white rounded-xl p-8 border-primary-500 border-2 relative">
              <div className="bg-primary-500 text-white text-sm font-semibold px-3 py-1 rounded-full absolute -top-3 left-1/2 transform -translate-x-1/2">
                Best Value
              </div>
              <h3 className="text-lg font-semibold mb-4">{PRICING.package5.label}</h3>
              <div className="text-3xl font-bold mb-4">{formatCurrency(PRICING.package5.price)}</div>
              <div className="text-gray-600 mb-2">{PRICING.package5.duration} minutes each</div>
              <div className="text-green-600 text-sm font-semibold mb-6">Save {formatCurrency(PRICING.package5.savings)}</div>
              <Link href="/booking" className="btn-primary w-full text-center block">
                Get Started
              </Link>
            </div>

            <div className="bg-white rounded-xl p-8 border-primary-500 border-2 relative">
              <div className="bg-primary-500 text-white text-sm font-semibold px-3 py-1 rounded-full absolute -top-3 left-1/2 transform -translate-x-1/2">
                Most Popular
              </div>
              <h3 className="text-lg font-semibold mb-4">{PRICING.package10.label}</h3>
              <div className="text-3xl font-bold mb-4">{formatCurrency(PRICING.package10.price)}</div>
              <div className="text-gray-600 mb-2">{PRICING.package10.duration} minutes each</div>
              <div className="text-green-600 text-sm font-semibold mb-6">Save {formatCurrency(PRICING.package10.savings)}</div>
              <Link href="/booking" className="btn-primary w-full text-center block">
                Get Started
              </Link>
            </div>

            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">{PRICING.testPrep.label}</h3>
              <div className="text-3xl font-bold mb-4">{formatCurrency(PRICING.testPrep.price)}</div>
              <div className="text-gray-600 mb-6">{PRICING.testPrep.duration} minutes</div>
              <Link href="/booking" className="btn-outline w-full text-center block">
                Book Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Student Success Stories</h2>
            <p className="text-xl text-gray-600">See what our students have to say</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((testimonial, index) => (
              <div key={index} className="card-shadow rounded-xl p-8">
                <div className="flex items-center mb-6">
                  <img 
                    src={testimonial.photo} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-yellow-400">
                      {'★'.repeat(testimonial.rating)}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Ready to Start Driving?</h2>
            <p className="text-xl text-gray-600">Get in touch to book your first lesson</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📞</span>
              </div>
              <h3 className="font-semibold mb-2">Phone</h3>
              <p className="text-gray-600">{INSTRUCTOR_INFO.phone}</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✉️</span>
              </div>
              <h3 className="font-semibold mb-2">Email</h3>
              <p className="text-gray-600">{INSTRUCTOR_INFO.email}</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📍</span>
              </div>
              <h3 className="font-semibold mb-2">Service Areas</h3>
              <p className="text-gray-600">Sydney CBD & Surrounding Suburbs</p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link href="/booking" className="btn-primary">
              Book Your First Lesson
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">DriveRight Sydney</h3>
              <p className="text-gray-400">Professional driving instruction in Sydney</p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Beginner Lessons</li>
                <li>Test Preparation</li>
                <li>Refresher Courses</li>
                <li>Defensive Driving</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/booking">Book Online</Link></li>
                <li><Link href="/dashboard">Student Dashboard</Link></li>
                <li>Pricing</li>
                <li>About</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>{INSTRUCTOR_INFO.phone}</li>
                <li>{INSTRUCTOR_INFO.email}</li>
                <li>Sydney, NSW</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 DriveRight Sydney. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}