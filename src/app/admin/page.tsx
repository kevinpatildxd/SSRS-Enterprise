/**
 * Admin Page
 *
 * Admin dashboard for managing products:
 * - Add new products
 * - Edit existing products
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
  const [refreshing, setRefreshing] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSuccess = () => {
    // Refresh product list after adding/deleting
    fetchProducts();
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsEditModalOpen(true);
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setIsEditModalOpen(false);
  };

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    setEditingProduct(null);
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
      {/* Page Header with Refresh Button */}
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Manage your product catalog
          </p>
        </div>
        
        {/* Refresh Button */}
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center justify-center gap-2 bg-primary text-white py-2 px-4 rounded-md font-medium hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors active:scale-95 touch-manipulation w-full sm:w-auto"
        >
          <svg 
            className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
            />
          </svg>
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
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
                      ₹{(products.reduce((sum, p) => sum + Number(p.price), 0) / products.length).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
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
        <ProductList products={products} onDelete={handleSuccess} onEdit={handleEdit} />
      </div>

      {/* Edit Product Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <ProductForm
                initialData={editingProduct}
                isEditing={true}
                onSuccess={handleEditSuccess}
                onCancel={handleCancelEdit}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
