/**
 * Root Layout
 *
 * Wraps all pages with:
 * - HTML structure
 * - Global styles
 * - Font configuration
 * - Metadata
 * - Mobile-optimized navigation
 */

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Alakh Web - Product Catalog',
  description: 'Browse our product catalog with competitive prices and minimum order quantities',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
  themeColor: '#3B82F6',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Mobile-optimized Navigation */}
        <nav className="bg-primary text-white shadow-md sticky top-0 z-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-14 sm:h-16">
              {/* Logo/Brand - Responsive sizing */}
              <a href="/" className="text-lg sm:text-xl md:text-2xl font-bold hover:opacity-90 transition-opacity">
                Alakh Web
              </a>

              {/* Navigation Links - Touch-friendly spacing */}
              <div className="flex space-x-3 sm:space-x-6">
                <a
                  href="/"
                  className="text-sm sm:text-base hover:underline py-2 px-2 sm:px-3 active:opacity-70 transition-opacity touch-manipulation"
                >
                  Home
                </a>
                <a
                  href="/admin"
                  className="text-sm sm:text-base hover:underline py-2 px-2 sm:px-3 active:opacity-70 transition-opacity touch-manipulation"
                >
                  Admin
                </a>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="min-h-screen bg-gray-50">
          {children}
        </main>

        {/* Footer - Mobile-optimized */}
        <footer className="bg-gray-800 text-white py-6 sm:py-8 mt-12">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm sm:text-base">&copy; 2026 Alakh Web. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
