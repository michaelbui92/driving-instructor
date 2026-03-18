import Head from 'next/head';
import { useState } from 'react';
import Link from 'next/link';
import { PRICING, AVAILABILITY, formatCurrency } from '../lib/constants';

export default function BookingPage() {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedPackage, setSelectedPackage] = useState('single');
  const [bookingData, setBookingData] = useState({
    name: '',
    email: '',
    phone: '',
    license: '',
    experience: 'none',
    notes: ''
  });
  const [currentStep, setCurrentStep] = useState(1);

  const getCurrentWeekDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    
    return dates;
  };

  const getAvailableTimes = (dateStr) => {
    const date = new Date(dateStr);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    
    // Return available slots for the selected day
    if (AVAILABILITY.weekdays[dayName]) {
      return AVAILABILITY.weekdays[dayName];
    } else if (AVAILABILITY.weekends[dayName]) {
      return AVAILABILITY.weekends[dayName];
    }
    return [];
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would send the booking data to your backend
    alert('Booking request submitted! We\'ll contact you within 24 hours to confirm.');
  };

  const handleInputChange = (e) => {
    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value
    });
  };

  const packageOptions = [
    { id: 'single', ...PRICING.single },
    { id: 'package5', ...PRICING.package5 },
    { id: 'package10', ...PRICING.package10 },
    { id: 'testPrep', ...PRICING.testPrep }
  ];

  return (
    <>
      <Head>
        <title>Book Driving Lessons | DriveRight Sydney</title>
        <meta name="description" content="Book professional driving lessons online. Choose from single lessons or packages, select your preferred time, and start learning." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="text-2xl font-bold text-gray-900">
                DriveRight Sydney
              </Link>
              <Link href="/" className="text-primary-600 hover:text-primary-700">
                ← Back to Home
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Book Your Driving Lesson</h1>
            <p className="text-lg text-gray-600">Ready to start driving? Choose your package and preferred time</p>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-between mb-8">
            {['Package', 'Schedule', 'Details'].map((step, index) => (
              <div key={index} className={`flex-1 text-center ${index < 2 ? 'border-b-2 border-primary-500' : 'border-b-2 border-gray-300'}`}>
                <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full mb-2 ${currentStep > index + 1 ? 'bg-primary-500 text-white' : currentStep === index + 1 ? 'bg-primary-100 text-primary-600 border-2 border-primary-500' : 'bg-gray-200 text-gray-500'}`}>
                  {index + 1}
                </div>
                <p className={`text-sm ${currentStep === index + 1 ? 'text-primary-600 font-semibold' : 'text-gray-500'}`}>
                  {step}
                </p>
              </div>
            ))}
          </div>

          {/* Step 1: Package Selection */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">Choose Your Package</h2>
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {packageOptions.map((pkg) => (
                  <div 
                    key={pkg.id}
                    className={`bg-white rounded-lg p-6 border-2 cursor-pointer transition-colors ${
                      selectedPackage === pkg.id 
                        ? 'border-primary-500 bg-primary-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedPackage(pkg.id)}
                  >
                    <h3 className="text-xl font-semibold mb-2">{pkg.label}</h3>
                    <div className="text-3xl font-bold mb-2">{formatCurrency(pkg.price)}</div>
                    <div className="text-gray-600">{pkg.duration} minutes</div>
                    {pkg.savings && (
                      <div className="text-green-600 text-sm font-semibold mt-2">
                        Save {formatCurrency(pkg.savings)}
                      </div>
                    )}
                    {pkg.id === 'package5' && (
                      <div className="bg-blue-100 text-blue-700 text-sm px-2 py-1 rounded mt-2 inline-block">
                        Best Value
                      </div>
                    )}
                    {pkg.id === 'package10' && (
                      <div className="bg-green-100 text-green-700 text-sm px-2 py-1 rounded mt-2 inline-block">
                        Most Popular
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <button 
                onClick={() => setCurrentStep(2)}
                className="btn-primary"
                disabled={!selectedPackage}
              >
                Next: Select Time
              </button>
            </div>
          )}

          {/* Step 2: Date & Time Selection */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">Select Date & Time</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                {/* Date Selection */}
                <div>
                  <h3 className="font-semibold mb-4">Available Dates</h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {getCurrentWeekDates().map((date) => (
                      <button
                        key={date.toISOString()}
                        onClick={() => {
                          setSelectedDate(date.toISOString().split('T')[0]);
                          setSelectedTime('');
                        }}
                        className={`w-full text-left p-3 rounded-lg border transition-colors ${
                          selectedDate === date.toISOString().split('T')[0]
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="font-medium">
                          {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </div>
                        <div className="text-sm text-gray-600">
                          {date.toLocaleDateString('en-US', { weekday: 'long' })}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Selection */}
                <div>
                  <h3 className="font-semibold mb-4">Available Times</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedDate && getAvailableTimes(selectedDate).map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`p-3 rounded-lg border transition-colors ${
                          selectedTime === time
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                  {!selectedDate && (
                    <p className="text-gray-500 text-center py-8">Please select a date first</p>
                  )}
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <button 
                  onClick={() => setCurrentStep(1)}
                  className="btn-secondary"
                >
                  Back
                </button>
                <button 
                  onClick={() => setCurrentStep(3)}
                  className="btn-primary"
                  disabled={!selectedDate || !selectedTime}
                >
                  Next: Your Details
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Student Details */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">Your Details</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={bookingData.name}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="John Smith"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={bookingData.email}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="john.smith@email.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={bookingData.phone}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="0412 345 678"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Learner License Number *
                      </label>
                      <input
                        type="text"
                        name="license"
                        required
                        value={bookingData.license}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="L1234567"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Driving Experience
                      </label>
                      <select
                        name="experience"
                        value={bookingData.experience}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="none">No experience</option>
                        <option value="some">Some experience</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Additional Notes
                      </label>
                      <textarea
                        name="notes"
                        value={bookingData.notes}
                        onChange={handleInputChange}
                        rows="4"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Any specific areas you'd like to focus on..."
                      />
                    </div>
                  </form>
                </div>

                {/* Booking Summary */}
                <div>
                  <div className="bg-white rounded-lg p-6 border border-gray-200">
                    <h3 className="font-semibold mb-4">Booking Summary</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Package:</span>
                        <span className="font-medium">
                          {packageOptions.find(p => p.id === selectedPackage)?.label}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date:</span>
                        <span className="font-medium">
                          {selectedDate && new Date(selectedDate).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Time:</span>
                        <span className="font-medium">{selectedTime}</span>
                      </div>
                      <div className="border-t pt-3 mt-3">
                        <div className="flex justify-between text-lg font-semibold">
                          <span>Total:</span>
                          <span className="text-primary-600">
                            {formatCurrency(packageOptions.find(p => p.id === selectedPackage)?.price || 0)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Payment:</strong> You'll receive an email with payment instructions once your booking is confirmed.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <button 
                  onClick={() => setCurrentStep(2)}
                  className="btn-secondary"
                >
                  Back
                </button>
                <button 
                  type="submit"
                  onClick={handleSubmit}
                  className="btn-primary"
                >
                  Submit Booking Request
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}