'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);

  if (!product) {
    return null;
  }

  const productName = product.name || 'Unnamed Product';
  const productPrice = typeof product.price === 'number' ? product.price : 0;
  const minOrderQty = product.min_order_qty || 'N/A';
  
  const imageSrc = (!product.image_path || imageError) 
    ? '/images/placeholder.png' 
    : product.image_path;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      <div className="relative w-full aspect-square bg-gray-100">
        <Image
          src={imageSrc}
          alt={productName}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={false}
          onError={() => {
            console.warn('Failed to load product image:', product.image_path);
            setImageError(true);
          }}
        />
      </div>

      <div className="p-3 sm:p-4 flex flex-col flex-grow">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 line-clamp-2 min-h-[3rem]">
          {productName}
        </h3>

        <div className="flex items-baseline gap-2 mb-2 mt-auto">
          <span className="text-xl sm:text-2xl font-bold text-primary">
            ₹{productPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className="text-sm text-gray-500">per kg</span>
        </div>

        <div className="text-xs sm:text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded">
          Min. Order: <span className="font-medium text-gray-800">{minOrderQty}</span>
        </div>
      </div>
    </div>
  );
}
