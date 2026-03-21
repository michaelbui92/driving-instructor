'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { login, hasPinSet, resetPin } from '@/lib/auth';

export default function InstructorLoginPage() {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pinSet, setPinSet] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if PIN is already set
    setPinSet(hasPinSet());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (login(pin)) {
        // Successful login - redirect to instructor portal
        router.push('/instructor');
      } else {
        setError('Invalid PIN. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPin = () => {
    resetPin();
    setPinSet(false);
    setShowResetConfirm(false);
    setPin('');
    setError('');
    alert('PIN has been reset. Please set a new PIN.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
      <Navbar showLocation={false} />

      <div className="max-w-md mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Instructor Portal</h1>
            <p className="text-gray-600">
              {pinSet ? 'Enter your PIN to continue' : 'Set up your PIN to access the instructor portal'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="pin" className="block text-sm font-medium text-gray-700 mb-2">
                {pinSet ? 'Enter your 4-6 digit PIN' : 'Create a 4-6 digit PIN'}
              </label>
              <input
                id="pin"
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={pin}
                onChange={(e) => {
                  // Only allow digits
                  const value = e.target.value.replace(/\D/g, '');
                  setPin(value);
                  setError('');
                }}
                className="w-full px-4 py-3 text-center text-2xl tracking-widest border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="••••••"
                autoComplete="off"
                required
              />
              <p className="text-sm text-gray-500 mt-2">
                {pinSet 
                  ? 'Enter the PIN you previously set'
                  : 'This PIN will be required to access the instructor portal'
                }
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || pin.length < 4}
              className={`w-full py-3 px-4 rounded-lg font-semibold transition ${
                isLoading || pin.length < 4
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-primary text-white hover:bg-secondary'
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {pinSet ? 'Logging in...' : 'Setting up...'}
                </span>
              ) : pinSet ? 'Login' : 'Set PIN & Continue'}
            </button>
          </form>

          {pinSet && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={() => setShowResetConfirm(true)}
                className="w-full py-2 px-4 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition text-sm font-medium"
              >
                Forgot PIN? Reset it here
              </button>
            </div>
          )}

          <div className="mt-8 text-center">
            <Link 
              href="/" 
              className="text-primary hover:text-secondary font-medium"
            >
              ← Back to home page
            </Link>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">⚠️ Security Notice</h3>
          <p className="text-sm text-yellow-700">
            This PIN-based authentication is for MVP purposes only. For production use, consider implementing:
          </p>
          <ul className="text-sm text-yellow-700 mt-2 space-y-1">
            <li>• Proper backend authentication</li>
            <li>• Email/password login</li>
            <li>• Password reset via email</li>
            <li>• Server-side session management</li>
          </ul>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Reset PIN</h3>
            <p className="text-gray-600 mb-6">
              This will clear your current PIN and require you to set a new one. 
              You will need to use the new PIN for future logins.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleResetPin}
                className="flex-1 py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
              >
                Reset PIN
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}