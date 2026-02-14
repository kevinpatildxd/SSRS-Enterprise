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

import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SSRS - Product Catalog',
  description: 'Browse our product catalog with competitive prices and minimum order quantities',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
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
                SSRS
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
        <Footer />
      </body>
    </html>
  );
}
