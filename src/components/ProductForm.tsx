'use client';

import { useState, useEffect } from 'react';
import ImageUpload from './ImageUpload';
import type { Product } from '@/types/product';

interface ProductFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialData?: Product | null;
  isEditing?: boolean;
}

interface FormData {
  name: string;
  price: string;
  min_order_qty: string;
  image_path: string;
}

interface FormErrors {
  name?: string;
  price?: string;
  min_order_qty?: string;
}

export default function ProductForm({ 
  onSuccess, 
  onCancel,
  initialData,
  isEditing = false 
}: ProductFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    price: '',
    min_order_qty: '',
    image_path: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [uploadKey, setUploadKey] = useState(0);

  // Populate form when editing
  useEffect(() => {
    if (isEditing && initialData) {
      setFormData({
        name: initialData.name,
        price: initialData.price.toString(),
        min_order_qty: initialData.min_order_qty,
        image_path: initialData.image_path || '',
      });
      setUploadKey(prev => prev + 1); // Reset image upload with existing image
    } else {
      // Reset form when not editing
      setFormData({
        name: '',
        price: '',
        min_order_qty: '',
        image_path: '',
      });
      setUploadKey(prev => prev + 1);
    }
  }, [isEditing, initialData]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Product name must be at least 2 characters';
    } else if (formData.name.trim().length > 100) {
      newErrors.name = 'Product name must be less than 100 characters';
    }

    // Validate price
    const priceValue = parseFloat(formData.price);
    if (!formData.price || isNaN(priceValue)) {
      newErrors.price = 'Price is required';
    } else if (priceValue < 0) {
      newErrors.price = 'Price cannot be negative';
    } else if (priceValue > 1000000) {
      newErrors.price = 'Price cannot exceed ₹1,000,000';
    }

    // Validate min order quantity
    if (!formData.min_order_qty.trim()) {
      newErrors.min_order_qty = 'Minimum order quantity is required';
    } else if (formData.min_order_qty.trim().length > 100) {
      newErrors.min_order_qty = 'Must be less than 100 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset states
    setError('');
    setSuccess(false);

    // Validate form
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      let response;
      let data;

      if (isEditing && initialData) {
        // Update existing product
        const updateData: { name?: string; price?: number; min_order_qty?: string; image_path?: string | null } = {};
        
        // Only include changed fields
        if (formData.name !== initialData.name) updateData.name = formData.name;
        if (parseFloat(formData.price) !== initialData.price) updateData.price = parseFloat(formData.price);
        if (formData.min_order_qty !== initialData.min_order_qty) updateData.min_order_qty = formData.min_order_qty;
        if (formData.image_path !== (initialData.image_path || '')) updateData.image_path = formData.image_path || null;

        response = await fetch(`/api/products/${initialData.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updateData),
        });
      } else {
        // Create new product
        response = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      }

      try {
        data = await response.json();
      } catch {
        throw new Error('Invalid response from server');
      }

      if (!response.ok || !data.success) {
        throw new Error(data.error || `Failed to ${isEditing ? 'update' : 'create'} product (${response.status})`);
      }

      // Reset form only when creating (not editing)
      if (!isEditing) {
        setFormData({
          name: '',
          price: '',
          min_order_qty: '',
          image_path: '',
        });
        setErrors({});
        setUploadKey(prev => prev + 1);
      }

      // Show success message
      setSuccess(true);

      // Call success callback
      onSuccess?.();

      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Form submission error:', err);
      setError(err instanceof Error ? err.message : `Failed to ${isEditing ? 'update' : 'create'} product. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (imagePath: string) => {
    setFormData(prev => ({ ...prev, image_path: imagePath }));
  };

  const handleImageError = (errorMsg: string) => {
    setError(errorMsg);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 bg-white p-4 sm:p-6 rounded-lg shadow-md">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{isEditing ? 'Edit Product' : 'Add New Product'}</h2>

      {/* General Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm">{error}</span>
          </div>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium">{isEditing ? 'Product updated successfully!' : 'Product added successfully!'}</span>
          </div>
        </div>
      )}

      {/* Product Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          Product Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => {
            setFormData(prev => ({ ...prev, name: e.target.value }));
            if (errors.name) setErrors(prev => ({ ...prev, name: undefined }));
          }}
          className={`w-full px-3 py-2.5 sm:px-4 sm:py-3 text-base border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
            errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
          }`}
          placeholder="Enter product name"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name}</p>
        )}
      </div>

      {/* Price */}
      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
          Price per kg (₹) <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          id="price"
          min="0"
          step="0.01"
          inputMode="decimal"
          value={formData.price}
          onChange={(e) => {
            setFormData(prev => ({ ...prev, price: e.target.value }));
            if (errors.price) setErrors(prev => ({ ...prev, price: undefined }));
          }}
          className={`w-full px-3 py-2.5 sm:px-4 sm:py-3 text-base border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
            errors.price ? 'border-red-500 bg-red-50' : 'border-gray-300'
          }`}
          placeholder="0.00"
        />
        {errors.price && (
          <p className="mt-1 text-sm text-red-600">{errors.price}</p>
        )}
      </div>

      {/* Minimum Order Quantity */}
      <div>
        <label htmlFor="min_order_qty" className="block text-sm font-medium text-gray-700 mb-2">
          Minimum Order Quantity <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="min_order_qty"
          value={formData.min_order_qty}
          onChange={(e) => {
            setFormData(prev => ({ ...prev, min_order_qty: e.target.value }));
            if (errors.min_order_qty) setErrors(prev => ({ ...prev, min_order_qty: undefined }));
          }}
          className={`w-full px-3 py-2.5 sm:px-4 sm:py-3 text-base border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
            errors.min_order_qty ? 'border-red-500 bg-red-50' : 'border-gray-300'
          }`}
          placeholder="e.g., 10, 1 dozen, Minimum 5 units"
        />
        {errors.min_order_qty && (
          <p className="mt-1 text-sm text-red-600">{errors.min_order_qty}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          You can enter any text like "10", "1 dozen", "Minimum 5 kg", etc.
        </p>
      </div>

      {/* Image Upload */}
      <ImageUpload 
        key={uploadKey} 
        onUploadSuccess={handleImageUpload}
        onUploadError={handleImageError}
      />

      {/* Submit and Cancel Buttons */}
      <div className="space-y-3">
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white py-3 sm:py-3.5 px-6 rounded-md font-medium text-base sm:text-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors active:scale-95 touch-manipulation"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {isEditing ? 'Updating Product...' : 'Adding Product...'}
            </span>
          ) : (
            isEditing ? 'Update Product' : 'Add Product'
          )}
        </button>

        {isEditing && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="w-full bg-gray-100 text-gray-700 py-3 sm:py-3.5 px-6 rounded-md font-medium text-base sm:text-lg hover:bg-gray-200 disabled:bg-gray-100 disabled:text-gray-400 transition-colors active:scale-95 touch-manipulation"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
