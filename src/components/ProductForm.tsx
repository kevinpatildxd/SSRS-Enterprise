/**
 * ProductForm Component
 *
 * Form for creating new products with:
 * - Product name input
 * - Price input
 * - Minimum order quantity input
 * - Image upload
 *
 * Mobile-optimized with large touch targets and clear validation.
 */

'use client';

import { useState } from 'react';
import ImageUpload from './ImageUpload';

interface ProductFormProps {
  onSuccess?: () => void;
}

export default function ProductForm({ onSuccess }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    min_order_qty: '',
    image_path: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to create product');
      }

      // Reset form
      setFormData({
        name: '',
        price: '',
        min_order_qty: '',
        image_path: '',
      });

      // Call success callback
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (imagePath: string) => {
    setFormData({ ...formData, image_path: imagePath });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 bg-white p-4 sm:p-6 rounded-lg shadow-md">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Add New Product</h2>

      {/* Error Message - Mobile friendly */}
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      {/* Product Name - Large input for mobile */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          Product Name *
        </label>
        <input
          type="text"
          id="name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-3 py-2.5 sm:px-4 sm:py-3 text-base border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="Enter product name"
        />
      </div>

      {/* Price - Number keyboard on mobile */}
      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
          Price (₹) *
        </label>
        <input
          type="number"
          id="price"
          required
          min="0"
          step="0.01"
          inputMode="decimal"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          className="w-full px-3 py-2.5 sm:px-4 sm:py-3 text-base border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="0.00"
        />
      </div>

      {/* Minimum Order Quantity - Numeric keyboard on mobile */}
      <div>
        <label htmlFor="min_order_qty" className="block text-sm font-medium text-gray-700 mb-2">
          Minimum Order Quantity *
        </label>
        <input
          type="number"
          id="min_order_qty"
          required
          min="1"
          inputMode="numeric"
          value={formData.min_order_qty}
          onChange={(e) => setFormData({ ...formData, min_order_qty: e.target.value })}
          className="w-full px-3 py-2.5 sm:px-4 sm:py-3 text-base border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="1"
        />
      </div>

      {/* Image Upload */}
      <ImageUpload onUploadSuccess={handleImageUpload} />

      {/* Submit Button - Large touch target for mobile */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary text-white py-3 sm:py-3.5 px-6 rounded-md font-medium text-base sm:text-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors active:scale-95 touch-manipulation"
      >
        {loading ? 'Adding Product...' : 'Add Product'}
      </button>
    </form>
  );
}
