/**
 * Admin Layout
 *
 * Wraps admin pages with password protection.
 * Simple client-side authentication (for zero-cost solution).
 * Mobile-optimized login form with large touch targets.
 */

'use client';

import { useState, useEffect } from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Check if already authenticated with expiration (30 minutes)
  useEffect(() => {
    const auth = sessionStorage.getItem('admin_auth');
    const authTime = sessionStorage.getItem('admin_auth_time');
    
    if (auth === 'true' && authTime) {
      const loginTime = parseInt(authTime);
      const now = Date.now();
      const thirtyMinutes = 30 * 60 * 1000;
      
      // Check if session expired
      if (now - loginTime < thirtyMinutes) {
        setIsAuthenticated(true);
      } else {
        // Session expired, clear storage
        sessionStorage.removeItem('admin_auth');
        sessionStorage.removeItem('admin_auth_time');
      }
    }
    setIsLoading(false);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (data.success) {
        setIsAuthenticated(true);
        sessionStorage.setItem('admin_auth', 'true');
        sessionStorage.setItem('admin_auth_time', Date.now().toString());
        setError('');
      } else {
        setError('Invalid password. Please try again.');
        setPassword('');
      }
    } catch (error) {
      setError('Authentication failed. Please try again.');
      setPassword('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_auth');
    sessionStorage.removeItem('admin_auth_time');
    setPassword('');
  };

  // Show loading state briefly
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center text-gray-800">
            Admin Login
          </h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter password"
                autoFocus
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-primary text-white py-3 px-4 rounded-md font-medium text-base hover:bg-blue-600 active:scale-95 transition-all touch-manipulation"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Show admin content with logout button
  return (
    <div>
      {/* Logout Button - Fixed on mobile for easy access */}
      <div className="bg-white border-b border-gray-200 sticky top-14 sm:top-16 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-end">
          <button
            onClick={handleLogout}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium active:scale-95 transition-all touch-manipulation"
          >
            Logout
          </button>
        </div>
      </div>

      {children}
    </div>
  );
}
