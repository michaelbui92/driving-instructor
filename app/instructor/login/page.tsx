'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function InstructorLoginPage() {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'login' | 'setup'>('login');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Always try login first
      const response = await fetch('/api/instructor/auth/verify-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin, action: 'login' }),
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Login successful! Use hard redirect to ensure page reload
        window.location.href = '/instructor';
        return;
      }

      // Login failed - check why
      if (response.status === 400 && data.error?.includes('No PIN set')) {
        // No PIN in database - switch to setup mode
        setMode('setup');
        setError('');
        setIsLoading(false);
        return;
      }

      // Other error
      setError(data.error || 'Invalid PIN. Please try again.');
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetupPin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/instructor/auth/verify-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin, action: 'setPin' }),
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // PIN set successfully! Use hard redirect to ensure page reload
        window.location.href = '/instructor';
        return;
      }

      setError(data.error || 'Failed to set PIN. Please try again.');
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
      <Navbar showLocation={false} />

      <div className="max-w-md mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Instructor Portal</h1>
            <p className="text-gray-600">
              {mode === 'login' 
                ? 'Enter your PIN to continue' 
                : 'Set up your PIN to access the instructor portal'
              }
            </p>
          </div>

          {mode === 'login' ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="pin" className="block text-sm font-medium text-gray-700 mb-2">
                  Enter your 4-6 digit PIN
                </label>
                <input
                  id="pin"
                  type="password"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  value={pin}
                  onChange={(e) => {
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
                  Enter the PIN you previously set
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
                    Logging in...
                  </span>
                ) : 'Login'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSetupPin} className="space-y-6">
              <div>
                <label htmlFor="pin" className="block text-sm font-medium text-gray-700 mb-2">
                  Create a 4-6 digit PIN
                </label>
                <input
                  id="pin"
                  type="password"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  value={pin}
                  onChange={(e) => {
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
                  This PIN will be required to access the instructor portal
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
                    Setting up...
                  </span>
                ) : 'Set PIN & Continue'}
              </button>
            </form>
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
      </div>
    </div>
  );
}
