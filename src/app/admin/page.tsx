/**
 * Admin Page
 *
 * Admin dashboard for managing products:
 * - Add new products
 * - View all products
 * - Delete products
 *
 * Mobile-first responsive layout with stacked components on small screens.
 */

'use client';

import { useState, useEffect } from 'react';
import ProductForm from '@/components/ProductForm';
import ProductList from '@/components/ProductList';
import type { Product } from '@/types/product';

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProducts = async () => {
    try {
      setError('');
      const response = await fetch('/api/products');
      const data = await response.json();

      if (data.success) {
        setProducts(data.data);
      } else {
        throw new Error(data.error || 'Failed to fetch products');
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSuccess = () => {
    // Refresh product list after adding/deleting
    fetchProducts();
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
      {/* Page Header - Responsive */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Manage your product catalog
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <p className="font-medium">Error loading products</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Grid Layout - Stack on mobile, side-by-side on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
        {/* Add Product Form */}
        <div className="order-1">
          <ProductForm onSuccess={handleSuccess} />
        </div>

        {/* Statistics Card */}
        <div className="order-2">
          <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md h-full">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">
              Statistics
            </h2>
            <div className="space-y-6">
              <div>
                <p className="text-sm sm:text-base text-gray-600 mb-1">Total Products</p>
                <p className="text-3xl sm:text-4xl font-bold text-primary">{products.length}</p>
              </div>

              {products.length > 0 && (
                <>
                  <div>
                    <p className="text-sm sm:text-base text-gray-600 mb-1">Average Price</p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-800">
                      ₹{(products.reduce((sum, p) => sum + p.price, 0) / products.length).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm sm:text-base text-gray-600 mb-1">Products with Images</p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-800">
                      {products.filter(p => p.image_path).length}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Product List */}
      <div className="order-3">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
          All Products ({products.length})
        </h2>
        <ProductList initialProducts={products} onDelete={handleSuccess} />
      </div>
    </div>
  );
}
