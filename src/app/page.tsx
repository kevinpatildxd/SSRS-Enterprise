/**
 * Home Page
 *
 * Public-facing page that displays all products in a responsive grid.
 * This page is server-rendered for SEO benefits.
 * Mobile-first responsive design with optimized layouts for all devices.
 */

import { getAllProducts } from '@/lib/db';
import ProductCard from '@/components/ProductCard';

export default async function HomePage() {
  // Fetch products server-side
  const products = await getAllProducts();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
      {/* Page Header - Responsive typography */}
      <div className="mb-6 sm:mb-8 lg:mb-12">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2">
          Our Products
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Browse our catalog of {products.length} product{products.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Products Grid - Fully responsive */}
      {products.length === 0 ? (
        <div className="text-center py-12 sm:py-16 lg:py-20">
          <div className="bg-white rounded-lg shadow-md p-8 sm:p-12 max-w-md mx-auto">
            <svg
              className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <p className="text-gray-500 text-base sm:text-lg mb-2">No products available yet</p>
            <p className="text-gray-400 text-sm">Check back soon for new items!</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

// Revalidate every 60 seconds (ISR - Incremental Static Regeneration)
export const revalidate = 60;
