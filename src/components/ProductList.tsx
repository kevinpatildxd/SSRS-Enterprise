'use client';

import { useState } from 'react';
import type { Product } from '@/types/product';

interface ProductListProps {
  products: Product[];
  onDelete?: () => void;
}

export default function ProductList({ products, onDelete }: ProductListProps) {
  const [deleting, setDeleting] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (productId: string) => {
    setImageErrors(prev => ({ ...prev, [productId]: true }));
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    setDeleting(id);

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to delete product');
      }

      onDelete?.();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete product');
    } finally {
      setDeleting(null);
    }
  };

  const hasValidImage = (product: Product): boolean => {
    return !!(product.image_path && !imageErrors[product.id]);
  };

  if (products.length === 0) {
    return (
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md text-center text-gray-500">
        <p className="text-base sm:text-lg">No products yet. Add your first product above.</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price per kg
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Min. Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden">
                      {hasValidImage(product) ? (
                        <img
                          src={product.image_path!}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={() => handleImageError(product.id)}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{product.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    ₹{Number(product.price).toLocaleString('en-IN')} <span className="text-gray-500">/kg</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{product.min_order_qty}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(product.id)}
                      disabled={deleting === product.id}
                      className="text-red-600 hover:text-red-800 disabled:text-gray-400 font-medium"
                    >
                      {deleting === product.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="flex gap-4 p-4">
              <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                {hasValidImage(product) ? (
                  <img
                    src={product.image_path!}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={() => handleImageError(product.id)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>

              <div className="flex-grow min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
                <p className="text-lg font-bold text-primary mt-1">
                  ₹{Number(product.price).toLocaleString('en-IN')} <span className="text-sm text-gray-500">/kg</span>
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Min. Order: {product.min_order_qty}
                </p>
              </div>
            </div>

            <div className="border-t border-gray-100 px-4 py-3">
              <button
                onClick={() => handleDelete(product.id)}
                disabled={deleting === product.id}
                className="w-full bg-red-50 text-red-600 py-2 px-4 rounded-md font-medium hover:bg-red-100 disabled:bg-gray-100 disabled:text-gray-400 active:scale-95 touch-manipulation transition-all"
              >
                {deleting === product.id ? 'Deleting...' : 'Delete Product'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
