/**
 * Footer Component
 *
 * Professional footer with company information including:
 * - About section with company branding
 * - Services description
 * - Contact information with clickable phone link
 * - Physical address
 * - Copyright notice
 *
 * Responsive: 1 column (mobile) → 2 columns (tablet) → 4 columns (desktop)
 */

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
        {/* Main Footer Content - Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-6 lg:gap-8">

          {/* About Section */}
          <div className="space-y-3">
            <h3 className="text-sm sm:text-base font-semibold text-white mb-3 sm:mb-4">
              About SSRS
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Your trusted partner for precision metal fabrication services in Surat.
            </p>
          </div>

          {/* Services Section */}
          <div className="space-y-3">
            <h3 className="text-sm sm:text-base font-semibold text-white mb-3 sm:mb-4">
              Our Services
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              We provide service for cutting, bending and punching according to your sizes
            </p>
          </div>

          {/* Contact Section */}
          <div className="space-y-3">
            <h3 className="text-sm sm:text-base font-semibold text-white mb-3 sm:mb-4">
              Contact
            </h3>
            <div className="space-y-2">
              <p className="text-xs sm:text-sm text-gray-300 font-medium">
                Alakh Panchal
              </p>
              <a
                href="tel:+919316605815"
                className="text-xs sm:text-sm text-gray-300 hover:text-white transition-colors duration-200 inline-flex items-center min-h-[44px] touch-manipulation"
              >
                <span className="mr-2">Tel:</span>
                <span className="hover:underline">+91 9316605815</span>
              </a>
            </div>
          </div>

          {/* Address Section */}
          <div className="space-y-3">
            <h3 className="text-sm sm:text-base font-semibold text-white mb-3 sm:mb-4">
              Address
            </h3>
            <address className="text-xs sm:text-sm text-gray-300 leading-relaxed not-italic">
              <a 
                href="https://maps.app.goo.gl/LLLxYsk2hrCAqVYa6" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-white transition-colors duration-200 block"
              >
                <p>Plot no A-25, 10-11-12,</p>
                <p>Udhna udhyognagar sangh,</p>
                <p>Road no 14, Udhna,</p>
                <p>Surat</p>
              </a>
            </address>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 mt-8 sm:mt-10 lg:mt-12 pt-6 sm:pt-8">
          {/* Copyright Section */}
          <div className="text-center">
            <p className="text-xs sm:text-sm text-gray-400">
              &copy; 2026 SSRS. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
