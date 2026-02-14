/**
 * ProductCard Component
 *
 * Displays a single product with:
 * - Responsive image (optimized for all devices)
 * - Product name
 * - Price (formatted)
 * - Minimum order quantity
 *
 * Mobile-first responsive design with touch-friendly tap targets.
 */

import Image from 'next/image';
import type { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      {/* Product Image - Responsive aspect ratio */}
      <div className="relative w-full aspect-square bg-gray-100">
        <Image
          src={product.image_path || '/images/placeholder.png'}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={false}
        />
      </div>

      {/* Product Details - Mobile optimized spacing */}
      <div className="p-3 sm:p-4 flex flex-col flex-grow">
        {/* Product Name - Responsive font size */}
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 line-clamp-2 min-h-[3rem]">
          {product.name}
        </h3>

        {/* Price per kg - Large and prominent on all devices */}
        <div className="flex items-baseline gap-2 mb-2 mt-auto">
          <span className="text-xl sm:text-2xl font-bold text-primary">
            ₹{product.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className="text-sm text-gray-500">per kg</span>
        </div>

        {/* Minimum Order Quantity - Clear and readable */}
        <div className="text-xs sm:text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded">
          Min. Order: <span className="font-medium text-gray-800">{product.min_order_qty}</span>
        </div>
      </div>
    </div>
  );
}
